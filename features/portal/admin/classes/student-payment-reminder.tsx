import React from 'react'
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
  Box,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { FiBell } from 'react-icons/fi'

interface StudentData {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: string
  emailVerified: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  createdAt: any
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  gender?: string
  occupation?: string
  owingStatus?: string
  address?: string
  guardianName?: string
  guardianPhone?: string
}

interface ReminderConfirmationModalProps {
  isOpen: boolean
  onClose: () => void
  onConfirm: () => void
  student: StudentData | null
  isLoading: boolean
}

export function ReminderConfirmationModal({
  isOpen,
  onClose,
  onConfirm,
  student,
  isLoading,
}: ReminderConfirmationModalProps) {
  if (!student) return null

  const getPaymentDetails = () => {
    const schoolFeeInfo = student.schoolFeeInfo
    if (!schoolFeeInfo) return null

    const totalFee = schoolFeeInfo.totalSchoolFee || 0
    const totalPaid = schoolFeeInfo.totalApproved || 0
    const outstandingAmount = Math.max(0, totalFee - totalPaid)

    return { totalFee, totalPaid, outstandingAmount }
  }

  const paymentDetails = getPaymentDetails()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack spacing={2} align="flex-start">
            <Box display="flex" alignItems="center" gap={2}>
              <FiBell color="#ED8936" />
              <Text>Send Payment Reminder</Text>
            </Box>
            <Text fontSize="md" color="gray.600" fontWeight="normal">
              Confirm sending payment reminder to student
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            <Alert status="info">
              <AlertIcon />
              <Text fontSize="sm">
                This will send an in-app notification to the student about their
                outstanding payment.
              </Text>
            </Alert>

            <Box bg="gray.50" p={3} borderRadius="md">
              <Text fontWeight="semibold" mb={2}>
                Student Details:
              </Text>
              <VStack spacing={1} align="stretch">
                <Text fontSize="sm">
                  <strong>Name:</strong> {student.fullName}
                </Text>
                <Text fontSize="sm">
                  <strong>Email:</strong> {student.email}
                </Text>
                <Text fontSize="sm">
                  <strong>Cohort:</strong>{' '}
                  {student.schoolFeeInfo?.cohort || 'Not specified'}
                </Text>
              </VStack>
            </Box>

            {paymentDetails && (
              <Box
                bg="orange.50"
                p={3}
                borderRadius="md"
                border="1px solid"
                borderColor="orange.200"
              >
                <Text fontWeight="semibold" mb={2} color="orange.800">
                  Payment Information:
                </Text>
                <VStack spacing={1} align="stretch">
                  <Text fontSize="sm">
                    <strong>Total Fee:</strong> ₦
                    {paymentDetails.totalFee.toLocaleString()}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Amount Paid:</strong> ₦
                    {paymentDetails.totalPaid.toLocaleString()}
                  </Text>
                  <Text fontSize="sm">
                    <strong>Outstanding:</strong>
                    <Text as="span" color="red.600" fontWeight="bold" ml={1}>
                      ₦{paymentDetails.outstandingAmount.toLocaleString()}
                    </Text>
                  </Text>
                </VStack>
              </Box>
            )}

            <Text fontSize="sm" color="gray.600" textAlign="center">
              Are you sure you want to send this payment reminder?
            </Text>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="orange"
            onClick={onConfirm}
            isLoading={isLoading}
            loadingText="Sending..."
            leftIcon={<FiBell />}
          >
            Send Reminder
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
