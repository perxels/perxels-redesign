import React, { useState } from 'react'
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
  Divider,
  useToast,
} from '@chakra-ui/react'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { SchoolFeesFilterState } from './SchoolFeesLists'

interface PaymentReminderModalProps {
  isOpen: boolean
  onClose: () => void
  filters: SchoolFeesFilterState
}

interface ReminderResult {
  totalStudents: number
  emailsSent: number
  failedEmails: string[]
  failedEmailsData?: Array<{
    email: string
    fullName: string
    schoolFeeInfo: any
  }>
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
  const toast = useToast()

  const handleSendReminders = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      // Get all students with school fee info
      const usersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
      )

      const snapshot = await getDocs(usersQuery)
      const debtors: Array<{
        id: string
        email: string
        fullName: string
        branch?: string
        schoolFeeInfo: any
      }> = []

      // Filter debtors based on school fee info and filters
      snapshot.forEach((doc) => {
        const data = doc.data()
        const fee = data.schoolFeeInfo

        if (!fee) return

        const totalFee = fee.totalSchoolFee || 0
        const totalApproved = fee.totalApproved || 0
        const outstandingAmount = totalFee - totalApproved

        // Only include debtors (those with outstanding balance)
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

          debtors.push({
            id: doc.id,
            email: data.email || '',
            fullName: data.fullName || 'Student',
            branch: data.branch,
            schoolFeeInfo: fee,
          })
        }
      })

      if (debtors.length === 0) {
        setResult({
          totalStudents: 0,
          emailsSent: 0,
          failedEmails: [],
        })
        return
      }

      // Send payment reminder emails via API
      const response = await fetch('/api/send-payment-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          filters,
          debtors: debtors.map((debtor) => ({
            id: debtor.id,
            email: debtor.email,
            fullName: debtor.fullName,
            branch: debtor.branch,
            schoolFeeInfo: debtor.schoolFeeInfo,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        // Collect failed email data for resend functionality
        const failedEmailsData = data.data.failedEmails
          .map((failedEmail: string) => {
            const debtor = debtors.find(
              (d) => `${d.fullName} (${d.email})` === failedEmail,
            )
            return debtor
              ? {
                  email: debtor.email,
                  fullName: debtor.fullName,
                  schoolFeeInfo: debtor.schoolFeeInfo,
                }
              : null
          })
          .filter(Boolean)

        setResult({
          ...data.data,
          failedEmailsData,
        })

        toast({
          title: 'Payment Reminders Sent',
          description: `${data.data.emailsSent} out of ${data.data.totalStudents} emails were sent successfully.`,
          status: data.data.emailsSent > 0 ? 'success' : 'warning',
          duration: 5000,
          isClosable: true,
        })
      } else {
        setError(data.error || 'Failed to send payment reminders')
        toast({
          title: 'Error',
          description: data.error || 'Failed to send payment reminders',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
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

  const handleResendFailedEmails = async () => {
    if (!result?.failedEmailsData || result.failedEmailsData.length === 0) {
      toast({
        title: 'No Failed Emails',
        description: 'There are no failed emails to resend.',
        status: 'info',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsResending(true)
    setError(null)

    try {
      const response = await fetch('/api/send-payment-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          debtors: result.failedEmailsData.map((debtor) => ({
            id: 'retry', // Not needed for email sending
            email: debtor.email,
            fullName: debtor.fullName,
            branch: '', // Not needed for email sending
            schoolFeeInfo: debtor.schoolFeeInfo,
          })),
        }),
      })

      const data = await response.json()

      if (data.success) {
        const newEmailsSent = data.data.emailsSent
        const newFailedEmails = data.data.failedEmails

        // Update the result with new resend data
        setResult({
          ...result,
          emailsSent: result.emailsSent + newEmailsSent,
          failedEmails: newFailedEmails,
          failedEmailsData: newFailedEmails
            .map((failedEmail: string) => {
              const debtor = result.failedEmailsData?.find(
                (d) => `${d.fullName} (${d.email})` === failedEmail,
              )
              return debtor
                ? {
                    email: debtor.email,
                    fullName: debtor.fullName,
                    schoolFeeInfo: debtor.schoolFeeInfo,
                  }
                : null
            })
            .filter(Boolean),
        })

        toast({
          title: 'Resend Complete',
          description: `${newEmailsSent} out of ${result.failedEmailsData.length} failed emails were resent successfully.`,
          status: newEmailsSent > 0 ? 'success' : 'warning',
          duration: 5000,
          isClosable: true,
        })
      } else {
        setError(data.error || 'Failed to resend payment reminders')
        toast({
          title: 'Resend Error',
          description: data.error || 'Failed to resend payment reminders',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      }
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
                    This will send payment reminder emails to all students with
                    outstanding fees.
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
                  <br />
                  • Emails will be sent immediately
                  <br />
                  • Only students with outstanding balances will receive
                  reminders
                  <br />• Invalid email addresses will be skipped
                </Text>
              </Box>
            </VStack>
          )}

          {isLoading && (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" />
              <Text>Sending payment reminders...</Text>
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
              <Alert status={result.emailsSent > 0 ? 'success' : 'warning'}>
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">
                    {result.emailsSent > 0
                      ? 'Reminders Sent Successfully'
                      : 'No Reminders Sent'}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {result.emailsSent} out of {result.totalStudents} emails
                    were sent successfully.
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
                    <Text fontSize="sm">Emails Sent:</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="green.600">
                      {result.emailsSent}
                    </Text>
                  </HStack>
                  <HStack justify="space-between">
                    <Text fontSize="sm">Failed:</Text>
                    <Text fontSize="sm" fontWeight="semibold" color="red.600">
                      {result.failedEmails.length}
                    </Text>
                  </HStack>
                </VStack>
              </Box>

              {result.failedEmails.length > 0 && (
                <Box>
                  <HStack justify="space-between" align="center" mb={2}>
                    <Text fontWeight="semibold" color="red.600">
                      Failed Emails ({result.failedEmails.length}):
                    </Text>
                    <Button
                      size="sm"
                      colorScheme="orange"
                      variant="outline"
                      onClick={handleResendFailedEmails}
                      isLoading={isResending}
                      loadingText="Resending..."
                      isDisabled={
                        isResending || result.failedEmailsData?.length === 0
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
                    {result.failedEmails.map((email, index) => (
                      <Text key={index} fontSize="xs" color="gray.600">
                        {email}
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
              >
                Send Reminders
              </Button>
            </HStack>
          )}

          {(result || error) && (
            <HStack spacing={3}>
              {result && result.failedEmails.length > 0 && (
                <Button
                  colorScheme="orange"
                  onClick={handleResendFailedEmails}
                  isLoading={isResending}
                  loadingText="Resending..."
                  isDisabled={
                    isResending || result.failedEmailsData?.length === 0
                  }
                >
                  Retry Failed ({result.failedEmails.length})
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
