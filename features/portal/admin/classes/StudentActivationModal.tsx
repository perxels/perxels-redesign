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
  Textarea,
  FormControl,
  FormLabel,
  Alert,
  AlertIcon,
  useToast,
  Box,
  Badge,
} from '@chakra-ui/react'
import { StudentActivationService } from '../../../../lib/studentActivationService'

interface StudentActivationModalProps {
  isOpen: boolean
  onClose: () => void
  student: any
  onStatusChange: () => void
}

export const StudentActivationModal: React.FC<StudentActivationModalProps> = ({
  isOpen,
  onClose,
  student,
  onStatusChange,
}) => {
  const [reason, setReason] = useState('')
  const [isLoading, setIsLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const isActive = student?.isStudentActive !== false
  const action = isActive ? 'deactivate' : 'activate'

  const handleSubmit = async () => {
    if (isActive && !reason.trim()) {
      setError('Please provide a reason for deactivation')
      return
    }

    setIsLoading(true)
    setError(null)

    try {
      const success = await StudentActivationService.updateStudentStatus(
        student.uid,
        !isActive, // Toggle the status
        isActive ? reason : undefined, // Only send reason for deactivation
      )

      if (success) {
        toast({
          title: `Student ${action}d successfully`,
          description: isActive
            ? 'Student has been deactivated'
            : 'Student has been activated',
          status: 'success',
          duration: 5000,
          isClosable: true,
        })
        onStatusChange()
        onClose()
        setReason('')
      } else {
        setError(`Failed to ${action} student. Please try again.`)
      }
    } catch (err: any) {
      setError(
        err.message || `An error occurred while ${action}ing the student`,
      )
    } finally {
      setIsLoading(false)
    }
  }

  const handleClose = () => {
    setReason('')
    setError(null)
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="md">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {isActive ? 'Deactivate Student' : 'Activate Student'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Student Info */}
            <Box p={3} bg="gray.50" borderRadius="md">
              <Text fontWeight="medium">{student?.fullName}</Text>
              <Text fontSize="sm" color="gray.600">
                {student?.email}
              </Text>
              <Text fontSize="sm" color="gray.600">
                {student?.phone}
              </Text>
              <Badge colorScheme={isActive ? 'green' : 'red'} mt={1}>
                Current Status: {isActive ? 'Active' : 'Inactive'}
              </Badge>
            </Box>

            {/* Confirmation Message */}
            <Text>
              Are you sure you want to {action} this student?
              {isActive &&
                ' This will restrict their access to student features.'}
            </Text>

            {/* Reason Input (only for deactivation) */}
            {isActive && (
              <FormControl isRequired>
                <FormLabel>Reason for Deactivation</FormLabel>
                <Textarea
                  value={reason}
                  onChange={(e) => setReason(e.target.value)}
                  placeholder="Please provide a reason for deactivating this student..."
                  rows={4}
                  resize="vertical"
                />
              </FormControl>
            )}

            {/* Previous deactivation reason (if reactivating) */}
            {!isActive && student?.deactivationReason && (
              <Box
                p={3}
                bg="orange.50"
                borderRadius="md"
                borderLeft="4px solid"
                borderColor="orange.400"
              >
                <Text fontSize="sm" fontWeight="medium">
                  Previous Deactivation Reason:
                </Text>
                <Text fontSize="sm" color="gray.700">
                  {student.deactivationReason}
                </Text>
              </Box>
            )}

            {/* Error Alert */}
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="ghost"
            mr={3}
            onClick={handleClose}
            isDisabled={isLoading}
          >
            Cancel
          </Button>
          <Button
            colorScheme={isActive ? 'red' : 'green'}
            onClick={handleSubmit}
            isLoading={isLoading}
            isDisabled={isActive && !reason.trim()}
          >
            {isActive ? 'Deactivate Student' : 'Activate Student'}
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
