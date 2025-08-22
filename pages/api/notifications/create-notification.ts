import type { NextApiRequest, NextApiResponse } from 'next'


interface CreateNotificationRequest {
  type: 'payment_submitted'
  userId: string // Changed from admin-specific fields
  title: string
  message: string
  data: {
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

interface CreateNotificationResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    type: string
    title: string
    message: string
    htmlContent?: string
    userId: string
    data?: any
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateNotificationResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      type,
      userId,
      title,
      message,
      data,
    } = req.body as CreateNotificationRequest

    // Validate required fields
    if (!type || !userId || !title || !message || !data) {
      return res.status(400).json({
        success: false,
        error: 'All notification fields are required',
      })
    }

    // Client will handle Firebase operations
    // Server only validates and returns success response
    
    return res.status(200).json({
      success: true,
      message: 'Notification creation should be handled on the client side using Firestore operations.',
      data: {
        type,
        title,
        message,
        userId,
        data,
      }
    })

  } catch (error: any) {
    console.error('❌ Create notification API error:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    })
    return res.status(500).json({
      success: false,
      error: 'Failed to create notification',
    })
  }
} 