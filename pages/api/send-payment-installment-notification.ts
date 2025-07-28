import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { sendPaymentNotificationEmail } from '../../lib/utils/email.utils'

interface SendPaymentInstallmentNotificationRequest {
  studentId: string
  studentName: string
  studentEmail: string
  amount: number
  installmentNumber: number
  paymentReceiptUrl: string
  cohort: string
  classPlan: string
}

interface SendPaymentInstallmentNotificationResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendPaymentInstallmentNotificationResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      studentId,
      studentName,
      studentEmail,
      amount,
      installmentNumber,
      paymentReceiptUrl,
      cohort,
      classPlan,
    } = req.body as SendPaymentInstallmentNotificationRequest

    // Validate required fields
    if (!studentId || !studentName || !amount || !installmentNumber || !paymentReceiptUrl || !cohort || !classPlan) {
      return res.status(400).json({
        success: false,
        error: 'All required fields are needed',
      })
    }
    
    // Get all admin users
    const adminUsersQuery = query(
      collection(portalDb, 'users'),
      where('role', '==', 'admin')
    )
    
    const adminUsersSnapshot = await getDocs(adminUsersQuery)
    const adminUsers = adminUsersSnapshot.docs
    
    // Extract admin emails for email notification
    const adminEmails = adminUsers.map(doc => doc.data().email).filter(Boolean)
    
    // Create notification for each admin
    for (const adminDoc of adminUsers) {
      const adminId = adminDoc.id
      
      const notificationPayload = {
        type: 'payment_submitted',
        userId: adminId, // Use admin's UID as userId
        title: 'Payment Submitted',
        message: `${studentName} has submitted installment ${installmentNumber} payment of ₦${Number(amount).toLocaleString()}`,
        data: {
          studentId: studentId, // Use the actual student's ID
          studentName,
          studentEmail,
          amount: Number(amount),
          installmentNumber,
          paymentReceiptUrl,
          cohort,
          classPlan,
        },
      }
      
      const notificationResponse = await fetch(`${process.env.NEXT_PUBLIC_BASE_URL || 'http://localhost:3000'}/api/notifications/create-notification`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(notificationPayload),
      })

      if (!notificationResponse.ok) {
        console.error(`Failed to create notification for admin ${adminId}:`, notificationResponse.statusText)
        const errorText = await notificationResponse.text()
        console.error('Notification error details:', errorText)
      } else {
        const notificationResult = await notificationResponse.json()
      }
    }
    
    // Send email notification to all admins
    if (adminEmails.length > 0) {
      const emailResult = await sendPaymentNotificationEmail(
        adminEmails,
        studentName,
        studentEmail,
        Number(amount),
        installmentNumber,
        cohort,
        classPlan,
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

    return res.status(200).json({
      success: true,
      message: 'Notification and email sent successfully',
    })

  } catch (error: any) {
    console.error('Send payment installment notification API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to send notification and email',
    })
  }
} 