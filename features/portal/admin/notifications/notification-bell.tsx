import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Popover,
  PopoverTrigger,
  PopoverContent,
  PopoverBody,
  IconButton,
  Spinner,
  useToast,
  Link,
} from '@chakra-ui/react'
import { FiBell } from 'react-icons/fi'
import { collection, query, where, getDocs, orderBy, updateDoc, doc, writeBatch } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'

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

interface NotificationItemProps {
  notification: AdminNotification
  onMarkAsRead: (notificationId: string) => void
}

function formatDate(date: Date | string | null | undefined): string {
  let validDate: Date
  
  if (!date) {
    validDate = new Date()
  } else if (typeof date === 'string') {
    validDate = new Date(date)
  } else if (date instanceof Date) {
    validDate = date
  } else {
    validDate = new Date()
  }
  
  if (isNaN(validDate.getTime())) {
    validDate = new Date()
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(validDate)
}

function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

function NotificationItem({ notification, onMarkAsRead }: NotificationItemProps) {
  const handleMarkAsRead = () => {
    if (notification.id && !notification.read) {
      onMarkAsRead(notification.id)
    }
  }

  return (
    <Box
      p={3}
      bg={notification.read ? 'gray.50' : 'blue.50'}
      borderRadius="md"
      cursor="pointer"
      onClick={handleMarkAsRead}
      _hover={{ bg: notification.read ? 'gray.100' : 'blue.100' }}
      position="relative"
    >
      {!notification.read && (
        <Box
          position="absolute"
          top={2}
          right={2}
          w={2}
          h={2}
          bg="blue.500"
          borderRadius="full"
        />
      )}
      
      <VStack align="start" spacing={1}>
        <HStack justify="space-between" w="full">
          <Text fontSize="sm" fontWeight="semibold" color="gray.800">
            {notification.title}
          </Text>
          <Text fontSize="xs" color="gray.500">
            {formatDate(notification.createdAt)}
          </Text>
        </HStack>
        
        <Text fontSize="sm" color="gray.600">
          {notification.message}
        </Text>
        
        {notification.data.amount && (
          <Badge colorScheme="green" fontSize="xs">
            {formatCurrency(notification.data.amount)}
          </Badge>
        )}
        
        {notification.data.paymentReceiptUrl && (
          <Link
            href={notification.data.paymentReceiptUrl}
            isExternal
            fontSize="xs"
            color="blue.500"
            _hover={{ textDecoration: 'underline' }}
            onClick={(e) => e.stopPropagation()}
          >
            View Receipt
          </Link>
        )}
      </VStack>
    </Box>
  )
}

export function NotificationBell() {
  const { user, portalUser } = usePortalAuth()
  const [notifications, setNotifications] = useState<AdminNotification[]>([])
  const [unreadCount, setUnreadCount] = useState(0)
  const [isLoading, setIsLoading] = useState(false)
  const [isPopoverOpen, setIsPopoverOpen] = useState(false)
  const toast = useToast()

  // Fetch notifications
  const fetchNotifications = async () => {
    if (!user?.uid) return

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
        .slice(0, 10) // Limit to 10 notifications for bell
      
      setNotifications(adminNotifications)
      
      // Calculate unread count
      const unreadCount = adminNotifications.filter(n => !n.read).length
      setUnreadCount(unreadCount)
      

    } catch (error) {
      console.error('❌ Error fetching admin notifications for bell:', error)
      setNotifications([])
      setUnreadCount(0)
    } finally {
      setIsLoading(false)
    }
  }

  // Mark notification as read
  const markAsRead = async (notificationId: string) => {
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
      console.error('❌ Error marking notification as read from bell:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark notification as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Mark all notifications as read
  const markAllAsRead = async () => {
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

      toast({
        title: 'Success',
        description: 'All notifications marked as read',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })


    } catch (error) {
      console.error('❌ Error marking all notifications as read from bell:', error)
      toast({
        title: 'Error',
        description: 'Failed to mark all notifications as read',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Fetch notifications when component mounts and user is available
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'admin') {
      fetchNotifications()
    }
  }, [user, portalUser])

  // Auto-refresh notifications every 30 seconds
  useEffect(() => {
    if (user?.uid && portalUser?.role === 'admin') {
      const interval = setInterval(fetchNotifications, 30000)
      return () => clearInterval(interval)
    }
  }, [user, portalUser])

  // Don't render for non-admin users
  if (!user || !portalUser || portalUser.role !== 'admin') {
    return null
  }

  return (
    <Popover
      isOpen={isPopoverOpen}
      onOpen={() => setIsPopoverOpen(true)}
      onClose={() => setIsPopoverOpen(false)}
      placement="bottom-end"
    >
      <PopoverTrigger>
        <Box position="relative">
          <IconButton
            aria-label="Notifications"
            icon={<FiBell />}
            variant="ghost"
            size="lg"
            color="gray.600"
            _hover={{ color: 'gray.800' }}
          />
          {unreadCount > 0 && (
            <Badge
              position="absolute"
              top={-1}
              right={-1}
              colorScheme="red"
              borderRadius="full"
              fontSize="xs"
              minW="20px"
              h="20px"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              {unreadCount > 99 ? '99+' : unreadCount}
            </Badge>
          )}
        </Box>
      </PopoverTrigger>
      
      <PopoverContent w="400px" maxH="500px" overflow="hidden">
        <PopoverBody p={0}>
          <VStack spacing={0} align="stretch">
            {/* Header */}
            <Box
              p={4}
              bg="gray.50"
              borderBottom="1px"
              borderColor="gray.200"
            >
              <HStack justify="space-between">
                <Text fontWeight="semibold" fontSize="md">
                  Notifications
                </Text>
                {unreadCount > 0 && (
                  <Text
                    fontSize="sm"
                    color="blue.600"
                    cursor="pointer"
                    onClick={markAllAsRead}
                    _hover={{ textDecoration: 'underline' }}
                  >
                    Mark all as read
                  </Text>
                )}
              </HStack>
            </Box>

            {/* Notifications List */}
            <Box maxH="400px" overflowY="auto">
              {isLoading ? (
                <Box p={8} textAlign="center">
                  <Spinner size="md" color="blue.500" />
                  <Text mt={2} fontSize="sm" color="gray.500">
                    Loading notifications...
                  </Text>
                </Box>
              ) : notifications.length === 0 ? (
                <Box p={8} textAlign="center">
                  <Text fontSize="lg" color="gray.400">
                    🔔
                  </Text>
                  <Text fontSize="sm" color="gray.500" mt={2}>
                    No notifications yet
                  </Text>
                </Box>
              ) : (
                <VStack spacing={0} align="stretch">
                  {notifications.map((notification) => (
                    <Box key={notification.id} borderBottom="1px" borderColor="gray.100">
                      <NotificationItem
                        notification={notification}
                        onMarkAsRead={markAsRead}
                      />
                    </Box>
                  ))}
                </VStack>
              )}
            </Box>
          </VStack>
        </PopoverBody>
      </PopoverContent>
    </Popover>
  )
} 