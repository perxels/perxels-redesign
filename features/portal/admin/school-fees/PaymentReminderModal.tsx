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
} from '@chakra-ui/react'
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
}

export function PaymentReminderModal({ isOpen, onClose, filters }: PaymentReminderModalProps) {
  const [isLoading, setIsLoading] = useState(false)
  const [result, setResult] = useState<ReminderResult | null>(null)
  const [error, setError] = useState<string | null>(null)

  const handleSendReminders = async () => {
    setIsLoading(true)
    setError(null)
    setResult(null)

    try {
      const response = await fetch('/api/send-payment-reminders', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ filters }),
      })

      const data = await response.json()

      if (data.success) {
        setResult(data.data)
      } else {
        setError(data.error || 'Failed to send payment reminders')
      }
    } catch (err) {
      setError('Network error occurred while sending reminders')
    } finally {
      setIsLoading(false)
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
                    This will send payment reminder emails to all students with outstanding fees.
                  </Text>
                </Box>
              </Alert>

              <Box bg="gray.50" p={4} borderRadius="md">
                <Text fontWeight="semibold" mb={2}>Target Recipients:</Text>
                <Text fontSize="sm" color="gray.600">
                  {getFilterDescription()}
                </Text>
              </Box>

              <Box bg="yellow.50" p={4} borderRadius="md" border="1px solid" borderColor="yellow.200">
                <Text fontWeight="semibold" color="yellow.800" mb={2}>
                  ⚠️ Important Notice
                </Text>
                <Text fontSize="sm" color="yellow.700">
                  • This action cannot be undone<br/>
                  • Emails will be sent immediately<br/>
                  • Only students with outstanding balances will receive reminders<br/>
                  • Invalid email addresses will be skipped
                </Text>
              </Box>
            </VStack>
          )}

          {isLoading && (
            <VStack spacing={4} py={8}>
              <Spinner size="lg" />
              <Text>Sending payment reminders...</Text>
              <Text fontSize="sm" color="gray.500">
                This may take a few moments depending on the number of recipients.
              </Text>
            </VStack>
          )}

          {error && (
            <Alert status="error">
              <AlertIcon />
              <Box>
                <Text fontWeight="bold">Error</Text>
                <Text fontSize="sm" mt={1}>{error}</Text>
              </Box>
            </Alert>
          )}

          {result && (
            <VStack spacing={4} align="stretch">
              <Alert status={result.emailsSent > 0 ? "success" : "warning"}>
                <AlertIcon />
                <Box>
                  <Text fontWeight="bold">
                    {result.emailsSent > 0 ? 'Reminders Sent Successfully' : 'No Reminders Sent'}
                  </Text>
                  <Text fontSize="sm" mt={1}>
                    {result.emailsSent} out of {result.totalStudents} emails were sent successfully.
                  </Text>
                </Box>
              </Alert>

              <Box>
                <Text fontWeight="semibold" mb={2}>Summary:</Text>
                <VStack spacing={2} align="stretch">
                  <HStack justify="space-between">
                    <Text fontSize="sm">Total Students:</Text>
                    <Text fontSize="sm" fontWeight="semibold">{result.totalStudents}</Text>
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
                  <Text fontWeight="semibold" mb={2} color="red.600">
                    Failed Emails ({result.failedEmails.length}):
                  </Text>
                  <Box maxH="100px" overflowY="auto" bg="gray.50" p={2} borderRadius="md">
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
              <Button variant="ghost" onClick={handleClose} isDisabled={isLoading}>
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
            <Button colorScheme="blue" onClick={handleClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
} 