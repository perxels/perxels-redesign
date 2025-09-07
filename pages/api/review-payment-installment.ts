import type { NextApiRequest, NextApiResponse } from 'next'
import { PaymentInstallment, SchoolFeeInfo, calculateOverallStatus } from '../../types/school-fee.types'
import { sendPaymentNotificationEmail, generatePaymentApprovedHtml, generatePaymentRejectedHtml, sendStudentHtmlEmail, generateAdmittedHtml, generateRejectedHtml, sendAdmissionEmail, ONBOARDING_FILES } from '../../lib/utils/email.utils'

interface ReviewInstallmentRequest {
  uid: string // student uid
  installmentNumber: 1 | 2 | 3 | 4
  adminUid: string
  action: 'approve' | 'reject'
  rejectionReason?: string
}

interface ReviewInstallmentResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    uid: string
    installmentNumber: 1 | 2 | 3 | 4
    adminUid: string
    action: 'approve' | 'reject'
    rejectionReason?: string
    newOverallStatus?: string
  }
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

    // Client will handle Firebase operations and email sending
    // Server only validates and returns success response
    
    const actionWord = action === 'approve' ? 'approved' : 'rejected'
    return res.status(200).json({
      success: true,
      message: `Payment review operations should be handled on the client side. Installment ${installmentNumber} would be ${actionWord}.`,
      data: {
        uid,
        installmentNumber,
        adminUid,
        action,
        rejectionReason,
      }
    })

  } catch (error: any) {
    console.error('Review payment installment API error:', error)
    return res.status(500).json({
      success: false,
      error: error?.message || 'Failed to review payment installment',
    })
  }
} 