import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, getDocs, orderBy, updateDoc, doc, writeBatch } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { usePortalAuth } from './usePortalAuth'

interface AdminNotification {
  id: string
  type: string
  title: string
  message: string
  data: {
    studentId: string
    studentName: string
    studentEmail: string
    amount?: number
    installmentNumber?: number
    paymentReceiptUrl?: string
    cohort?: string
    classPlan?: string
  }
  read: boolean
  createdAt: Date
  adminId: string
}

interface UseAdminNotificationsReturn {
  notifications: AdminNotification[]
  unreadCount: number
  isLoading: boolean
  fetchNotifications: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => void
}

export function useAdminNotifications(): UseAdminNotificationsReturn {
  const { user, portalUser } = usePortalAuth()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)

  // Fetch notifications
  const fetchNotifications = useCallback(async () => {
    if (!user?.uid || portalUser?.role !== 'admin') return

    setIsLoading(true)
    try {

      
      // Query notifications for this admin user
      const q = query(
        collection(portalDb, 'notifications'),
        where('adminId', '==', user.uid),
        orderBy('createdAt', 'desc')
      )
      
      const snapshot = await getDocs(q)
      const adminNotifications: AdminNotification[] = snapshot.docs
        .map(doc => {
          const data = doc.data()
          return {
            id: doc.id,
            type: data.type || '',
            title: data.title || '',
            message: data.message || '',
            data: data.data || {},
            read: data.read || false,
            createdAt: data.createdAt?.toDate() || new Date(),
            adminId: data.adminId || '',
          }
        })
        .slice(0, 20) // Limit to 20 notifications
      
      setNotifications(adminNotifications)
      
      // Calculate unread count
      const unreadCount = adminNotifications.filter(n => !n.read).length
      setUnreadCount(unreadCount)
      

    } catch (error) {
      console.error('❌ Error fetching admin notifications:', error)
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
      console.error('❌ Error marking notification as read:', error)
      throw error
    }
  }, [user?.uid])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.uid || unreadCount === 0) return

    try {

      
      // Get all unread notifications for this admin
      const unreadNotifications = notifications.filter(n => !n.read && n.adminId === user.uid)
      
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
      console.error('❌ Error marking all notifications as read:', error)
      throw error
    }
  }, [user?.uid, unreadCount, notifications])

  // Manual refresh function
  const refreshNotifications = useCallback(() => {
    fetchNotifications()
  }, [fetchNotifications])

  // Fetch notifications when hook is first used
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'admin') {
      fetchNotifications()
    }
  }, [user?.uid, portalUser?.role, fetchNotifications])

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'admin') {
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