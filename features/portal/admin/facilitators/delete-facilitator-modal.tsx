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
  useToast,
} from '@chakra-ui/react'
import { FiTrash2, FiAlertTriangle } from 'react-icons/fi'
import {
  deleteFacilitatorCompletely,
  getFacilitatorDeletionSummary,
} from '../../../../lib/utils/facilitator.utils' // We'll create this
import { FacilitatorData } from '../../../../types/user'

interface DeleteFacilitatorModalProps {
  isOpen: boolean
  onClose: () => void
  facilitator: FacilitatorData | null
  onFacilitatorDeleted: () => void
  adminUser: any // Should ideally be a typed user object, not 'any'
}

export const DeleteFacilitatorModal: React.FC<DeleteFacilitatorModalProps> = ({
  isOpen,
  onClose,
  facilitator,
  onFacilitatorDeleted,
  adminUser,
}) => {
  const [loading, setLoading] = useState(false)
  const [deletionSummary, setDeletionSummary] = useState<{
    userProfile: number // Will always be 1
    authAccount: number // Will always be 1
    assignedItems: number
    // Add other facilitator-specific relations here
  } | null>(null)
  const [loadingSummary, setLoadingSummary] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const toast = useToast()

  // Load deletion summary when modal opens
  useEffect(() => {
    if (isOpen && facilitator) {
      loadDeletionSummary()
    } else {
      // Reset summary when modal closes or facilitator changes
      setDeletionSummary(null)
    }
  }, [isOpen, facilitator])

  const loadDeletionSummary = async () => {
    if (!facilitator) return

    setLoadingSummary(true)
    setError(null)
    try {
      const summary = await getFacilitatorDeletionSummary(facilitator.uid)
      setDeletionSummary(summary)
    } catch (error) {
      console.error('Error loading deletion summary:', error)
      setError(
        'Failed to load deletion summary. You may still proceed with deletion, but some data might remain.',
      )
    } finally {
      setLoadingSummary(false)
    }
  }

  const handleDelete = async () => {
    if (!facilitator || !adminUser) return

    setLoading(true)
    setError(null)

    try {
      const result = await deleteFacilitatorCompletely(
        facilitator.uid,
        adminUser.uid,
      )

      if (result.success) {
        // Success feedback
        toast({
          title: 'Deletion Successful',
          description: `${facilitator.fullName} has been permanently removed from the system.`,
          status: 'success',
          duration: 5000,
          isClosable: true,
          position: 'top',
        })
        onFacilitatorDeleted()
        onClose()
      } else {
        // Provide more specific error messages if possible
        setError(
          result.error || 'Failed to delete facilitator. Please try again.',
        )
      }
    } catch (error: any) {
      console.error('Error in handleDelete:', error)
      // Generic error message is good for security
      setError('An unexpected error occurred during deletion.')
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

  const totalRecordsToDelete = deletionSummary
    ? deletionSummary.userProfile +
      deletionSummary.authAccount +
      deletionSummary.assignedItems
    : 2 // Fallback: just the profile and auth account

  return (
    <Modal
      isOpen={isOpen}
      onClose={onClose}
      size="lg"
      closeOnOverlayClick={!loading}
    >
      <ModalOverlay />
      <ModalContent>
        <ModalHeader color="red.600">
          <HStack>
            <FiTrash2 />
            <Text>Delete Facilitator</Text> {/* Changed from Student */}
          </HStack>
        </ModalHeader>

        <ModalBody>
          {error && (
            <Alert status="error" mb={4} variant="left-accent">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          )}

          <VStack spacing={4} align="stretch">
            {/* Warning */}
            <Alert status="warning" variant="left-accent">
              <AlertIcon />
              <AlertDescription>
                This action cannot be undone. The facilitator account and all
                associated data will be permanently deleted.
              </AlertDescription>
            </Alert>

            {/* Facilitator Info */}
            {facilitator && (
              <Box p={4} bg="gray.50" borderRadius="md">
                <Text fontWeight="bold" mb={2}>
                  Facilitator Information {/* Changed from Student */}
                </Text>
                <VStack align="start" spacing={1}>
                  <Text>
                    <strong>Name:</strong> {facilitator.fullName}
                  </Text>
                  <Text>
                    <strong>Email:</strong> {facilitator.email}
                  </Text>
                  <Text>
                    <strong>Phone:</strong> {facilitator.phone || 'N/A'}
                  </Text>
                  <Text>
                    <strong>Joined:</strong> {formatDate(facilitator.createdAt)}
                  </Text>
                  <Text>
                    <strong>Status:</strong>
                    <Badge
                      ml={2}
                      colorScheme={facilitator.isActive ? 'green' : 'red'}
                    >
                      {facilitator.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                    <Badge
                      ml={2}
                      colorScheme={
                        facilitator.emailVerified ? 'green' : 'yellow'
                      }
                    >
                      {facilitator.emailVerified ? 'Verified' : 'Unverified'}
                    </Badge>
                  </Text>
                </VStack>
              </Box>
            )}

            <Divider />

            {/* Deletion Summary */}
            <Box>
              <Text fontWeight="bold" mb={3}>
                <FiAlertTriangle
                  style={{ display: 'inline', marginRight: '8px' }}
                />
                Data That Will Be Deleted
              </Text>

              {loadingSummary ? (
                <HStack justify="center" py={4}>
                  <Spinner size="sm" />
                  <Text>Calculating impact...</Text>
                </HStack>
              ) : deletionSummary ? (
                <VStack align="start" spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text>Firestore User Profile</Text>
                    <Badge colorScheme="red">1 record</Badge>
                  </HStack>

                  <HStack justify="space-between" w="full">
                    <Text>Authentication Account</Text>
                    <Badge colorScheme="red">1 record</Badge>
                  </HStack>

                  {/* UPDATED: Show count of assigned items */}
                  {deletionSummary.assignedItems > 0 && (
                    <HStack justify="space-between" w="full">
                      <Text>Assigned Cohorts & Class Plans</Text>
                      <Badge colorScheme="orange">
                        {deletionSummary.assignedItems} assignments
                      </Badge>
                    </HStack>
                  )}

                  {/* Add other facilitator-specific data points here */}

                  <Divider />
                  <HStack justify="space-between" w="full" fontWeight="bold">
                    <Text>Total Items to Delete</Text>
                    <Badge colorScheme="red" fontSize="md">
                      {2 + deletionSummary.assignedItems} items
                    </Badge>
                  </HStack>
                </VStack>
              ) : (
                <Text color="gray.500" fontStyle="italic">
                  Could not calculate detailed impact. This will delete the
                  facilitator&apos;s core account data.
                </Text>
              )}
            </Box>

            <Divider />

            {/* Final Warning */}
            <Alert status="error" variant="left-accent">
              <AlertIcon />
              <AlertDescription>
                <Text fontWeight="bold">Final Warning:</Text>
                <Text mt={1}>
                  This will permanently delete the facilitator&apos;s account
                  and all associated data. The facilitator will lose access to
                  all portal features and their data cannot be recovered.
                </Text>
              </AlertDescription>
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={onClose}
            isDisabled={loading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="red"
            leftIcon={<FiTrash2 />}
            onClick={handleDelete}
            isLoading={loading}
            loadingText="Deleting..."
            isDisabled={loadingSummary} // Don't allow delete while calculating summary
          >
            Delete Facilitator Permanently
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
