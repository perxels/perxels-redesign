import { useState } from 'react'
import { doc, updateDoc, getDoc, collection, addDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'
import { PaymentInstallment, SchoolFeeInfo, calculateOverallStatus } from '../types/school-fee.types'
import { sendPaymentNotificationEmail, generatePaymentApprovedHtml, generatePaymentRejectedHtml, sendStudentHtmlEmail, generateAdmittedHtml, generateRejectedHtml, sendAdmissionEmail, ONBOARDING_FILES } from '../lib/utils/email.utils'

interface ReviewPaymentData {
  uid: string
  installmentNumber: 1 | 2 | 3
  adminUid: string
  action: 'approve' | 'reject'
  rejectionReason?: string
}

export const usePaymentReview = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const reviewPaymentInstallment = async (reviewData: ReviewPaymentData) => {
    setIsLoading(true)
    
    try {


      const { uid, installmentNumber, adminUid, action, rejectionReason } = reviewData

      // Validate required fields
      if (!uid || !installmentNumber || !adminUid || !action) {
        throw new Error('Student UID, installment number, admin UID, and action are required')
      }

      if (action === 'reject' && !rejectionReason) {
        throw new Error('Rejection reason is required when rejecting a payment')
      }

      // Verify student exists and get current school fee info
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('Student not found')
      }

      // Verify admin exists and has admin role
      const adminDoc = await getDoc(doc(portalDb, 'users', adminUid))
      if (!adminDoc.exists()) {
        throw new Error('Admin not found')
      }

      const adminData = adminDoc.data()
      if (adminData?.role !== 'admin') {
        throw new Error('Only admins can review payment installments')
      }

      const userData = userDoc.data()
      const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

      if (!schoolFeeInfo || !schoolFeeInfo.payments || schoolFeeInfo.payments.length === 0) {
        throw new Error('No school fee information found for this student')
      }

      // Find the installment to review
      const installmentIndex = schoolFeeInfo.payments.findIndex(
        payment => payment.installmentNumber === installmentNumber
      )

      if (installmentIndex === -1) {
        throw new Error(`Installment ${installmentNumber} not found`)
      }

      const targetInstallment = schoolFeeInfo.payments[installmentIndex]

      // Check if installment is already reviewed
      if (targetInstallment.status !== 'pending') {
        throw new Error(`Installment ${installmentNumber} has already been ${targetInstallment.status}`)
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

      // Calculate total submitted from valid payments (approved + pending, exclude rejected)
      const totalSubmitted = updatedPayments
        .filter(payment => payment.status === 'approved' || payment.status === 'pending')
        .reduce((sum, payment) => sum + payment.amount, 0)

      // Calculate new overall status
      const newOverallStatus = calculateOverallStatus(updatedPayments, schoolFeeInfo.totalSchoolFee)

      // Update school fee info
      const updatedSchoolFeeInfo: SchoolFeeInfo = {
        ...schoolFeeInfo,
        payments: updatedPayments,
        totalApproved,
        totalSubmitted, // Update total submitted to exclude rejected payments
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
        console.error('❌ Failed to send notification/email to student:', notifyError)
        // Don't fail the main request if notification/email fails
        toast({
          title: 'Warning',
          description: 'Payment reviewed but notification failed to send',
          status: 'warning',
          duration: 3000,
        })
      }

      const actionWord = action === 'approve' ? 'approved' : 'rejected'
      toast({
        title: 'Success',
        description: `Installment ${installmentNumber} has been ${actionWord} successfully`,
        status: 'success',
        duration: 5000,
      })

      return { 
        success: true, 
        newOverallStatus,
        message: `Installment ${installmentNumber} has been ${actionWord} successfully`
      }

    } catch (error: any) {
      console.error('❌ Payment review error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to review payment installment',
        status: 'error',
        duration: 5000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    reviewPaymentInstallment,
    isLoading,
  }
}
