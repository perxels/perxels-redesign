import type { NextApiRequest, NextApiResponse } from 'next'
import { PaymentInstallment, SchoolFeeInfo } from '../../types/school-fee.types'

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
  notificationData?: {
    studentId: string
    studentName: string
    studentEmail: string
    amount: number
    installmentNumber: number
    paymentReceiptUrl: string
    cohort: string
    classPlan: string
  }
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
    const { uid, amount, paymentReceiptUrl, studentName, studentEmail, cohort, classPlan, installmentNumber } = req.body as AddInstallmentRequest & {
      studentName?: string
      studentEmail?: string
      cohort?: string
      classPlan?: string
      installmentNumber?: number
    }

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

    // This API now only returns notification data for client-side processing
    // All Firebase operations should be handled by the client
    
    return res.status(200).json({
      success: true,
      message: `Installment ${installmentNumber || 1} data prepared for client-side processing`,
      installmentNumber: installmentNumber || 1,
      notificationData: {
        studentId: uid,
        studentName: studentName || 'Unknown Student',
        studentEmail: studentEmail || '',
        amount: Number(amount),
        installmentNumber: installmentNumber || 1,
        paymentReceiptUrl,
        cohort: cohort || '',
        classPlan: classPlan || '',
      }
    })

  } catch (error: any) {
    console.error('Add payment installment API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to add payment installment',
    })
  }
} 