import type { NextApiRequest, NextApiResponse } from 'next'

interface MarkAsReadRequest {
  userId: string // Changed from adminId
  notificationId?: string // Mark single notification as read
  markAllAsRead?: boolean // Mark all notifications as read for user
}

interface MarkAsReadResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<MarkAsReadResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { adminId, userId, notificationId, markAllAsRead } =
      req.body as MarkAsReadRequest & { adminId?: string }

    // Support both adminId and userId for backward compatibility
    const targetUserId = userId || adminId

    // Validate required fields
    if (!targetUserId) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required (either userId or adminId)',
      })
    }

    if (!notificationId && !markAllAsRead) {
      return res.status(400).json({
        success: false,
        error: 'Either notificationId or markAllAsRead must be provided',
      })
    }

    // Client will handle Firebase operations
    // Server only validates and returns success response
    
    return res.status(200).json({
      success: true,
      message: 'Mark as read operations should be handled on the client side using Firestore updates.',
    })

  } catch (error: any) {
    console.error('❌ Mark as read API error:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    })
    return res.status(500).json({
      success: false,
      error: 'Failed to mark notification as read',
    })
  }
}
