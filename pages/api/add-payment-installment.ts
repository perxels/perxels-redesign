import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { PaymentInstallment, SchoolFeeInfo } from '../../types/school-fee.types'
import { sendPaymentNotificationEmail } from '../../lib/utils/email.utils'

interface AddInstallmentRequest {
  uid: string
  amount: number
  paymentReceiptUrl: string
}

interface AddInstallmentResponse {
  success: boolean
  message?: string
  error?: string
  installmentNumber?: number
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<AddInstallmentResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, amount, paymentReceiptUrl } = req.body as AddInstallmentRequest

    // Validate required fields
    if (!uid || !amount || !paymentReceiptUrl) {
      return res.status(400).json({
        success: false,
        error: 'User ID, amount, and payment receipt URL are required',
      })
    }

    if (amount <= 0) {
      return res.status(400).json({
        success: false,
        error: 'Payment amount must be greater than 0',
      })
    }

    // Verify user exists and get current school fee info
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    const userData = userDoc.data()
    const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    if (!schoolFeeInfo || !schoolFeeInfo.payments || schoolFeeInfo.payments.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'No initial school fee information found. Please submit your first installment first.',
      })
    }

    // Check if user has already made 3 payments
    if (schoolFeeInfo.payments.length >= 3) {
      return res.status(400).json({
        success: false,
        error: 'Maximum of 3 installments allowed. You have already submitted all allowed payments.',
      })
    }

    // Determine next installment number
    const nextInstallmentNumber = (schoolFeeInfo.payments.length + 1) as 1 | 2 | 3

    // Check if total submitted amount (including this new payment) exceeds total school fee
    const newTotalSubmitted = schoolFeeInfo.totalSubmitted + amount
    if (newTotalSubmitted > schoolFeeInfo.totalSchoolFee) {
      return res.status(400).json({
        success: false,
        error: `Payment amount exceeds remaining balance. Remaining: ₦${schoolFeeInfo.totalSchoolFee - schoolFeeInfo.totalSubmitted}`,
      })
    }

    // Create new installment
    const newInstallment: PaymentInstallment = {
      installmentNumber: nextInstallmentNumber,
      amount: Number(amount),
      paymentReceiptUrl,
      status: 'pending',
      submittedAt: new Date(),
    }

    // Update school fee info
    const updatedPayments = [...schoolFeeInfo.payments, newInstallment]
    const updatedSchoolFeeInfo: SchoolFeeInfo = {
      ...schoolFeeInfo,
      payments: updatedPayments,
      totalSubmitted: newTotalSubmitted,
      updatedAt: new Date(),
    }

    // Update user document
    await updateDoc(doc(portalDb, 'users', uid), {
      schoolFeeInfo: updatedSchoolFeeInfo,
      schoolFeeInfoUpdatedAt: new Date(),
    })

    // Get student details for notification
    const studentName = `${userData.fullName}`.trim() || 'Unknown Student'
    const studentEmail = userData?.email || ''

    // Create notification for admins
    try {
      console.log('📝 Creating notification for payment installment...')
      
      // Get all admin users
      const adminUsersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'admin')
      )
      
      const adminUsersSnapshot = await getDocs(adminUsersQuery)
      const adminUsers = adminUsersSnapshot.docs
      
      console.log('👥 Found admin users:', adminUsers.length)
      
      // Extract admin emails for email notification
      const adminEmails = adminUsers.map(doc => doc.data().email).filter(Boolean)
      console.log('📧 Admin emails for notification:', adminEmails)
      
      // Create notification for each admin
      for (const adminDoc of adminUsers) {
        const adminId = adminDoc.id
        const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/create-notification`, {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            type: 'payment_submitted',
            userId: adminId, // Use admin's UID as userId
            title: 'Payment Submitted',
            message: `${studentName} has submitted installment ${nextInstallmentNumber} payment of ₦${Number(amount).toLocaleString()}`,
            data: {
              studentId: uid,
              studentName,
              studentEmail,
              amount: Number(amount),
              installmentNumber: nextInstallmentNumber,
              paymentReceiptUrl,
              cohort: schoolFeeInfo.cohort,
              classPlan: schoolFeeInfo.classPlan,
            },
          }),
        })

        if (!notificationResponse.ok) {
          console.error(`Failed to create notification for admin ${adminId}:`, notificationResponse.statusText)
          const errorText = await notificationResponse.text()
          console.error('Notification error details:', errorText)
        } else {
          const notificationResult = await notificationResponse.json()
          console.log(`✅ Notification created successfully for admin ${adminId}:`, notificationResult)
        }
      }
      
      // Send email notification to all admins
      if (adminEmails.length > 0) {
        console.log('📧 Sending email notification to admins...')
        const emailResult = await sendPaymentNotificationEmail(
          adminEmails,
          studentName,
          studentEmail,
          Number(amount),
          nextInstallmentNumber,
          schoolFeeInfo.cohort,
          schoolFeeInfo.classPlan,
          new Date().toLocaleString(),
          paymentReceiptUrl,
          {
            appName: 'Perxels Portal'
          }
        )
        
        if (emailResult.success) {
          console.log('✅ Email notification sent successfully:', emailResult)
        } else {
          console.error('❌ Failed to send email notification:', emailResult.error)
        }
      } else {
        console.log('⚠️ No admin emails found for notification')
      }
    } catch (notificationError) {
      console.error('Notification creation error:', notificationError)
      // Don't fail the main request if notification fails
    }

    return res.status(200).json({
      success: true,
      message: `Installment ${nextInstallmentNumber} submitted successfully and is pending admin approval`,
      installmentNumber: nextInstallmentNumber,
    })

  } catch (error: any) {
    console.error('Add payment installment API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to add payment installment',
    })
  }
} 