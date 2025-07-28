import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Spinner,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  FormControl,
  FormLabel,
  Link,
  Flex,
} from '@chakra-ui/react'
import { useAdminNotifications } from '../../../../hooks/useAdminNotifications'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import {
  AdminNotification,
  formatCurrency,
} from '../../../../types/notification.types'
import Image from 'next/image'
import { reviewPaymentInstallment } from '../../../../lib/utils/payment.utils'

interface PaymentActionModalProps {
  isOpen: boolean
  onClose: () => void
  notification: AdminNotification | null
  action: 'approve' | 'reject'
  onConfirm: (rejectionReason?: string) => Promise<void>
  isLoading: boolean
}

function PaymentActionModal({
  isOpen,
  onClose,
  notification,
  action,
  onConfirm,
  isLoading,
}: PaymentActionModalProps) {
  const [rejectionReason, setRejectionReason] = useState('')

  const handleConfirm = async () => {
    if (action === 'reject' && !rejectionReason.trim()) {
      return
    }
    await onConfirm(action === 'reject' ? rejectionReason : undefined)
  }

  const resetModal = () => {
    setRejectionReason('')
    onClose()
  }

  if (!notification) return null

  return (
    <Modal isOpen={isOpen} onClose={resetModal} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {action === 'approve' ? 'Approve Payment' : 'Reject Payment'}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack align="start" spacing={3}>
            <Text>
              <strong>Student:</strong> {notification.data.studentName}
            </Text>
            <Text>
              <strong>Amount:</strong>{' '}
              {formatCurrency(notification.data.amount || 0)}
            </Text>
            <Text>
              <strong>Cohort:</strong> {notification.data.cohort}
            </Text>
            <Text>
              <strong>Class Plan:</strong> {notification.data.classPlan}
            </Text>

            {action === 'reject' && (
              <FormControl isRequired>
                <FormLabel>Rejection Reason</FormLabel>
                <Textarea
                  value={rejectionReason}
                  onChange={(e) => setRejectionReason(e.target.value)}
                  placeholder="Please provide a reason for rejecting this payment..."
                  rows={4}
                />
              </FormControl>
            )}

            <Alert status={action === 'approve' ? 'success' : 'warning'}>
              <AlertIcon />
              <Box>
                <AlertTitle>
                  {action === 'approve'
                    ? 'Approve Payment?'
                    : 'Reject Payment?'}
                </AlertTitle>
                <AlertDescription>
                  {action === 'approve'
                    ? "This payment will be marked as approved and counted towards the student's total."
                    : 'This payment will be rejected and the student will need to resubmit.'}
                </AlertDescription>
              </Box>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={resetModal}>
            Cancel
          </Button>
          <Button
            colorScheme={action === 'approve' ? 'green' : 'red'}
            onClick={handleConfirm}
            isLoading={isLoading}
            isDisabled={action === 'reject' && !rejectionReason.trim()}
          >
            {action === 'approve' ? 'Approve' : 'Reject'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

function NotificationRow({
  notification,
  onApprove,
  onReject,
}: {
  notification: any;
  onApprove: (notification: AdminNotification) => void
  onReject: (notification: AdminNotification) => void
}) {
  // Format date to match design (MM/DD/YYYY)
  const formatDateToDesign = (date: any): string => {
    let validDate: Date

    // Handle Firestore timestamp
    if (date && typeof date === 'object' && date.toDate) {
      validDate = date.toDate()
    } else if (date && typeof date === 'object' && date.seconds) {
      validDate = new Date(date.seconds * 1000)
    } else if (typeof date === 'string') {
      validDate = new Date(date)
    } else if (date instanceof Date) {
      validDate = date
    } else {
      validDate = new Date()
    }

    // Check if the date is valid
    if (isNaN(validDate.getTime())) {
      validDate = new Date()
    }

    return validDate.toLocaleDateString('en-US', {
      day: '2-digit',
      month: '2-digit',
      year: 'numeric',
    })
  }

  const formattedDate = formatDateToDesign(notification.createdAt)
  
  // Check if notification needs action (unread payment submissions)
  const needsAction = !notification.read && notification.type === 'payment_submitted'
  
  // Determine background color based on read status
  const bgColor = notification.read ? "gray.50" : "blue.50"
  const hoverBgColor = notification.read ? "gray.100" : "blue.100"

  return (
    <Box
      bg={bgColor}
      borderRadius="md"
      p={{ base: 3, md: 4 }}
      _hover={{ bg: hoverBgColor }}
      transition="all 0.2s"
      borderLeft={!notification.read ? "4px solid" : "none"}
      borderLeftColor={!notification.read ? "blue.500" : "transparent"}
      position="relative"
    >
      {/* Mobile Layout */}
      <Box display={{ base: 'block', md: 'none' }}>
        <VStack spacing={3} align="stretch">
          <Flex justify="space-between" align="center">
            <HStack spacing={2}>
              <Text color="black" fontSize="sm" fontWeight="medium">
                {formattedDate}
              </Text>
              {!notification.read && (
                <Box
                  bg="blue.500"
                  color="white"
                  px={2}
                  py={0.5}
                  borderRadius="full"
                  fontSize="xs"
                  fontWeight="bold"
                >
                  NEW
                </Box>
              )}
            </HStack>
            <Text fontWeight="bold" color="black" fontSize="lg">
              ₦{(notification.data.amount || 0).toLocaleString()}
            </Text>
          </Flex>
          
          <Text 
            fontWeight={notification.read ? "medium" : "bold"} 
            color="black" 
            fontSize="md"
          >
            {notification.data.studentName}
          </Text>
          
          {notification.data.paymentReceiptUrl && (
            <Link
              href={notification.data.paymentReceiptUrl}
              isExternal
              color="blue.600"
              fontSize="sm"
              _hover={{ textDecoration: 'underline' }}
            >
              View Receipt
            </Link>
          )}
          
          {needsAction && (
            <HStack spacing={2} justify="center">
              <Button
                size="sm"
                colorScheme="purple"
                onClick={() => onApprove(notification)}
                flex="1"
                maxW="120px"
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={() => onReject(notification)}
                flex="1"
                maxW="120px"
              >
                Reject
              </Button>
            </HStack>
          )}
        </VStack>
      </Box>

      {/* Desktop Layout */}
      <HStack display={{ base: 'none', md: 'flex' }} justify="space-between" align="center" w="full">
        {/* Date */}
        <HStack spacing={2} minW="120px">
          <Text color="black" fontSize="sm">
            {formattedDate}
          </Text>
          {!notification.read && (
            <Box
              bg="blue.500"
              color="white"
              px={2}
              py={0.5}
              borderRadius="full"
              fontSize="xs"
              fontWeight="bold"
            >
              NEW
            </Box>
          )}
        </HStack>

        {/* Student Name */}
        <Text 
          fontWeight={notification.read ? "medium" : "bold"} 
          color="black" 
          minW="150px"
        >
          {notification.data.studentName}
        </Text>

        {/* Amount */}
        <Text fontWeight="bold" color="black" minW="100px">
          {(notification.data.amount || 0).toLocaleString()}
        </Text>

        {/* Receipt URL (truncated) */}
        <Box minW="120px">
          {notification.data.paymentReceiptUrl && (
            <Link
              href={notification.data.paymentReceiptUrl}
              isExternal
              color="black"
              fontSize="sm"
              _hover={{ textDecoration: 'underline' }}
            >
              {notification.data.paymentReceiptUrl.length > 15
                ? `${notification.data.paymentReceiptUrl.substring(0, 24)}....`
                : notification.data.paymentReceiptUrl}
            </Link>
          )}
        </Box>

        {/* Action Buttons or Status */}
        <Box minW="160px">
          {needsAction ? (
            <HStack spacing={3}>
              <Button
                size="sm"
                colorScheme="purple"
                onClick={() => onApprove(notification)}
                px={6}
              >
                Approve
              </Button>
              <Button
                size="sm"
                variant="outline"
                colorScheme="red"
                onClick={() => onReject(notification)}
                px={6}
              >
                Reject
              </Button>
            </HStack>
          ) : (
            <Text fontSize="sm" color="gray.500" fontStyle="italic">
              {notification.read ? 'Processed' : 'No action required'}
            </Text>
          )}
        </Box>
      </HStack>
    </Box>
  )
}

export function NotificationsPage() {
  const { user } = usePortalAuth()
  const { notifications, isLoading, markAsRead, refreshNotifications } =
    useAdminNotifications()
  const [actionLoading, setActionLoading] = useState(false)
  const [selectedNotification, setSelectedNotification] =
    useState<AdminNotification | null>(null)
  const [actionType, setActionType] = useState<'approve' | 'reject'>('approve')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  
  // Show all payment notifications (both read and unread)
  const paymentNotifications = notifications.filter(
    (n) => n.type === 'payment_submitted',
  )

  const handleApprove = (notification: AdminNotification) => {
    setSelectedNotification(notification)
    setActionType('approve')
    onOpen()
  }

  const handleReject = (notification: AdminNotification) => {
    setSelectedNotification(notification)
    setActionType('reject')
    onOpen()
  }

  const handlePaymentAction = async (rejectionReason?: string) => {
    if (!selectedNotification || !user?.uid) return

    setActionLoading(true)
    try {
      // Safety check: ensure we have the correct student ID
      const studentId = selectedNotification.data.studentId
      if (!studentId) {
        throw new Error('Student ID not found in notification data')
      }
      
      // Step 1: Handle Firebase operations (client-side)
      const result = await reviewPaymentInstallment({
        uid: studentId,
        installmentNumber: selectedNotification.data.installmentNumber as 1 | 2 | 3,
        adminUid: user.uid,
        action: actionType,
        ...(rejectionReason && { rejectionReason }),
      })

      if (!result.success) {
        throw new Error(result.error || 'Failed to process payment action')
      }

      // Step 2: Send notifications and emails (server-side)
      let notificationSuccess = false
      if (result.notificationData) {
        const notificationResponse = await fetch('/api/send-payment-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify(result.notificationData),
        })
        
        if (!notificationResponse.ok) {
          const errorText = await notificationResponse.text()
          throw new Error(`Failed to send notification: ${errorText}`)
        } else {
          notificationSuccess = true
        }
      } else {
        notificationSuccess = true // No notification needed
      }

      // Only proceed if notifications were sent successfully
      if (!notificationSuccess) {
        throw new Error('Failed to send notifications - payment status not updated')
      }

      // Mark notification as read
      if (selectedNotification.id) {
        await markAsRead(selectedNotification.id)
      }

      toast({
        title: `Payment ${
          actionType === 'approve' ? 'Approved' : 'Rejected'
        }! ✅`,
        description: `The payment has been ${
          actionType === 'approve' ? 'approved' : 'rejected'
        } successfully.`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      // Refresh notifications
      refreshNotifications()
      onClose()
    } catch (error: any) {
      console.error('Payment action error:', error)
      toast({
        title: 'Action Failed',
        description: error.message || 'Failed to process payment action',
        status: 'error',
        duration: 8000,
        isClosable: true,
      })
    } finally {
      setActionLoading(false)
    }
  }

  return (
    <Box w="full" p={{ base: 4, md: 6 }} px={0}>
      <VStack align="stretch" spacing={6}>
        {/* Header */}
        <Box
          bg="gray.600"
          color="white"
          px={{ base: 4, md: 6 }}
          py={{ base: 3, md: 4 }}
          borderRadius="lg"
          maxW={{ base: "full", md: "300px" }}
        >
          <VStack spacing={3}>
            <Box w={{ base: 8, md: 12 }} h={{ base: 8, md: 12 }}>
              <Image
                src="/assets/icons/graph.svg"
                alt="graph"
                width={48}
                height={48}
              />
            </Box>
            <Text fontSize={{ base: "xl", md: "2xl", lg: "3xl" }} fontWeight={600}>
              Notifications
            </Text>
          </VStack>
        </Box>

        {/* Notifications List */}
        <Box>
          {isLoading ? (
            <Flex justify="center" p={8}>
              <Spinner size="lg" color="blue.500" />
            </Flex>
          ) : paymentNotifications.length === 0 ? (
            <Flex justify="center" p={8}>
              <VStack spacing={3}>
                <Text fontSize="xl">🔔</Text>
                <Text color="gray.500" textAlign="center">
                  No notifications yet
                </Text>
                <Text fontSize="sm" color="gray.400" textAlign="center">
                  Payment notifications will appear here for review
                </Text>
              </VStack>
            </Flex>
          ) : (
            <VStack spacing={4} align="stretch">
              {paymentNotifications.map((notification) => (
                <NotificationRow
                  key={notification.id || Math.random()}
                  notification={notification}
                  onApprove={handleApprove}
                  onReject={handleReject}
                />
              ))}
            </VStack>
          )}
        </Box>
      </VStack>

      {/* Action Modal */}
      <PaymentActionModal
        isOpen={isOpen}
        onClose={onClose}
        notification={selectedNotification}
        action={actionType}
        onConfirm={handlePaymentAction}
        isLoading={actionLoading}
      />
    </Box>
  )
}
