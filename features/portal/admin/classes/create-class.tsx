import React, { useState, useEffect } from 'react'
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
  Box,
  Badge,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../../../components'
import { Formik } from 'formik'
import * as Yup from 'yup'
import { format } from 'date-fns'
import {
  collection,
  serverTimestamp,
  getDocs,
  writeBatch,
  doc,
  getDoc,
} from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Syllabus } from '../../../../types/syllabus.types'
import { classPlans } from '../../../../constant/adminConstants'
import { CLASS_PLAN_CONFIGS } from '../../../../constant/classPlans'
import {
  calculateClassSchedule,
  calculateEndDate,
  calculateEndDateForAllPlans,
} from '../../../../utils/scheduleCalculator'
import { useRouter } from 'next/router'

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
  startDate: Yup.date().required('Start date is required'),
  endDate: Yup.date()
    .required('End date is required')
    .min(Yup.ref('startDate'), 'End date must be after start date'),
  syllabusId: Yup.string().required('Syllabus is required'),
})

export const CreateClass = () => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [authError, setAuthError] = useState<string | null>(null)
  const [syllabi, setSyllabi] = useState<Syllabus[]>([])
  const [loadingSyllabi, setLoadingSyllabi] = useState(false)
  const [calculatedEndDate, setCalculatedEndDate] = useState<Date | null>(null)
  const toast = useToast()
  const { portalUser, user, loading } = usePortalAuth()
  const router = useRouter()

  const isAdmin = portalUser?.role === 'admin'

  const fetchSyllabi = async () => {
    if (!isAdmin) return

    setLoadingSyllabi(true)
    try {
      const querySnapshot = await getDocs(collection(portalDb, 'syllabi'))
      const syllabiData: Syllabus[] = querySnapshot.docs
        .map((doc) => {
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
        })
        .filter((s) => s.isActive)
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

  // Handle syllabus template application
  const applySyllabusTemplate = async (
    syllabusId: string,
    classId: string,
    cohortName: string,
    startDate: Date,
  ) => {
    if (!isAdmin || !user) return

    try {
      // Fetch the syllabus template
      const syllabusRef = doc(portalDb, 'syllabi', syllabusId)
      const syllabusSnap = await getDoc(syllabusRef)

      if (!syllabusSnap.exists()) {
        throw new Error('Selected syllabus not found')
      }

      const syllabusData = syllabusSnap.data() as Syllabus
      const batch = writeBatch(portalDb)

      // Create class plan syllabi for each class plan
      for (const classPlanKey of Object.keys(CLASS_PLAN_CONFIGS)) {
        const classPlanConfig =
          CLASS_PLAN_CONFIGS[classPlanKey as keyof typeof CLASS_PLAN_CONFIGS]

        // Calculate specific schedule for this class plan
        const scheduledDays = calculateClassSchedule({
          startDate: new Date(startDate),
          syllabus: syllabusData,
          classPlan: classPlanKey,
        })

        const classPlanSyllabusData = {
          classId: classId,
          cohortName: cohortName.trim().toUpperCase(),
          classPlan: classPlanConfig.name, // Use the display name instead of key
          classPlanKey: classPlanKey, // Store the key separately for reference
          baseSyllabusId: syllabusId,
          syllabus: syllabusData, // Full syllabus copy
          startDate: new Date(startDate),
          endDate: calculateEndDate(
            new Date(startDate),
            syllabusData,
            classPlanKey,
          ),
          scheduledDays: scheduledDays,
          createdAt: serverTimestamp(),
          updatedAt: serverTimestamp(),
          createdBy: user.uid,
          isActive: true,
        }

        const classPlanSyllabusRef = doc(
          collection(portalDb, 'classPlanSyllabi'),
        )
        batch.set(classPlanSyllabusRef, classPlanSyllabusData)
      }

      await batch.commit()
      return true
    } catch (error) {
      console.error('Error applying syllabus template:', error)
      throw error
    }
  }

  const handleCreateClass = async (values: CreateClassFormValues) => {
    if (!isAdmin || !user) {
      setAuthError('Only administrators can create classes')
      return
    }

    setIsSubmitting(true)
    setAuthError(null)

    try {
      const selectedSyllabus = syllabi.find((s) => s.id === values.syllabusId)
      if (!selectedSyllabus) {
        throw new Error('Selected syllabus not found')
      }

      // Use calculated end date if available, otherwise use user input
      const finalEndDate = calculatedEndDate || new Date(values.endDate)

      // Prepare main class data
      const classData: ClassData = {
        cohortName: values.cohortName.trim().toUpperCase(),
        startDate: new Date(values.startDate),
        endDate: finalEndDate,
        syllabusId: values.syllabusId,
        createdBy: user.uid,
        createdAt: serverTimestamp(),
        status: 'active',
        studentsCount: 0,
      }

      // Use batch write for atomic operations
      const batch = writeBatch(portalDb)

      // Create the main class document
      const classRef = doc(collection(portalDb, 'classes'))
      batch.set(classRef, classData)

      // Apply syllabus template to all class plans
      await applySyllabusTemplate(
        values.syllabusId,
        classRef.id,
        values.cohortName,
        new Date(values.startDate),
      )

      // Commit all operations
      await batch.commit()

      toast({
        title: 'Class Created Successfully! 🎉',
        description: `${values.cohortName} has been created with syllabi for all class plans`,
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      onClose()
      router.reload()
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

  if (loading) {
    return (
      <Button h="64px" isLoading disabled>
        Create Class
      </Button>
    )
  }

  if (!isAdmin) {
    return null
  }

  return (
    <>
      <Button
        h={['40px', '64px']}
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
                        !!(
                          formik.touched.syllabusId && formik.errors.syllabusId
                        )
                      }
                      isRequired
                    >
                      <FormLabel fontWeight="semibold">
                        Course Syllabus
                      </FormLabel>
                      {loadingSyllabi ? (
                        <HStack justify="center" py={4}>
                          <Spinner size="sm" />
                          <Text fontSize="sm" color="gray.600">
                            Loading syllabi...
                          </Text>
                        </HStack>
                      ) : syllabi.length === 0 ? (
                        <Text fontSize="sm" color="red.500" py={2}>
                          No active syllabi found. Please create a syllabus
                          first.
                        </Text>
                      ) : (
                        <Select
                          name="syllabusId"
                          placeholder="Select a syllabus"
                          value={formik.values.syllabusId}
                          onChange={(e) => {
                            formik.handleChange(e)
                            // Don't calculate end date here - wait until we have start date
                            if (formik.values.startDate) {
                              const selectedSyllabus = syllabi.find(
                                (s) => s.id === e.target.value,
                              )
                              if (selectedSyllabus) {
                                const endDate = calculateEndDateForAllPlans(
                                  new Date(formik.values.startDate),
                                  selectedSyllabus,
                                )
                                setCalculatedEndDate(endDate)
                                formik.setFieldValue(
                                  'endDate',
                                  format(endDate, 'yyyy-MM-dd'),
                                )
                              }
                            }
                          }}
                          onBlur={formik.handleBlur}
                          isDisabled={isSubmitting}
                          size="lg"
                        >
                          {syllabi.map((syllabus) => (
                            <option key={syllabus.id} value={syllabus.id}>
                              {syllabus.name} ({syllabus.totalWeeks} weeks,{' '}
                              {syllabus.totalDays} days)
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
                          <CustomDatePicker
                            name="startDate"
                            value={formik.values.startDate}
                            onChange={(date) => {
                              const formattedDate = date
                                ? format(date, 'yyyy-MM-dd')
                                : ''
                              formik.setFieldValue('startDate', formattedDate)

                              // Calculate end date only if we have both start date and syllabus
                              if (formattedDate && formik.values.syllabusId) {
                                const selectedSyllabus = syllabi.find(
                                  (s) => s.id === formik.values.syllabusId,
                                )
                                if (selectedSyllabus) {
                                  const endDate = calculateEndDateForAllPlans(
                                    new Date(formattedDate),
                                    selectedSyllabus,
                                  )
                                  setCalculatedEndDate(endDate)
                                  formik.setFieldValue(
                                    'endDate',
                                    format(endDate, 'yyyy-MM-dd'),
                                  )
                                }
                              }
                            }}
                            onBlur={() => formik.handleBlur('startDate')}
                            isDisabled={isSubmitting}
                            size="lg"
                            isInvalid={
                              !!(
                                formik.touched.startDate &&
                                formik.errors.startDate
                              )
                            }
                            errorMessage={formik.errors.startDate}
                          />
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
                          <CustomDatePicker
                            name="endDate"
                            value={
                              calculatedEndDate
                                ? format(calculatedEndDate, 'yyyy-MM-dd')
                                : formik.values.endDate
                            }
                            onChange={(date) => {
                              const formattedDate = date
                                ? format(date, 'yyyy-MM-dd')
                                : ''
                              formik.setFieldValue('endDate', formattedDate)
                              setCalculatedEndDate(date)
                            }}
                            onBlur={() => formik.handleBlur('endDate')}
                            isDisabled={isSubmitting}
                            size="lg"
                            minDate={
                              formik.values.startDate
                                ? new Date(formik.values.startDate)
                                : undefined
                            }
                            isInvalid={
                              !!(
                                formik.touched.endDate && formik.errors.endDate
                              )
                            }
                            errorMessage={formik.errors.endDate}
                          />
                        </FormControl>
                      </HStack>

                      {/* Auto-calculation notice */}
                      {calculatedEndDate && (
                        <Alert status="info" borderRadius="md" size="sm">
                          <AlertIcon />
                          <Box>
                            <Text fontSize="sm" fontWeight="medium">
                              End Date Calculated Automatically
                            </Text>
                            <Text fontSize="xs">
                              Based on{' '}
                              {
                                syllabi.find(
                                  (s) => s.id === formik.values.syllabusId,
                                )?.totalWeeks
                              }{' '}
                              weeks from start date. You can modify this if
                              needed.
                            </Text>
                          </Box>
                        </Alert>
                      )}

                      {/* Class Plans Info */}
                      <Box
                        p={3}
                        bg="purple.50"
                        borderRadius="md"
                        border="1px solid"
                        borderColor="purple.200"
                      >
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="purple.700"
                          mb={2}
                        >
                          Class Plans That Will Be Created:
                        </Text>
                        <HStack spacing={2} flexWrap="wrap">
                          {classPlans.map((plan) => (
                            <Badge
                              key={plan}
                              colorScheme="purple"
                              variant="subtle"
                              fontSize="xs"
                            >
                              {plan}
                            </Badge>
                          ))}
                        </HStack>
                        <Text fontSize="xs" color="purple.600" mt={2}>
                          Each class plan will have its own customized syllabus
                          schedule
                        </Text>
                      </Box>
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
