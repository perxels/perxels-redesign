import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { PaymentInstallment, SchoolFeeInfo, calculateOverallStatus } from '../../types/school-fee.types'
import { sendPaymentNotificationEmail, generatePaymentApprovedHtml, generatePaymentRejectedHtml, sendStudentHtmlEmail, generateAdmittedHtml, generateRejectedHtml, sendAdmissionEmail, ONBOARDING_FILES } from '../../lib/utils/email.utils'

interface ReviewInstallmentRequest {
  uid: string // student uid
  installmentNumber: 1 | 2 | 3
  adminUid: string
  action: 'approve' | 'reject'
  rejectionReason?: string
}

interface ReviewInstallmentResponse {
  success: boolean
  message?: string
  error?: string
  newOverallStatus?: string
}



export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ReviewInstallmentResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, installmentNumber, adminUid, action, rejectionReason } = req.body as ReviewInstallmentRequest

    // Validate required fields
    if (!uid || !installmentNumber || !adminUid || !action) {
      return res.status(400).json({
        success: false,
        error: 'Student UID, installment number, admin UID, and action are required',
      })
    }

    if (action === 'reject' && !rejectionReason) {
      return res.status(400).json({
        success: false,
        error: 'Rejection reason is required when rejecting a payment',
      })
    }

    // Verify student exists and get current school fee info
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'Student not found',
      })
    }

    // Verify admin exists and has admin role
    const adminDoc = await getDoc(doc(portalDb, 'users', adminUid))
    if (!adminDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'Admin not found',
      })
    }

    const adminData = adminDoc.data()
    if (adminData?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only admins can review payment installments',
      })
    }

    const userData = userDoc.data()
    const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    if (!schoolFeeInfo || !schoolFeeInfo.payments || schoolFeeInfo.payments.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No school fee information found for this student',
      })
    }

    // Find the installment to review
    const installmentIndex = schoolFeeInfo.payments.findIndex(
      payment => payment.installmentNumber === installmentNumber
    )

    if (installmentIndex === -1) {
      return res.status(404).json({
        success: false,
        error: `Installment ${installmentNumber} not found`,
      })
    }

    const targetInstallment = schoolFeeInfo.payments[installmentIndex]

    // Check if installment is already reviewed
    if (targetInstallment.status !== 'pending') {
      return res.status(400).json({
        success: false,
        error: `Installment ${installmentNumber} has already been ${targetInstallment.status}`,
      })
    }

    // Update the installment
    const updatedInstallment: PaymentInstallment = {
      ...targetInstallment,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: adminUid,
      ...(action === 'reject' && { rejectionReason }),
    }

    // Update payments array
    const updatedPayments = [...schoolFeeInfo.payments]
    updatedPayments[installmentIndex] = updatedInstallment

    // Calculate new totals
    const totalApproved = updatedPayments
      .filter(payment => payment.status === 'approved')
      .reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate new overall status
    const newOverallStatus = calculateOverallStatus(updatedPayments, schoolFeeInfo.totalSchoolFee)

    // Update school fee info
    const updatedSchoolFeeInfo: SchoolFeeInfo = {
      ...schoolFeeInfo,
      payments: updatedPayments,
      totalApproved,
      overallStatus: newOverallStatus,
      updatedAt: new Date(),
    }

    // Update user document
    await updateDoc(doc(portalDb, 'users', uid), {
      schoolFeeInfo: updatedSchoolFeeInfo,
      schoolFeeInfoUpdatedAt: new Date(),
    })

    // Send notification and email to student
    try {
      const studentEmail = userData?.email || ''
      const studentName = userData?.fullName || 'Student'
      const cohort = schoolFeeInfo.cohort
      const classPlan = schoolFeeInfo.classPlan
      const amount = targetInstallment.amount
      let notificationTitle = ''
      let notificationHtml = ''
      let emailSubject = ''

      if (action === 'approve') {
        notificationTitle = 'Payment Approved!'
        notificationHtml = generatePaymentApprovedHtml(studentName, amount, cohort, classPlan)
        emailSubject = 'Your Payment Has Been Approved! 🎉'

        // Check if this is the first approved payment
        const previouslyApprovedCount = schoolFeeInfo.payments.filter(p => p.status === 'approved').length
        // If previouslyApprovedCount is 0, this is the first approval (since we haven't updated yet)
        if (previouslyApprovedCount === 0) {
          // Send "admitted into Perxels" notification and email with PDF attachment
          const admittedHtml = generateAdmittedHtml(studentName, cohort)
          await addDoc(collection(portalDb, 'notifications'), {
            type: 'admitted',
            title: 'You have been admitted into Perxels',
            message: '',
            htmlContent: admittedHtml,
            read: false,
            createdAt: new Date(),
            userId: uid,
            data: { 
              cohort,
              hasAttachment: true,
              attachments: ONBOARDING_FILES.map(file => ({
                name: file.displayName,
                filename: file.filename,
                description: file.description
              }))
            },
          })
          if (studentEmail && studentEmail.includes('@')) {
            await sendAdmissionEmail(
              studentEmail,
              studentName,
              cohort,
              { appName: 'Perxels Portal' }
            )
          }
        }
      } else {
        notificationTitle = 'Payment Rejected'
        notificationHtml = generateRejectedHtml(studentName, cohort, rejectionReason || '')
        emailSubject = 'Your Payment Was Rejected'
      }

      // Create notification in Firestore for the student
      await addDoc(collection(portalDb, 'notifications'), {
        type: action === 'approve' ? 'payment_approved' : 'payment_rejected',
        title: notificationTitle,
        message: '', // Not used, content is in htmlContent
        htmlContent: notificationHtml,
        read: false,
        createdAt: new Date(),
        userId: uid,
        data: {
          amount,
          cohort,
          classPlan,
          installmentNumber,
          ...(action === 'reject' && { rejectionReason }),
        },
      })

      // Send email to student
      if (studentEmail && studentEmail.includes('@')) {
        await sendStudentHtmlEmail(
          studentEmail,
          emailSubject,
          notificationHtml,
          { appName: 'Perxels Portal' }
        )
      }
    } catch (notifyError) {
      console.error('Failed to send notification/email to student:', notifyError)
      // Don't fail the main request if notification/email fails
    }

    const actionWord = action === 'approve' ? 'approved' : 'rejected'
    return res.status(200).json({
      success: true,
      message: `Installment ${installmentNumber} has been ${actionWord} successfully`,
      newOverallStatus,
    })

  } catch (error: any) {
    console.error('Review payment installment API error:', error)
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to review payment installment',
    })
  }
} 