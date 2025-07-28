import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, query, where, orderBy, limit, getDocs } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

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
  data?: {
    notifications: Notification[]
    unreadCount: number
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<GetNotificationsResponse>,
) {
  console.log('🔍 get-admin-notifications API called with:', {
    method: req.method,
    query: req.query,
    headers: req.headers
  })

  if (req.method !== 'GET') {
    console.log('❌ Method not allowed:', req.method)
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

    console.log('📋 Parsed parameters:', {
      adminId,
      userId,
      targetUserId,
      limitCount
    })

    // Validate required fields
    if (!targetUserId) {
      console.log('❌ No user ID provided')
      return res.status(400).json({
        success: false,
        error: 'User ID is required (either userId or adminId)',
      })
    }

    console.log('🔍 Querying notifications for user:', targetUserId)

    // Simple query for notifications - get all notifications for this user
    // Temporarily remove orderBy to avoid index requirement
    const notificationsQuery = query(
      collection(portalDb, 'notifications'),
      where('userId', '==', targetUserId),
      limit(parseInt(limitCount))
    )

    console.log('📊 Executing notifications query...')
    const notificationDocs = await getDocs(notificationsQuery)
    console.log('✅ Found notifications:', notificationDocs.size)
    
    const notifications: Notification[] = notificationDocs.docs
      .map(doc => {
        const data = doc.data()
        let createdAt: Date
        
        try {
          if (data.createdAt && typeof data.createdAt.toDate === 'function') {
            createdAt = data.createdAt.toDate()
          } else if (data.createdAt && data.createdAt instanceof Date) {
            createdAt = data.createdAt
          } else if (data.createdAt && typeof data.createdAt === 'string') {
            createdAt = new Date(data.createdAt)
          } else {
            createdAt = new Date()
          }
          
          if (isNaN(createdAt.getTime())) {
            createdAt = new Date()
          }
        } catch (error) {
          console.error('Error converting createdAt:', error)
          createdAt = new Date()
        }
        
        return {
          id: doc.id,
          type: data.type || 'payment_submitted',
          title: data.title || 'Notification',
          message: data.message || '',
          data: data.data || {},
          read: data.read || false,
          createdAt,
          userId: data.userId || targetUserId,
        }
      })
      .sort((a, b) => b.createdAt.getTime() - a.createdAt.getTime()) // Sort in JavaScript instead

    console.log('📊 Getting unread count...')
    // Get unread count
    const unreadQuery = query(
      collection(portalDb, 'notifications'),
      where('userId', '==', targetUserId),
      where('read', '==', false)
    )
    
    const unreadDocs = await getDocs(unreadQuery)
    const unreadCount = unreadDocs.size
    console.log('✅ Unread count:', unreadCount)

    const response = {
      success: true,
      data: {
        notifications,
        unreadCount,
      },
    }

    console.log('✅ Returning response:', response)
    return res.status(200).json(response)

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