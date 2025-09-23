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
  VStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Box,
  FormControl,
  FormLabel,
  Select,
  HStack,
  IconButton,
  Badge,
} from '@chakra-ui/react'
import { doc, updateDoc, arrayUnion, serverTimestamp } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { useActiveClasses } from '../../../../hooks/useClasses'
import { classPlans } from '../../../../constant/adminConstants'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { FiX } from 'react-icons/fi'
import { Assignment, FacilitatorData } from '../../../../types/user'

interface AssignToCohortModalProps {
  isOpen: boolean
  onClose: () => void
  facilitator: FacilitatorData
  onAssignmentUpdated: () => void
}

export const AssignToCohortModal: React.FC<AssignToCohortModalProps> = ({
  isOpen,
  onClose,
  facilitator,
  onAssignmentUpdated,
}) => {
  const { portalUser } = usePortalAuth() // Get current admin user
  const [saving, setSaving] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedClassPlan, setSelectedClassPlan] = useState('')
  const { classes, loading: classesLoading } = useActiveClasses()

  const toast = useToast()

  // Reset form when modal opens or facilitator changes
  useEffect(() => {
    if (isOpen) {
      setSelectedCohort('')
      setSelectedClassPlan('')
      setError(null)
    }
  }, [isOpen, facilitator])

  const generateAssignmentId = () => {
    // Simple ID generator using timestamp and random string
    return `assign_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  }

  const handleSave = async () => {
    if (!facilitator || !portalUser) return

    // Validate selection
    if (!selectedCohort || !selectedClassPlan) {
      setError('Please select both a cohort and a class plan')
      return
    }

    setSaving(true)
    setError(null)

    try {
      // Create the new assignment object
      const newAssignment: Assignment = {
        assignmentId: generateAssignmentId(),
        cohort: selectedCohort,
        classPlan: selectedClassPlan,
        assignedAt: new Date(),
        assignedBy: portalUser.uid,
        assignedByName: portalUser?.fullName || portalUser?.email || 'Admin',
      }

      // Update the facilitator's document
      // Use arrayUnion to add to the existing assigned array without overwriting
      await updateDoc(doc(portalDb, 'users', facilitator.uid), {
        assignments: arrayUnion(newAssignment),
        updatedAt: serverTimestamp(),
      })

      toast({
        title: 'Assignment successful',
        description: `${facilitator.fullName} has been assigned to ${selectedCohort} - ${selectedClassPlan}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onAssignmentUpdated()
      onClose()
    } catch (err: any) {
      console.error('Error creating assignment:', err)
      setError('Failed to create assignment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  const handleRemoveAssignment = async (assignmentId: string) => {
    if (!facilitator) return

    setSaving(true)
    try {
      // Filter out the assignment to remove
      const updatedAssignments = facilitator.assignments.filter(
        (a: any) => a.assignmentId !== assignmentId,
      )

      await updateDoc(doc(portalDb, 'users', facilitator.uid), {
        assignments: updatedAssignments,
        updatedAt: serverTimestamp(),
      })

      toast({
        title: 'Assignment removed',
        description: 'The cohort assignment has been removed',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })

      onAssignmentUpdated()
      onClose()
    } catch (err: any) {
      console.error('Error removing assignment:', err)
      setError('Failed to remove assignment. Please try again.')
    } finally {
      setSaving(false)
    }
  }

  if (!facilitator) return null

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader fontSize={20}>
          Assign Cohorts to {facilitator.fullName}
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <VStack spacing={4} align="stretch">
            {error && (
              <Alert status="error" borderRadius="md">
                <AlertIcon />
                {error}
              </Alert>
            )}

            <Text fontWeight="medium" fontSize="md">
              Assign this facilitator to a new cohort and class plan:
            </Text>

            {classesLoading ? (
              <Box textAlign="center" py={4}>
                <Spinner size="lg" />
                <Text mt={2}>Loading cohorts...</Text>
              </Box>
            ) : (
              <HStack spacing={4} align="flex-start">
                <FormControl isRequired>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Select Cohort
                  </FormLabel>
                  <Select
                    placeholder="Choose a cohort"
                    value={selectedCohort}
                    onChange={(e) => setSelectedCohort(e.target.value)}
                    bg="white"
                    size="md"
                    borderRadius="md"
                  >
                    {classes.map((cls) => (
                      <option key={cls.id} value={cls.cohortName}>
                        {cls.cohortName}
                      </option>
                    ))}
                  </Select>
                </FormControl>

                <FormControl isRequired>
                  <FormLabel fontSize="md" fontWeight="medium">
                    Select Class Plan
                  </FormLabel>
                  <Select
                    placeholder="Choose a class plan"
                    value={selectedClassPlan}
                    onChange={(e) => setSelectedClassPlan(e.target.value)}
                    bg="white"
                    size="md"
                    borderRadius="md"
                  >
                    {classPlans.map((plan) => (
                      <option key={plan} value={plan}>
                        {plan}
                      </option>
                    ))}
                  </Select>
                </FormControl>
              </HStack>
            )}

            {/* Current Assignments */}
            {facilitator.assignments && facilitator.assignments.length > 0 && (
              <Box mt={4}>
                <Text fontWeight="semiBold" mb={2}>
                  Current Assignments:
                </Text>
                <VStack align="stretch" spacing={2}>
                  {facilitator.assignments.map((assignment: Assignment) => (
                    <Box
                      key={assignment.assignmentId}
                      px={3}
                      py={1}
                      border="1px solid"
                      borderColor="gray.200"
                      borderRadius="md"
                      bg="white"
                    >
                      <Box
                        display="flex"
                        justifyContent="space-between"
                        alignItems={'center'}
                        mb={1}
                      >
                        <Text fontSize="xs" color="gray.600">
                          Assigned by {assignment.assignedByName}
                        </Text>
                        <IconButton
                          aria-label="Remove assignment"
                          icon={<FiX />}
                          h={'fit-content'}
                          size="sm"
                          py={1}
                          variant="ghost"
                          colorScheme="red"
                          onClick={() =>
                            handleRemoveAssignment(assignment.assignmentId)
                          }
                          isLoading={saving}
                        />
                      </Box>
                      <Box flex={1}>
                        <HStack spacing={2} mb={1}>
                          <Badge colorScheme="blue" fontSize="sm">
                            {assignment.cohort}
                          </Badge>
                          <Text fontSize="sm">-</Text>
                          <Badge colorScheme="purple" fontSize="sm">
                            {assignment.classPlan}
                          </Badge>
                        </HStack>
                      </Box>
                    </Box>
                  ))}
                </VStack>
              </Box>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={saving}
            isDisabled={!selectedCohort || !selectedClassPlan || classesLoading}
          >
            Assign to Cohort
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
