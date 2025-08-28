import { useState, useEffect, useCallback } from 'react'
import { collection, query, where, getDocs, orderBy, updateDoc, doc, writeBatch, limit, startAfter, QueryDocumentSnapshot, DocumentData } from 'firebase/firestore'
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
  userId: string
}

interface UseAdminNotificationsReturn {
  notifications: AdminNotification[]
  unreadCount: number
  isLoading: boolean
  isLoadingMore: boolean
  hasMore: boolean
  currentPage: number
  pageSize: number
  fetchNotifications: (page?: number, reset?: boolean) => Promise<void>
  loadMore: () => Promise<void>
  markAsRead: (notificationId: string) => Promise<void>
  updateNotificationStatus: (notificationId: string, status: 'approved' | 'rejected', rejectionReason?: string) => Promise<void>
  markAllAsRead: () => Promise<void>
  refreshNotifications: () => void
}

export function useAdminNotifications(): UseAdminNotificationsReturn {
  const { user, portalUser } = usePortalAuth()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isLoadingMore, setIsLoadingMore] = useState(false)
  const [hasMore, setHasMore] = useState(true)
  const [currentPage, setCurrentPage] = useState(1)
  const [lastDoc, setLastDoc] = useState<QueryDocumentSnapshot<DocumentData> | null>(null)
  const pageSize = 15

  // Initial fetch function
  const initialFetch = useCallback(async () => {
    if (!user?.uid || portalUser?.role !== 'admin') return

    setIsLoading(true)
    try {
      const q = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', user.uid),
        orderBy('read', 'asc'),
        orderBy('createdAt', 'desc'),
        limit(pageSize)
      )
      
      const snapshot = await getDocs(q)
      const newNotifications: AdminNotification[] = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          type: data.type || '',
          title: data.title || '',
          message: data.message || '',
          data: data.data || {},
          read: data.read || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          userId: data.userId || '',
        }
      })

      setNotifications(newNotifications)
      setHasMore(snapshot.docs.length === pageSize)
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      }
      setCurrentPage(1)
      
      // Calculate unread count
      const totalUnread = newNotifications.filter(n => !n.read).length
      setUnreadCount(totalUnread)

    } catch (error) {
      console.error('❌ Error fetching admin notifications:', error)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }, [user?.uid, portalUser?.role, pageSize])

  // Load more notifications
  const loadMore = useCallback(async () => {
    if (!hasMore || isLoadingMore || !lastDoc) return
    
    setIsLoadingMore(true)
    try {
      const q = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', user?.uid),
        orderBy('read', 'asc'),
        orderBy('createdAt', 'desc'),
        startAfter(lastDoc),
        limit(pageSize)
      )
      
      const snapshot = await getDocs(q)
      const newNotifications: AdminNotification[] = snapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          type: data.type || '',
          title: data.title || '',
          message: data.message || '',
          data: data.data || {},
          read: data.read || false,
          createdAt: data.createdAt?.toDate() || new Date(),
          userId: data.userId || '',
        }
      })

      setNotifications(prev => [...prev, ...newNotifications])
      setHasMore(snapshot.docs.length === pageSize)
      if (snapshot.docs.length > 0) {
        setLastDoc(snapshot.docs[snapshot.docs.length - 1])
      }
      setCurrentPage(prev => prev + 1)
      
      // Update unread count
      const newUnreadCount = newNotifications.filter(n => !n.read).length
      setUnreadCount(prev => prev + newUnreadCount)
      
    } catch (error) {
      console.error('❌ Error loading more notifications:', error)
    } finally {
      setIsLoadingMore(false)
    }
  }, [hasMore, isLoadingMore, lastDoc, user?.uid, pageSize])

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

  // Update notification status (for payment processing)
  const updateNotificationStatus = useCallback(async (notificationId: string, status: 'approved' | 'rejected', rejectionReason?: string) => {
    if (!user?.uid) return

    try {
      // Update notification in Firestore
      const notificationRef = doc(portalDb, 'notifications', notificationId)
      await updateDoc(notificationRef, {
        read: true,
        readAt: new Date(),
        'data.status': status,
        ...(status === 'rejected' && rejectionReason && { 'data.rejectionReason': rejectionReason }),
      })

      // Update local state
      setNotifications(prev =>
        prev.map(n =>
          n.id === notificationId
            ? {
                ...n,
                read: true,
                data: {
                  ...n.data,
                  status,
                  ...(status === 'rejected' && rejectionReason && { rejectionReason }),
                }
              }
            : n
        )
      )
      setUnreadCount(prev => Math.max(0, prev - 1))

    } catch (error) {
      console.error('❌ Error updating notification status:', error)
      throw error
    }
  }, [user?.uid])

  // Mark all notifications as read
  const markAllAsRead = useCallback(async () => {
    if (!user?.uid || unreadCount === 0) return

    try {
      // Get all unread notifications for this admin
      const unreadNotifications = notifications.filter(n => !n.read && n.userId === user.uid)
      
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
    initialFetch()
  }, [initialFetch])

  // Fetch notifications when hook is first used
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'admin') {
      initialFetch()
    }
  }, [user?.uid, portalUser?.role, initialFetch])

  // External fetch function (for compatibility)
  const fetchNotifications = useCallback(async (page: number = 1, reset: boolean = false) => {
    if (!user?.uid || portalUser?.role !== 'admin') return

    if (reset || page === 1) {
      // Reset to first page
      refreshNotifications()
    } else if (lastDoc) {
      // Load more pages
      await loadMore()
    }
  }, [user?.uid, portalUser?.role, lastDoc, refreshNotifications, loadMore])

  return {
    notifications,
    unreadCount,
    isLoading,
    isLoadingMore,
    hasMore,
    currentPage,
    pageSize,
    fetchNotifications,
    loadMore,
    markAsRead,
    updateNotificationStatus,
    markAllAsRead,
    refreshNotifications,
  }
} 