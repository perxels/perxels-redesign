import { useState, useEffect, useCallback } from 'react'
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
      const response = await fetch(`/api/notifications/get-admin-notifications?userId=${user.uid}&limitCount=20`)
      
      if (!response.ok) {
        throw new Error('Failed to fetch notifications')
      }

      const result = await response.json()
      if (result.success) {
        setNotifications(result.data.notifications || [])
        setUnreadCount(result.data.unreadCount || 0)
      }
    } catch (error) {
      console.error('Error fetching notifications:', error)
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid, portalUser?.role])

  // Mark notification as read
  const markAsRead = useCallback(async (notificationId: string) => {
    if (!user?.uid) return

    try {
      const response = await fetch('/api/notifications/mark-as-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          notificationId,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark notification as read')
      }

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId ? { ...n, read: true } : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))

    } catch (error) {
      console.error('Error marking notification as read:', error)
      throw error
    }
  }, [user?.uid])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.uid || unreadCount === 0) return

    try {
      const response = await fetch('/api/notifications/mark-as-read', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          userId: user.uid,
          markAllAsRead: true,
        }),
      })

      if (!response.ok) {
        throw new Error('Failed to mark all notifications as read')
      }

      // Update local state
      setNotifications(prev => prev.map(n => ({ ...n, read: true })))
      setUnreadCount(0)

    } catch (error) {
      console.error('Error marking all notifications as read:', error)
      throw error
    }
  }, [user?.uid, unreadCount])

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