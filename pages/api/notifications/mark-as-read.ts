import type { NextApiRequest, NextApiResponse } from 'next'
import {
  doc,
  updateDoc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
  writeBatch,
  orderBy,
  limit,
} from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

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
  console.log('🔍 mark-as-read API called with:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  })

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
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

    console.log('📋 Parsed request body:', {
      adminId,
      userId,
      targetUserId,
      notificationId,
      markAllAsRead
    })

    // Validate required fields
    if (!targetUserId) {
      console.log('❌ No user ID provided')
      return res.status(400).json({
        success: false,
        error: 'User ID is required (either userId or adminId)',
      })
    }

    if (!notificationId && !markAllAsRead) {
      console.log('❌ No action specified')
      return res.status(400).json({
        success: false,
        error: 'Either notificationId or markAllAsRead must be provided',
      })
    }

    if (markAllAsRead) {
      console.log('📊 Marking all notifications as read for user:', targetUserId)
      // Mark all unread notifications as read for this user
      const unreadQuery = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', targetUserId),
        where('read', '==', false),
      )

      const unreadDocs = await getDocs(unreadQuery)
      console.log('📊 Found unread notifications:', unreadDocs.size)
      
      if (unreadDocs.empty) {
        console.log('✅ No unread notifications to mark')
        return res.status(200).json({
          success: true,
          message: 'No unread notifications to mark',
        })
      }

      // Use batch write for better performance
      const batch = writeBatch(portalDb)
      
      unreadDocs.docs.forEach((notificationDoc) => {
        batch.update(notificationDoc.ref, { read: true })
      })

      await batch.commit()
      console.log('✅ Marked all notifications as read')

      return res.status(200).json({
        success: true,
        message: `${unreadDocs.size} notifications marked as read`,
      })

    } else if (notificationId) {
      console.log('📊 Marking single notification as read:', notificationId)
      // Mark single notification as read
      const notificationRef = doc(portalDb, 'notifications', notificationId)
      const notificationDoc = await getDoc(notificationRef)

      if (!notificationDoc.exists()) {
        console.log('❌ Notification not found:', notificationId)
        return res.status(404).json({
          success: false,
          error: 'Notification not found',
        })
      }

      const notificationData = notificationDoc.data()
      console.log('📋 Notification data:', notificationData)
      
      // Verify user has access to this notification
      if (notificationData?.userId !== targetUserId) {
        console.log('❌ Access denied - user mismatch:', {
          notificationUserId: notificationData?.userId,
          targetUserId
        })
        return res.status(403).json({
          success: false,
          error: 'Access denied to this notification',
        })
      }

      // Mark as read
      await updateDoc(notificationRef, { read: true })
      console.log('✅ Notification marked as read')

      return res.status(200).json({
        success: true,
        message: 'Notification marked as read',
      })
    }

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
