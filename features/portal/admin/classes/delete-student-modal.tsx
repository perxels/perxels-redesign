import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  Button,
  Text,
  VStack,
  HStack,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Box,
  Divider,
} from '@chakra-ui/react'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import { deleteStudentCompletely, getStudentDeletionSummary } from '../../../../lib/utils/student.utils'

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
}

interface DeleteStudentModalProps {
  isOpen: boolean
  onClose: () => void
  student: StudentData | null
  onStudentDeleted: () => void
  adminUser: any
}

export const DeleteStudentModal: React.FC<DeleteStudentModalProps> = ({
  isOpen,
  onClose,
  student,
  onStudentDeleted,
  adminUser,
}) => {
  const [loading, setLoading] = useState(false)
  const [deletionSummary, setDeletionSummary] = useState<{
    notifications: number
    videoAccess: number
    ebookAccess: number
    attendanceRecords: number
    comments: number
  } | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [error, setError] = useState<string | null>(null)

  // Load deletion summary when modal opens
  useEffect(() => {
    if (isOpen && student) {
      loadDeletionSummary()
    }
  }, [isOpen, student])

  const loadDeletionSummary = async () => {
    if (!student) return
    
    setLoadingSummary(true)
    try {
      const summary = await getStudentDeletionSummary(student.uid)
      setDeletionSummary(summary)
    } catch (error) {
      console.error('Error loading deletion summary:', error)
      setError('Failed to load deletion summary')
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleDelete = async () => {
    if (!student) return

    setLoading(true)
    setError(null)

    try {
      const result = await deleteStudentCompletely(student.uid, adminUser)
      
      if (result.success) {
        onStudentDeleted()
        onClose()
      } else {
        setError(result.error || 'Failed to delete student')
      }
    } catch (error: any) {
      console.error('Error deleting student:', error)
      setError(error.message || 'An unexpected error occurred')
    } finally {
      setLoading(false)
    }
  }

  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  const totalRecords = deletionSummary ? 
    deletionSummary.notifications + 
    deletionSummary.videoAccess + 
    deletionSummary.ebookAccess + 
    deletionSummary.attendanceRecords + 
    deletionSummary.comments : 0

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="red.600">
          <HStack>
            <FiTrash2 />
            <Text>Delete Student</Text>
          </HStack>
        </ModalHeader>

        <ModalBody>
          {error && (
            <Alert status="error" mb={4}>
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <VStack spacing={4} align="stretch">
            {/* Warning */}
            <Alert status="warning">
              <AlertIcon />
              <AlertDescription>
                This action cannot be undone. All student data will be permanently deleted.
              </AlertDescription>
            </Alert>

            {/* Student Info */}
            {student && (
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>Student Information</Text>
                <VStack align="start" spacing={1}>
                  <Text><strong>Name:</strong> {student.fullName}</Text>
                  <Text><strong>Email:</strong> {student.email}</Text>
                  <Text><strong>Phone:</strong> {student.phone}</Text>
                  <Text><strong>Branch:</strong> {student.branch}</Text>
                  <Text><strong>Joined:</strong> {formatDate(student.createdAt)}</Text>
                  <Text><strong>Status:</strong> 
                    <Badge 
                      ml={2} 
                      colorScheme={student.emailVerified ? 'green' : 'yellow'}
                    >
                      {student.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </Text>
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Deletion Summary */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                <FiAlertTriangle style={{ display: 'inline', marginRight: '8px' }} />
                Data That Will Be Deleted
              </Text>
              
              {loadingSummary ? (
                <HStack justify="center" py={4}>
                  <Spinner size="sm" />
                  <Text>Loading deletion summary...</Text>
                </HStack>
              ) : deletionSummary ? (
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text>User Profile & Account</Text>
                    <Badge colorScheme="red">1 record</Badge>
                  </HStack>
                  
                  {deletionSummary.notifications > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Notifications</Text>
                      <Badge colorScheme="orange">{deletionSummary.notifications} records</Badge>
                    </HStack>
                  )}
                  
                  {deletionSummary.videoAccess > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Video Access Records</Text>
                      <Badge colorScheme="blue">{deletionSummary.videoAccess} records</Badge>
                    </HStack>
                  )}
                  
                  {deletionSummary.ebookAccess > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Ebook Access Records</Text>
                      <Badge colorScheme="purple">{deletionSummary.ebookAccess} records</Badge>
                    </HStack>
                  )}
                  
                  {deletionSummary.attendanceRecords > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Attendance Records</Text>
                      <Badge colorScheme="teal">{deletionSummary.attendanceRecords} records</Badge>
                    </HStack>
                  )}
                  
                  {deletionSummary.comments > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Video Comments</Text>
                      <Badge colorScheme="cyan">{deletionSummary.comments} records</Badge>
                    </HStack>
                  )}

                  <Divider />
                  
                  <HStack justify="space-between" w="full" fontWeight="bold">
                    <Text>Total Records to Delete</Text>
                    <Badge colorScheme="red" size="lg">{totalRecords + 1} records</Badge>
                  </HStack>
                </VStack>
              ) : (
                <Text color="gray.500">Unable to load deletion summary</Text>
              )}
            </Box>

            <Divider />

            {/* Final Warning */}
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>
                <Text fontWeight="bold">Final Warning:</Text>
                <Text mt={1}>
                  This will permanently delete the student&apos;s account and all associated data. 
                  The student will lose access to all portal features and their data cannot be recovered.
                </Text>
              </AlertDescription>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose} isDisabled={loading}>
            Cancel
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={handleDelete}
            isLoading={loading}
            loadingText="Deleting..."
          >
            Delete Student Permanently
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
