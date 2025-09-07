import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  Text,
  VStack,
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Box,
  Badge,
  useToast,
} from '@chakra-ui/react'
import { collection, getDocs, query, where, addDoc } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { SchoolFeesFilterState } from './SchoolFeesLists'
import { createPaymentReminderNotificationPayload } from '../../../../lib/utils/notification-templates'

interface PaymentReminderModalProps {
  isOpen: boolean
  onClose: () => void
  filters: SchoolFeesFilterState
}

interface ReminderResult {
  totalStudents: number
  notificationsSent: number
  failedNotifications: string[]
  failedNotificationsData?: Array<{
    email: string
    fullName: string
    schoolFeeInfo: any
  }>
}

interface DebtorStudent {
  id: string
  email: string
  fullName: string
  branch?: string
  schoolFeeInfo: any
  selected?: boolean
}

export function PaymentReminderModal({
  isOpen,
  onClose,
  filters,
}: PaymentReminderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [isResending, setIsResending] = useState(false)
  const [result, setResult] = useState<ReminderResult | null>(null)
  const [error, setError] = useState<string | null>(null)
  const [debtorCount, setDebtorCount] = useState<number | null>(null)
  const [isCounting, setIsCounting] = useState(false)
  const [debtors, setDebtors] = useState<DebtorStudent[]>([])
  const [selectedDebtors, setSelectedDebtors] = useState<Set<string>>(new Set())
  const [showStudentList, setShowStudentList] = useState(false)
  const toast = useToast()

  // Auto-count debtors when modal opens or filters change
  useEffect(() => {
    if (isOpen) {
      countDebtors()
    }
  }, [isOpen, filters])

  const handleSelectAll = () => {
    if (selectedDebtors.size === debtors.length) {
      setSelectedDebtors(new Set())
    } else {
      setSelectedDebtors(new Set(debtors.map((d) => d.id)))
    }
  }

  const selectAllByDefault = () => {
    if (debtors.length > 0) {
      setSelectedDebtors(new Set(debtors.map((d) => d.id)))
    }
  }

  const handleSelectStudent = (studentId: string) => {
    const newSelected = new Set(selectedDebtors)
    if (newSelected.has(studentId)) {
      newSelected.delete(studentId)
    } else {
      newSelected.add(studentId)
    }
    setSelectedDebtors(newSelected)
  }

  const getSelectedCount = () => selectedDebtors.size

  const handleSendReminders = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Use selected debtors or all debtors if none selected
      const debtorsToNotify =
        selectedDebtors.size > 0
          ? debtors.filter((d) => selectedDebtors.has(d.id))
          : debtors

      if (debtorsToNotify.length === 0) {
        setResult({
          totalStudents: 0,
          notificationsSent: 0,
          failedNotifications: [],
        })
        return
      }

      // Send in-app payment reminder notifications
      const failedNotifications: string[] = []
      let notificationsSent = 0

      for (const debtor of debtorsToNotify) {
        try {
          const fee = debtor.schoolFeeInfo
          const totalFee = fee.totalSchoolFee || 0
          const totalApproved = fee.totalApproved || 0
          const outstandingAmount = totalFee - totalApproved

          // Create in-app notification for the student using centralized function
          const notificationPayload = createPaymentReminderNotificationPayload(
            debtor.id,
            debtor.fullName,
            fee.cohort || '',
            fee.classPlan || '',
            totalFee,
            totalApproved,
            outstandingAmount,
          )

          // Add notification to Firestore
          await addDoc(
            collection(portalDb, 'notifications'),
            notificationPayload,
          )

          notificationsSent++
          console.log(
            `✅ Payment reminder notification sent to ${debtor.fullName}`,
          )

          // Add a small delay to avoid overwhelming the system
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          console.error(
            `❌ Failed to send notification to ${debtor.fullName}:`,
            error,
          )
          failedNotifications.push(`${debtor.fullName} (${debtor.email})`)
        }
      }

      // Set result
      setResult({
        totalStudents: debtorsToNotify.length,
        notificationsSent,
        failedNotifications,
        failedNotificationsData: failedNotifications
          .map((failedNotification) => {
            const debtor = debtorsToNotify.find(
              (d) => `${d.fullName} (${d.email})` === failedNotification,
            )
            return debtor
              ? {
                  email: debtor.email,
                  fullName: debtor.fullName,
                  schoolFeeInfo: debtor.schoolFeeInfo,
                }
              : null
          })
          .filter(
            (
              item,
            ): item is {
              email: string
              fullName: string
              schoolFeeInfo: any
            } => item !== null,
          ),
      })

      toast({
        title: 'Payment Reminders Sent',
        description: `${notificationsSent} out of ${debtorsToNotify.length} in-app notifications were sent successfully.`,
        status: notificationsSent > 0 ? 'success' : 'warning',
        duration: 5000,
        isClosable: true,
      })
    } catch (err: any) {
      setError(err?.message || 'Failed to send payment reminders')

      toast({
        title: 'Error',
        description: err?.message || 'Failed to send payment reminders',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsLoading(false)
    }
  }

  const handleResendFailedNotifications = async () => {
    if (
      !result?.failedNotificationsData ||
      result.failedNotificationsData.length === 0
    ) {
      toast({
        title: 'No Failed Notifications',
        description: 'There are no failed notifications to resend.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsResending(true)
    setError(null)

    try {
      const failedNotifications: string[] = []
      let notificationsSent = 0

      for (const debtor of result.failedNotificationsData) {
        try {
          const fee = debtor.schoolFeeInfo
          const totalFee = fee.totalSchoolFee || 0
          const totalApproved = fee.totalApproved || 0
          const outstandingAmount = totalFee - totalApproved

          // Create in-app notification for the student using centralized function
          const notificationPayload = createPaymentReminderNotificationPayload(
            debtor.email, // Using email as identifier for resend
            debtor.fullName,
            fee.cohort || '',
            fee.classPlan || '',
            totalFee,
            totalApproved,
            outstandingAmount,
          )

          // Add notification to Firestore
          await addDoc(
            collection(portalDb, 'notifications'),
            notificationPayload,
          )

          notificationsSent++

          // Add a small delay to avoid overwhelming the system
          await new Promise((resolve) => setTimeout(resolve, 100))
        } catch (error) {
          failedNotifications.push(`${debtor.fullName} (${debtor.email})`)
        }
      }

      // Update the result with new resend data
      setResult({
        ...result,
        notificationsSent: result.notificationsSent + notificationsSent,
        failedNotifications,
        failedNotificationsData: failedNotifications
          .map((failedNotification) => {
            const debtor = result.failedNotificationsData?.find(
              (d) => `${d.fullName} (${d.email})` === failedNotification,
            )
            return debtor
              ? {
                  email: debtor.email,
                  fullName: debtor.fullName,
                  schoolFeeInfo: debtor.schoolFeeInfo,
                }
              : null
          })
          .filter(
            (
              item,
            ): item is {
              email: string
              fullName: string
              schoolFeeInfo: any
            } => item !== null,
          ),
      })

      toast({
        title: 'Resend Complete',
        description: `${notificationsSent} out of ${result.failedNotificationsData.length} failed notifications were resent successfully.`,
        status: notificationsSent > 0 ? 'success' : 'warning',
        duration: 5000,
        isClosable: true,
      })
    } catch (err: any) {
      setError(err?.message || 'Failed to resend payment reminders')

      toast({
        title: 'Resend Error',
        description: err?.message || 'Failed to resend payment reminders',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsResending(false)
    }
  }

  const handleClose = () => {
    setResult(null)
    setError(null)
    onClose()
  }

  const getFilterDescription = () => {
    const activeFilters = []

    if (filters.branch && filters.branch !== 'all') {
      activeFilters.push(`Branch: ${filters.branch}`)
    }
    if (filters.classType && filters.classType !== 'all') {
      activeFilters.push(`Class: ${filters.classType}`)
    }
    if (filters.classPlan) {
      activeFilters.push(`Plan: ${filters.classPlan}`)
    }

    return activeFilters.length > 0 ? activeFilters.join(', ') : 'All debtors'
  }

  const countDebtors = async () => {
    setIsCounting(true)
    setDebtorCount(null)
    setDebtors([])
    setSelectedDebtors(new Set())

    try {
      // Get all students with school fee info
      const usersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
      )

      const snapshot = await getDocs(usersQuery)
      let count = 0
      const debtorList: DebtorStudent[] = []

      // Count debtors based on school fee info and filters
      snapshot.forEach((doc) => {
        const data = doc.data()
        const fee = data.schoolFeeInfo

        if (!fee) return

        const totalFee = fee.totalSchoolFee || 0
        const totalApproved = fee.totalApproved || 0
        const outstandingAmount = totalFee - totalApproved

        // Only count debtors (those with outstanding balance)
        if (outstandingAmount > 0) {
          // Apply filters if provided
          if (filters) {
            if (filters.branch && filters.branch !== 'all' && data.branch) {
              if (data.branch.toLowerCase() !== filters.branch.toLowerCase()) {
                return
              }
            }

            if (filters.classPlan && fee.classPlan) {
              if (
                fee.classPlan.toLowerCase() !== filters.classPlan.toLowerCase()
              ) {
                return
              }
            }
          }

          count++
          debtorList.push({
            id: doc.id,
            email: data.email || '',
            fullName: data.fullName || 'Student',
            branch: data.branch,
            schoolFeeInfo: fee,
            selected: false,
          })
        }
      })

      setDebtorCount(count)
      setDebtors(debtorList)

      // Select all students by default
      if (debtorList.length > 0) {
        setSelectedDebtors(new Set(debtorList.map((d) => d.id)))
      }
    } catch (err: any) {
      console.error('Error counting debtors:', err)
      toast({
        title: 'Error',
        description: 'Failed to count debtors. Please try again.',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setIsCounting(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Send Payment Reminders</ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          {!result && !error && (
            <VStack spacing={4} align="stretch">
              <Alert status="info">
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">Payment Reminder Confirmation</Text>
                  <Text fontSize="sm" mt={1}>
                    This will send in-app payment reminder notifications to all
                    students with outstanding fees.
                  </Text>
                </Box>
              </Alert>

              <Box bg="gray.50" p={4} borderRadius="md">
                <Text fontWeight="semibold" mb={2}>
                  Target Recipients:
                </Text>
                <Text fontSize="sm" color="gray.600">
                  {getFilterDescription()}
                </Text>
                <Text fontSize="sm" color="gray.500" mt={2}>
                  <strong>Note:</strong> Notifications will be sent to ALL
                  students with outstanding fees matching your filters.
                </Text>

                {/* Debtor Count Display */}
                <Box
                  mt={3}
                  p={3}
                  bg="blue.50"
                  borderRadius="md"
                  border="1px solid"
                  borderColor="blue.200"
                >
                  <HStack justify="space-between" align="center">
                    <Text fontSize="sm" fontWeight="medium" color="blue.800">
                      Students with Outstanding Fees:
                    </Text>
                    <HStack spacing={2}>
                      {isCounting ? (
                        <Spinner size="sm" color="blue.500" />
                      ) : debtorCount !== null ? (
                        <Badge
                          colorScheme="blue"
                          variant="solid"
                          fontSize="sm"
                          px={3}
                          py={1}
                        >
                          {debtorCount} students
                        </Badge>
                      ) : (
                        <Text fontSize="sm" color="blue.600">
                          Calculating...
                        </Text>
                      )}
                      <Button
                        size="xs"
                        variant="outline"
                        colorScheme="blue"
                        onClick={countDebtors}
                        isDisabled={isCounting}
                        isLoading={isCounting}
                        loadingText="..."
                      >
                        Refresh
                      </Button>
                    </HStack>
                  </HStack>
                  {debtorCount === 0 && (
                    <Text fontSize="xs" color="blue.600" mt={1}>
                      No students found with outstanding fees matching your
                      criteria.
                    </Text>
                  )}

                  {/* Student Selection Controls */}
                  {debtorCount !== null && debtorCount > 0 && (
                    <Box
                      mt={3}
                      pt={3}
                      borderTop="1px solid"
                      borderColor="blue.200"
                    >
                      <HStack justify="space-between" align="center" mb={2}>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="blue.800"
                        >
                          Selection:{' '}
                          <Text
                            as="span"
                            fontSize="xs"
                            color="blue.600"
                            fontWeight="normal"
                          >
                            (All selected by default)
                          </Text>
                        </Text>
                        <HStack spacing={2}>
                          <Text fontSize="xs" color="blue.600">
                            {getSelectedCount()} of {debtorCount || 0} selected
                          </Text>
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="blue"
                            onClick={handleSelectAll}
                          >
                            {selectedDebtors.size === debtors.length
                              ? 'Deselect All'
                              : 'Select All'}
                          </Button>
                          <Button
                            size="xs"
                            variant="outline"
                            colorScheme="blue"
                            onClick={() => setShowStudentList(!showStudentList)}
                          >
                            {showStudentList ? 'Hide List' : 'Show List'}
                          </Button>
                        </HStack>
                      </HStack>

                      {showStudentList && (
                        <Box
                          maxH="200px"
                          overflowY="auto"
                          bg="white"
                          borderRadius="md"
                          p={2}
                        >
                          {debtors.map((debtor) => (
                            <HStack
                              key={debtor.id}
                              spacing={2}
                              p={2}
                              borderRadius="md"
                              bg={
                                selectedDebtors.has(debtor.id)
                                  ? 'blue.50'
                                  : 'transparent'
                              }
                              _hover={{ bg: 'blue.50' }}
                              cursor="pointer"
                              onClick={() => handleSelectStudent(debtor.id)}
                            >
                              <input
                                type="checkbox"
                                checked={selectedDebtors.has(debtor.id)}
                                onChange={() => handleSelectStudent(debtor.id)}
                                style={{ cursor: 'pointer' }}
                              />
                              <Box flex="1">
                                <Text fontSize="sm" fontWeight="medium">
                                  {debtor.fullName}
                                </Text>
                                <Text fontSize="xs" color="gray.600">
                                  {debtor.email} •{' '}
                                  {debtor.schoolFeeInfo?.cohort || 'N/A'}
                                </Text>
                              </Box>
                              <Badge
                                colorScheme="red"
                                variant="subtle"
                                fontSize="xs"
                              >
                                ₦
                                {(
                                  debtor.schoolFeeInfo?.totalSchoolFee -
                                  debtor.schoolFeeInfo?.totalApproved
                                ).toLocaleString()}
                              </Badge>
                            </HStack>
                          ))}
                        </Box>
                      )}
                    </Box>
                  )}
                </Box>
              </Box>

              <Box
                bg="yellow.50"
                p={4}
                borderRadius="md"
                border="1px solid"
                borderColor="yellow.200"
              >
                <Text fontWeight="semibold" color="yellow.800" mb={2}>
                  ⚠️ Important Notice
                </Text>
                <Text fontSize="sm" color="yellow.700">
                  • This action cannot be undone
                  <br />• In-app notifications will be sent immediately to{' '}
                  <strong>{debtorCount || '...'} students</strong>
                  <br />
                  • Only students with outstanding balances will receive
                  reminders
                  <br />• Students will see these notifications in their portal
                </Text>
              </Box>
            </VStack>
          )}

          {isLoading && (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" />
              <Text>Sending payment reminder notifications...</Text>
              <Text fontSize="sm" color="gray.500">
                This may take a few moments depending on the number of
                recipients.
              </Text>
            </VStack>
          )}

          {error && (
            <Alert status="error">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error</Text>
                <Text fontSize="sm" mt={1}>
                  {error}
                </Text>
              </Box>
            </Alert>
          )}

          {result && (
            <VStack spacing={4} align="stretch">
              <Alert
                status={result.notificationsSent > 0 ? 'success' : 'warning'}
              >
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">
                    {result.notificationsSent > 0
                      ? 'Reminders Sent Successfully'
                      : 'No Reminders Sent'}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {result.notificationsSent} out of {result.totalStudents}{' '}
                    in-app notifications were sent successfully.
                  </Text>
                </Box>
              </Alert>

              <Box>
                <Text fontWeight="semibold" mb={2}>
                  Summary:
                </Text>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Students:</Text>
                    <Text fontSize="sm" fontWeight="semibold">
                      {result.totalStudents}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Notifications Sent:</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="green.600">
                      {result.notificationsSent}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Failed:</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">
                      {result.failedNotifications.length}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {result.failedNotifications.length > 0 && (
                <Box>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" color="red.600">
                      Failed Notifications ({result.failedNotifications.length}
                      ):
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      variant="outline"
                      onClick={handleResendFailedNotifications}
                      isLoading={isResending}
                      loadingText="Resending..."
                      isDisabled={
                        isResending ||
                        result.failedNotificationsData?.length === 0
                      }
                    >
                      Retry Failed
                    </Button>
                  </HStack>
                  <Box
                    maxH="100px"
                    overflowY="auto"
                    bg="gray.50"
                    p={2}
                    borderRadius="md"
                  >
                    {result.failedNotifications.map((notification, index) => (
                      <Text key={index} fontSize="xs" color="gray.600">
                        {notification}
                      </Text>
                    ))}
                  </Box>
                </Box>
              )}
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {!result && !error && (
            <HStack spacing={3}>
              <Button
                variant="outline"
                onClick={handleClose}
                isDisabled={isLoading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="purple"
                onClick={handleSendReminders}
                isLoading={isLoading}
                loadingText="Sending..."
                isDisabled={debtorCount === 0 || isCounting}
              >
                {debtorCount !== null && debtorCount > 0
                  ? `Send to ${getSelectedCount()} Students`
                  : 'Send Notifications'}
              </Button>
            </HStack>
          )}

          {(result || error) && (
            <HStack spacing={3}>
              {result && result.failedNotifications.length > 0 && (
                <Button
                  colorScheme="orange"
                  onClick={handleResendFailedNotifications}
                  isLoading={isResending}
                  loadingText="Resending..."
                  isDisabled={
                    isResending || result.failedNotificationsData?.length === 0
                  }
                >
                  Retry Failed ({result.failedNotifications.length})
                </Button>
              )}
              <Button colorScheme="blue" onClick={handleClose}>
                Close
              </Button>
            </HStack>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
