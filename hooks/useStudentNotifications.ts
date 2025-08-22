import { useState, useEffect, useCallback } from 'react'
import { usePortalAuth } from './usePortalAuth'
import { collection, query, where, getDocs, orderBy, updateDoc, doc, writeBatch } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

interface StudentNotification {
  id: string
  title: string
  htmlContent?: string
  read: boolean
  createdAt: any
  data?: {
    cohort?: string
    hasAttachment?: boolean
    attachmentName?: string
    attachments?: Array<{
      name: string
      filename: string
      description: string
    }>
  }
}

interface UseStudentNotificationsReturn {
  notifications: StudentNotification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => void
}

export function useStudentNotifications(): UseStudentNotificationsReturn {
  const { user, portalUser } = usePortalAuth()
  const [notifications, setNotifications] = useState<StudentNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.uid || portalUser?.role !== 'student') return

    setIsLoading(true)
    try {
      const q = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      const snapshot = await getDocs(q)
      const msgs: StudentNotification[] = snapshot.docs
        .map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            title: data.title || '',
            htmlContent: data.htmlContent || '',
            read: data.read || false,
            createdAt: data.createdAt,
            data: data.data || {},
          }
        })
      
      setNotifications(msgs)
      
      // Calculate unread count
      const unreadCount = msgs.filter(msg => !msg.read).length
      setUnreadCount(unreadCount)
    } catch (error) {
      console.error('Error fetching notifications:', error)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid, portalUser?.role])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.uid) return

    try {

      
      // Update notification in Firestore
      const notificationRef = doc(portalDb, 'notifications', notificationId)
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date(),
      })

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))


    } catch (error) {
      console.error('❌ Error marking student notification as read:', error)
      throw error
    }
  }, [user?.uid])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.uid || unreadCount === 0) return

    try {

      
      // Get all unread notifications for this student
      const unreadNotifications = notifications.filter(n => !n.read)
      
      if (unreadNotifications.length === 0) {
  
        return
      }

      // Use batch write for efficiency
      const batch = writeBatch(portalDb)
      
      unreadNotifications.forEach(notification => {
        const notificationRef = doc(portalDb, 'notifications', notification.id)
        batch.update(notificationRef, {
          read: true,
          readAt: new Date(),
        })
      })
      
      await batch.commit()

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)


    } catch (error) {
      console.error('❌ Error marking all student notifications as read:', error)
      throw error
    }
  }, [user?.uid, unreadCount, notifications])

  // Manual refresh function
  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Fetch notifications when hook is first used
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'student') {
      fetchNotifications()
    }
  }, [user?.uid, portalUser?.role, fetchNotifications])

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'student') {
      const interval = setInterval(fetchNotifications, 30000) // 30 seconds
      return () => clearInterval(interval)
    }
  }, [user?.uid, portalUser?.role, fetchNotifications])

  return {
    notifications,
    unreadCount,
    isLoading,
    fetchNotifications,
    markAsRead,
    markAllAsRead,
    refreshNotifications,
  }
}
