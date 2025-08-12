import {
  ModalHeader,
  ModalContent,
  Button,
  Modal,
  ModalOverlay,
  useDisclosure,
  ModalCloseButton,
  ModalBody,
  ModalFooter,
  Text,
  VStack,
  FormControl,
  FormLabel,
  Input,
  FormErrorMessage,
  useToast,
  HStack,
  Divider,
  Alert,
  AlertIcon,
  AlertDescription,
  Select,
  Spinner,
} from '@chakra-ui/react'
import React, { useState, useEffect } from 'react'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { collection, addDoc, serverTimestamp, getDocs } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Syllabus } from '../../../../types/syllabus.types'

interface CreateClassFormValues {
  cohortName: string
  startDate: string
  endDate: string
  syllabusId: string
}

interface ClassData {
  cohortName: string
  startDate: Date
  endDate: Date
  syllabusId: string
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
}

const validationSchema = Yup.object().shape({
  cohortName: Yup.string()
    .required('Cohort name is required')
    .min(2, 'Cohort name must be at least 2 characters')
    .max(50, 'Cohort name must not exceed 50 characters')
    .trim(),

  startDate: Yup.date()
    .required('Start date is required')
    .min(new Date(), 'Start date cannot be in the past'),

  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),

  syllabusId: Yup.string()
    .required('Syllabus is required'),
})

export const CreateClass = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [syllabi, setSyllabi] = useState<Syllabus[]>([])
  const [loadingSyllabi, setLoadingSyllabi] = useState(false)
  const toast = useToast()
  const { portalUser, user, loading } = usePortalAuth()

  // Check if user is admin
  const isAdmin = portalUser?.role === 'admin'

  // Fetch syllabi
  const fetchSyllabi = async () => {
    if (!isAdmin) return
    
    setLoadingSyllabi(true)
    try {
      const querySnapshot = await getDocs(collection(portalDb, 'syllabi'))
      const syllabiData: Syllabus[] = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          totalWeeks: data.totalWeeks,
          totalDays: data.totalDays,
          weeks: data.weeks,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          isActive: data.isActive,
          version: data.version,
        }
      }).filter(s => s.isActive) // Only show active syllabi
      setSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
    } finally {
      setLoadingSyllabi(false)
    }
  }

  useEffect(() => {
    if (isOpen && isAdmin) {
      fetchSyllabi()
    }
  }, [isOpen, isAdmin])

  const handleCreateClass = async (values: CreateClassFormValues) => {
    // Double-check admin role before proceeding
    if (!isAdmin) {
      setAuthError('Only administrators can create classes')
      return
    }

    if (!user) {
      setAuthError('You must be logged in to create classes')
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      // Prepare class data
      const classData: ClassData = {
        cohortName: values.cohortName.trim(),
        startDate: new Date(values.startDate),
        endDate: new Date(values.endDate),
        syllabusId: values.syllabusId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        studentsCount: 0,
      }

      // Save to Firestore
      const docRef = await addDoc(collection(portalDb, 'classes'), classData)

      toast({
        title: 'Class Created Successfully! 🎉',
        description: `${values.cohortName} has been created and is now active`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      onClose()
    } catch (error: any) {
      console.error('Error creating class:', error)

      let errorMessage = 'Failed to create class. Please try again.'

      if (error.code) {
        switch (error.code) {
          case 'permission-denied':
            errorMessage = 'You do not have permission to create classes'
            break
          case 'network-request-failed':
            errorMessage = 'Network error. Please check your connection.'
            break
          case 'unavailable':
            errorMessage = 'Service temporarily unavailable. Please try again later.'
            break
          default:
            errorMessage = error.message || errorMessage
        }
      }

      setAuthError(errorMessage)

      toast({
        title: 'Failed to Create Class',
        description: errorMessage,
        status: 'error',
        duration: 6000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const formatDateForInput = (date: string) => {
    if (!date) return ''
    return new Date(date).toISOString().split('T')[0]
  }

  const calculateDuration = (startDate: string, endDate: string) => {
    if (!startDate || !endDate) return ''

    const start = new Date(startDate)
    const end = new Date(endDate)
    const diffTime = Math.abs(end.getTime() - start.getTime())
    const diffDays = Math.ceil(diffTime / (1000 * 60 * 60 * 24))
    const weeks = Math.floor(diffDays / 7)
    const days = diffDays % 7

    if (weeks === 0) return `${days} day${days === 1 ? '' : 's'}`
    if (days === 0) return `${weeks} week${weeks === 1 ? '' : 's'}`
    return `${weeks} week${weeks === 1 ? '' : 's'} and ${days} day${
      days === 1 ? '' : 's'
    }`
  }

  // Show loading while checking auth
  if (loading) {
    return (
      <Button h="64px" isLoading disabled>
        Create Class
      </Button>
    )
  }

  // Hide button if not admin
  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Button
        h={["40px", "64px"]}
        onClick={onOpen}
        colorScheme="purple"
        size="lg"
        fontWeight="bold"
      >
        Create Class
      </Button>

      <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <Text fontSize="xl" fontWeight="bold">
              Create New Class
            </Text>
          </ModalHeader>
          <ModalCloseButton />

          {authError && (
            <Alert status="error" mx={6} borderRadius="md">
              <AlertIcon />
              <AlertDescription>{authError}</AlertDescription>
            </Alert>
          )}

          <Formik<CreateClassFormValues>
            initialValues={{
              cohortName: '',
              startDate: '',
              endDate: '',
              syllabusId: '',
            }}
            validationSchema={validationSchema}
            onSubmit={handleCreateClass}
            validateOnChange={true}
            validateOnBlur={true}
          >
            {(formik) => (
              <form onSubmit={formik.handleSubmit}>
                <ModalBody pt={authError ? 4 : 6}>
                  <VStack spacing={6} align="stretch">
                    {/* Cohort Name */}
                    <FormControl
                      isInvalid={
                        !!(
                          formik.touched.cohortName && formik.errors.cohortName
                        )
                      }
                      isRequired
                    >
                      <FormLabel fontWeight="semibold">Cohort Name</FormLabel>
                      <Input
                        name="cohortName"
                        placeholder="e.g., Cohort 1B"
                        value={formik.values.cohortName}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        isDisabled={isSubmitting}
                        size="lg"
                      />
                      <FormErrorMessage>
                        {formik.errors.cohortName}
                      </FormErrorMessage>
                    </FormControl>

                    <Divider />

                    {/* Syllabus Selection */}
                    <FormControl
                      isInvalid={
                        !!(formik.touched.syllabusId && formik.errors.syllabusId)
                      }
                      isRequired
                    >
                      <FormLabel fontWeight="semibold">Course Syllabus</FormLabel>
                      {loadingSyllabi ? (
                        <HStack justify="center" py={4}>
                          <Spinner size="sm" />
                          <Text fontSize="sm" color="gray.600">Loading syllabi...</Text>
                        </HStack>
                      ) : syllabi.length === 0 ? (
                        <Text fontSize="sm" color="red.500" py={2}>
                          No active syllabi found. Please create a syllabus first.
                        </Text>
                      ) : (
                        <Select
                          name="syllabusId"
                          placeholder="Select a syllabus"
                          value={formik.values.syllabusId}
                          onChange={formik.handleChange}
                          onBlur={formik.handleBlur}
                          isDisabled={isSubmitting}
                          size="lg"
                        >
                          {syllabi.map((syllabus) => (
                            <option key={syllabus.id} value={syllabus.id}>
                              {syllabus.name} ({syllabus.totalWeeks} weeks, {syllabus.totalDays} days)
                            </option>
                          ))}
                        </Select>
                      )}
                      <FormErrorMessage>
                        {formik.errors.syllabusId}
                      </FormErrorMessage>
                    </FormControl>

                    <Divider />

                    {/* Date Range */}
                    <VStack spacing={4} align="stretch">
                      <Text fontWeight="semibold" fontSize="md">
                        Class Duration
                      </Text>

                      <HStack spacing={4}>
                        {/* Start Date */}
                        <FormControl
                          isInvalid={
                            !!(
                              formik.touched.startDate &&
                              formik.errors.startDate
                            )
                          }
                          isRequired
                        >
                          <FormLabel fontWeight="medium" fontSize="sm">
                            Start Date
                          </FormLabel>
                          <Input
                            name="startDate"
                            type="date"
                            value={formatDateForInput(formik.values.startDate)}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={isSubmitting}
                            size="lg"
                            min={new Date().toISOString().split('T')[0]}
                          />
                          <FormErrorMessage>
                            {formik.errors.startDate}
                          </FormErrorMessage>
                        </FormControl>

                        {/* End Date */}
                        <FormControl
                          isInvalid={
                            !!(formik.touched.endDate && formik.errors.endDate)
                          }
                          isRequired
                        >
                          <FormLabel fontWeight="medium" fontSize="sm">
                            End Date
                          </FormLabel>
                          <Input
                            name="endDate"
                            type="date"
                            value={formatDateForInput(formik.values.endDate)}
                            onChange={formik.handleChange}
                            onBlur={formik.handleBlur}
                            isDisabled={isSubmitting}
                            size="lg"
                            min={
                              formik.values.startDate ||
                              new Date().toISOString().split('T')[0]
                            }
                          />
                          <FormErrorMessage>
                            {formik.errors.endDate}
                          </FormErrorMessage>
                        </FormControl>
                      </HStack>

                      {/* Duration Display */}
                      {formik.values.startDate && formik.values.endDate && (
                        <Text
                          fontSize="sm"
                          color="gray.600"
                          fontStyle="italic"
                          textAlign="center"
                          p={2}
                          bg="gray.50"
                          borderRadius="md"
                        >
                          Duration:{' '}
                          {calculateDuration(
                            formik.values.startDate,
                            formik.values.endDate,
                          )}
                        </Text>
                      )}
                    </VStack>
                  </VStack>
                </ModalBody>

                <ModalFooter>
                  <HStack spacing={3}>
                    <Button
                      variant="outline"
                      onClick={onClose}
                      isDisabled={isSubmitting}
                      h="48px"
                    >
                      Cancel
                    </Button>
                    <Button
                      type="submit"
                      colorScheme="purple"
                      isLoading={isSubmitting}
                      loadingText="Creating..."
                      disabled={
                        !formik.isValid || !formik.dirty || isSubmitting
                      }
                      h="48px"
                    >
                      Create Class
                    </Button>
                  </HStack>
                </ModalFooter>
              </form>
            )}
          </Formik>
        </ModalContent>
      </Modal>
    </>
  )
}
