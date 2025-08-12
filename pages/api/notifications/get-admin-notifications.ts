import type { NextApiRequest, NextApiResponse } from 'next'

interface Notification {
  id: string
  type: string
  title: string
  message: string
  data: any
  read: boolean
  createdAt: Date
  userId: string // Changed from adminId to userId
}

interface GetNotificationsResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetNotificationsResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { adminId, userId, limitCount = '20' } = req.query as {
      adminId?: string
      userId?: string
      limitCount: string
    }

    // Support both adminId and userId for backward compatibility
    const targetUserId = userId || adminId

    // Validate required fields
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required (either userId or adminId)',
      })
    }

    // Client will handle Firebase operations
    // Server only validates and returns success response
    
    return res.status(200).json({
      success: true,
      message: 'Notifications should be handled on the client side using Firestore queries.',
    })

  } catch (error: any) {
    console.error('❌ Get notifications API error:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    })
    return res.status(500).json({
      success: false,
      error: 'Failed to get notifications',
    })
  }
} 