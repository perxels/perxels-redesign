import type { NextApiRequest, NextApiResponse } from 'next'
import { SchoolFeeInfo, getRemainingBalance, getTotalPending, getNextInstallmentNumber, canAddInstallment } from '../../types/school-fee.types'

interface GetPaymentStatusRequest {
  uid: string
}

interface PaymentStatusResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaymentStatusResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid } = req.query as { uid: string }

    // Validate required fields
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      })
    }

    // Client will handle Firebase operations
    // Server only validates and returns success response
    
    return res.status(200).json({
      success: true,
      message: 'Payment status should be retrieved on the client side using Firestore queries.',
    })

  } catch (error: any) {
    console.error('Get payment status API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
    })
  }
} 