import type { NextApiRequest, NextApiResponse } from 'next'
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
  adminEmails: string[] // Admin emails passed from client
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
      adminEmails,
    } = req.body as SendPaymentInstallmentNotificationRequest

    // Validate required fields
    if (
      !studentId ||
      !studentName ||
      !amount ||
      !installmentNumber ||
      !paymentReceiptUrl ||
      !cohort ||
      !classPlan ||
      !adminEmails
    ) {
      return res.status(400).json({
        success: false,
        error: 'All required fields are needed',
      })
    }

    // Send email notification to all admins
    if (adminEmails && adminEmails.length > 0) {
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
          appName: 'Perxels Portal',
        },
      )

      if (emailResult.success) {
        console.log('✅ Email notification sent successfully:', emailResult)
      } else {
        console.error(
          '❌ Failed to send email notification:',
          emailResult.error,
        )
      }
    } else {
      console.log('⚠️ No admin emails provided for notification')
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
