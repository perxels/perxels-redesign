import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Icon,
} from '@chakra-ui/react'
import { MdAdd, MdSchedule } from 'react-icons/md'
import { collection, getDocs, doc, getDoc, updateDoc } from 'firebase/firestore'
import { Checkbox, Textarea } from '@chakra-ui/react'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Syllabus } from '../../../../types/syllabus.types'
import { CustomDatePicker } from '../../../../components'
import { format } from 'date-fns'

interface ClassSyllabusManagementProps {
  classId: string
  currentSyllabusId?: string
  classStartDate?: Date
  classEndDate?: Date
  onSyllabusUpdate?: (syllabusId: string) => void
}

export const ClassSyllabusManagement: React.FC<
  ClassSyllabusManagementProps
> = ({
  classId,
  currentSyllabusId,
  classStartDate,
  classEndDate,
  onSyllabusUpdate,
}) => {
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [availableSyllabi, setAvailableSyllabi] = useState<Syllabus[]>([])
  const [scheduledDays, setScheduledDays] = useState<Record<string, any>>({})
  const [loading, setLoading] = useState(true)
  const [loadingSyllabi, setLoadingSyllabi] = useState(false)
  const [error, setError] = useState<string | null>(null)

  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure()
  const {
    isOpen: isViewOpen,
    onOpen: onViewOpen,
    onClose: onViewClose,
  } = useDisclosure()

  const toast = useToast()
  const { user, portalUser } = usePortalAuth()

  // Check if user is admin
  const isAdmin = portalUser?.role === 'admin'

  // Fetch current syllabus
  const fetchCurrentSyllabus = async () => {
    if (!currentSyllabusId) {
      setSyllabus(null)
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)
      const syllabusRef = doc(portalDb, 'syllabi', currentSyllabusId)
      const syllabusSnap = await getDoc(syllabusRef)

      if (syllabusSnap.exists()) {
        const syllabusData = syllabusSnap.data() as any
        setSyllabus({
          id: syllabusSnap.id,
          name: syllabusData.name,
          description: syllabusData.description,
          totalWeeks: syllabusData.totalWeeks,
          totalDays: syllabusData.totalDays,
          weeks: syllabusData.weeks,
          createdAt: syllabusData.createdAt?.toDate() || new Date(),
          updatedAt: syllabusData.updatedAt?.toDate() || new Date(),
          createdBy: syllabusData.createdBy,
          isActive: syllabusData.isActive,
          version: syllabusData.version,
        })
      } else {
        setSyllabus(null)
        setError('Syllabus not found')
      }
    } catch (err) {
      console.error('Error fetching syllabus:', err)
      setError('Failed to load syllabus')
      setSyllabus(null)
    } finally {
      setLoading(false)
    }
  }

  // Fetch available syllabi
  const fetchAvailableSyllabi = async () => {
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
        .filter((s) => s.isActive) // Only show active syllabi
      setAvailableSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
    } finally {
      setLoadingSyllabi(false)
    }
  }

  useEffect(() => {
    fetchCurrentSyllabus()
  }, [currentSyllabusId])

  useEffect(() => {
    if (isAssignOpen) {
      fetchAvailableSyllabi()
    }
  }, [isAssignOpen, isAdmin])

  // Fetch scheduled days
  const fetchScheduledDays = async () => {
    if (!classId || !isAdmin) return

    try {
      const classRef = doc(portalDb, 'classes', classId)
      const classSnap = await getDoc(classRef)

      if (classSnap.exists()) {
        const classData = classSnap.data()
        const savedScheduledDays = classData.scheduledDays || {}
        setScheduledDays(savedScheduledDays)
      }
    } catch (err) {
      console.error('Error fetching scheduled days:', err)
    }
  }

  useEffect(() => {
    if (syllabus) {
      fetchScheduledDays()
    }
  }, [syllabus, classId, isAdmin])

  const saveScheduledDayInline = async (dayId: string, scheduledDay: any) => {
    if (!user?.uid || !isAdmin) return

    try {
      const newScheduledDays = {
        ...scheduledDays,
        [dayId]: scheduledDay,
      }

      await updateDoc(doc(portalDb, 'classes', classId), {
        scheduledDays: newScheduledDays,
        updatedAt: new Date(),
      })

      setScheduledDays(newScheduledDays)

      toast({
        title: 'Updated Successfully! ✅',
        description: 'Day schedule has been updated',
        status: 'success',
        duration: 2000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error updating scheduled day:', err)
      toast({
        title: 'Error',
        description: 'Failed to update day schedule',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  const getScheduledDay = (dayId: string) => {
    return scheduledDays[dayId] || null
  }

  const getDayStatus = (day: any) => {
    const scheduled = getScheduledDay(day.id)
    if (!scheduled) return 'unscheduled'
    if (scheduled.isCompleted) return 'completed'
    if (
      scheduled.scheduledDate &&
      new Date(scheduled.scheduledDate) < new Date()
    )
      return 'overdue'
    return 'scheduled'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'overdue':
        return 'red'
      case 'scheduled':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'overdue':
        return 'Overdue'
      case 'scheduled':
        return 'Scheduled'
      default:
        return 'Not Scheduled'
    }
  }

  const formatDate = (date: any) => {
    if (!date) return ''
    const d = date?.toDate ? date.toDate() : new Date(date)
    return d.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const handleAssignSyllabus = async (syllabusId: string) => {
    if (!user?.uid || !isAdmin) return

    try {
      // Update the class with the new syllabus ID
      await updateDoc(doc(portalDb, 'classes', classId), {
        syllabusId: syllabusId,
        updatedAt: new Date(),
      })

      // Update local state
      const selectedSyllabus = availableSyllabi.find((s) => s.id === syllabusId)
      if (selectedSyllabus) {
        setSyllabus(selectedSyllabus)
      }

      // Notify parent component
      if (onSyllabusUpdate) {
        onSyllabusUpdate(syllabusId)
      }

      toast({
        title: 'Syllabus Assigned Successfully! ✅',
        description: 'The syllabus has been assigned to this class',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onAssignClose()
    } catch (err) {
      console.error('Error assigning syllabus:', err)
      toast({
        title: 'Error',
        description: 'Failed to assign syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  const handleRemoveSyllabus = async () => {
    if (!user?.uid || !isAdmin) return

    try {
      // Remove syllabus from class
      await updateDoc(doc(portalDb, 'classes', classId), {
        syllabusId: null,
        updatedAt: new Date(),
      })

      setSyllabus(null)

      // Notify parent component
      if (onSyllabusUpdate) {
        onSyllabusUpdate('')
      }

      toast({
        title: 'Syllabus Removed Successfully! 🗑️',
        description: 'The syllabus has been removed from this class',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })
    } catch (err) {
      console.error('Error removing syllabus:', err)
      toast({
        title: 'Error',
        description: 'Failed to remove syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    }
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading syllabus...</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Syllabus Header */}
      {syllabus ? (
        <Card>
          <CardHeader>
            <VStack align="start" spacing={3}>
              <HStack justify="space-between" w="full">
                <Heading size="md">{syllabus.name}</Heading>
                <HStack spacing={2}>
                  <Badge colorScheme="purple" variant="subtle">
                    v{syllabus.version}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    Active
                  </Badge>
                </HStack>
              </HStack>
              <Text color="gray.600">{syllabus.description}</Text>
              <HStack spacing={4}>
                <Badge colorScheme="blue" variant="subtle">
                  {syllabus.totalWeeks} Weeks
                </Badge>
                <Badge colorScheme="green" variant="subtle">
                  {syllabus.totalDays} Days
                </Badge>
              </HStack>
            </VStack>
          </CardHeader>
          <CardBody>
            <VStack spacing={4} align="stretch">
              <HStack justify="space-between">
                <Text fontWeight="semibold">Course Schedule</Text>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    colorScheme="red"
                    variant="outline"
                    onClick={handleRemoveSyllabus}
                  >
                    Remove Syllabus
                  </Button>
                </HStack>
              </HStack>

              {/* Full Syllabus with Inline Scheduling */}
              <VStack spacing={6} align="stretch">
                {syllabus.weeks.map((week, weekIndex) => (
                  <Card key={week.id || weekIndex} variant="outline">
                    <CardHeader>
                      <HStack justify="space-between" align="center">
                        <VStack align="start" spacing={1}>
                          <Heading size="md">{week.title}</Heading>
                          <Text fontSize="sm" color="gray.600">
                            {week.days.length} days • Week {week.weekNumber}
                          </Text>
                        </VStack>
                        <Badge colorScheme="blue" variant="subtle">
                          {week.days.length} days
                        </Badge>
                      </HStack>
                    </CardHeader>
                    <CardBody>
                      <VStack spacing={4} align="stretch">
                        {week.days.map((day, dayIndex) => {
                          const status = getDayStatus(day)
                          const scheduled = getScheduledDay(day.id)

                          return (
                            <Box
                              key={day.id || dayIndex}
                              p={4}
                              border="1px solid"
                              borderColor="gray.200"
                              borderRadius="lg"
                              bg="white"
                            >
                              <VStack spacing={4} align="stretch">
                                {/* Day Header */}
                                <HStack justify="space-between" align="start">
                                  <VStack align="start" spacing={1} flex="1">
                                    <Text fontWeight="bold" fontSize="lg">
                                      Day {day.dayNumber}: {day.title}
                                    </Text>
                                    <Text
                                      fontSize="sm"
                                      color="gray.600"
                                      noOfLines={2}
                                    >
                                      {day.content}
                                    </Text>
                                    <HStack spacing={2} mt={2}>
                                      {day.duration && (
                                        <Badge
                                          colorScheme="gray"
                                          variant="subtle"
                                          size="sm"
                                        >
                                          {day.duration}
                                        </Badge>
                                      )}
                                      {day.isOnline && (
                                        <Badge
                                          colorScheme="blue"
                                          variant="subtle"
                                          size="sm"
                                        >
                                          Online
                                        </Badge>
                                      )}
                                      {day.isPhysical && (
                                        <Badge
                                          colorScheme="green"
                                          variant="subtle"
                                          size="sm"
                                        >
                                          Physical
                                        </Badge>
                                      )}
                                    </HStack>
                                  </VStack>
                                  <VStack align="end" spacing={2}>
                                    <Badge
                                      colorScheme={getStatusColor(status)}
                                      variant="subtle"
                                    >
                                      {getStatusText(status)}
                                    </Badge>
                                  </VStack>
                                </HStack>

                                {/* Inline Date Editor */}
                                <Box p={4} bg="gray.50" borderRadius="md">
                                  <VStack spacing={3} align="stretch">
                                    <HStack
                                      justify="space-between"
                                      align="center"
                                    >
                                      <Text fontWeight="medium" fontSize="sm">
                                        Schedule Date:
                                      </Text>
                                      <HStack spacing={2}>
                                        <CustomDatePicker
                                          name={`scheduledDate-${day.id}`}
                                          value={
                                            scheduled
                                              ? scheduled.scheduledDate
                                                  .toISOString()
                                                  .split('T')[0]
                                              : ''
                                          }
                                          onChange={(date) => {
                                            if (date) {
                                              const newScheduledDays = {
                                                ...scheduledDays,
                                                [day.id]: {
                                                  scheduledDate: date,
                                                  isCompleted:
                                                    scheduled?.isCompleted ||
                                                    false,
                                                  notes: scheduled?.notes || '',
                                                },
                                              }
                                              setScheduledDays(newScheduledDays)
                                            }
                                          }}
                                          minDate={classStartDate}
                                          maxDate={classEndDate}
                                          width="auto"
                                          size="sm"
                                        />
                                        <Button
                                          size="sm"
                                          colorScheme="blue"
                                          variant="outline"
                                          onClick={() => {
                                            if (scheduled) {
                                              saveScheduledDayInline(
                                                day.id,
                                                scheduled,
                                              )
                                            }
                                          }}
                                          isDisabled={!scheduled}
                                        >
                                          Save
                                        </Button>
                                      </HStack>
                                    </HStack>

                                    {scheduled && (
                                      <>
                                        <HStack
                                          justify="space-between"
                                          align="center"
                                        >
                                          <Text
                                            fontWeight="medium"
                                            fontSize="sm"
                                          >
                                            Status:
                                          </Text>
                                          <Checkbox
                                            isChecked={scheduled.isCompleted}
                                            onChange={(e) => {
                                              const newScheduledDays = {
                                                ...scheduledDays,
                                                [day.id]: {
                                                  ...scheduled,
                                                  isCompleted: e.target.checked,
                                                },
                                              }
                                              setScheduledDays(newScheduledDays)
                                              saveScheduledDayInline(day.id, {
                                                ...scheduled,
                                                isCompleted: e.target.checked,
                                              })
                                            }}
                                          >
                                            <Text fontSize="sm">
                                              Mark as completed
                                            </Text>
                                          </Checkbox>
                                        </HStack>

                                        <HStack
                                          justify="space-between"
                                          align="start"
                                        >
                                          <Text
                                            fontWeight="medium"
                                            fontSize="sm"
                                          >
                                            Notes:
                                          </Text>
                                          <Textarea
                                            size="sm"
                                            value={scheduled.notes || ''}
                                            onChange={(e) => {
                                              const newScheduledDays = {
                                                ...scheduledDays,
                                                [day.id]: {
                                                  ...scheduled,
                                                  notes: e.target.value,
                                                },
                                              }
                                              setScheduledDays(newScheduledDays)
                                            }}
                                            placeholder="Add notes about this day..."
                                            rows={2}
                                            w="300px"
                                          />
                                        </HStack>

                                        <HStack justify="flex-end" spacing={2}>
                                          <Button
                                            size="sm"
                                            colorScheme="blue"
                                            onClick={() =>
                                              saveScheduledDayInline(
                                                day.id,
                                                scheduled,
                                              )
                                            }
                                          >
                                            Save Changes
                                          </Button>
                                        </HStack>
                                      </>
                                    )}
                                  </VStack>
                                </Box>
                              </VStack>
                            </Box>
                          )
                        })}
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      ) : (
        <Card>
          <CardBody>
            <VStack spacing={6} align="center" py={12}>
              <Box textAlign="center">
                <Icon as={MdSchedule} boxSize={16} color="gray.300" mb={4} />
                <Heading size="md" color="gray.600" mb={2}>
                  No Syllabus Assigned
                </Heading>
                <Text
                  color="gray.500"
                  fontSize="md"
                  textAlign="center"
                  maxW="400px"
                >
                  This class doesn&apos;t have a syllabus yet. Assign a syllabus
                  to start planning class days and tracking progress.
                </Text>
              </Box>

              <VStack spacing={3}>
                <Button
                  leftIcon={<MdAdd />}
                  colorScheme="purple"
                  size="lg"
                  onClick={onAssignOpen}
                >
                  Assign Syllabus
                </Button>
                <Text fontSize="sm" color="gray.400">
                  Choose from existing syllabi or create a new one
                </Text>
              </VStack>
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Assign Syllabus Modal */}
      <Modal isOpen={isAssignOpen} onClose={onAssignClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            <VStack align="start" spacing={1}>
              <Text>Assign Syllabus to Class</Text>
              <Text fontSize="sm" color="gray.600" fontWeight="normal">
                Choose a syllabus to start planning your class schedule
              </Text>
            </VStack>
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {loadingSyllabi ? (
              <Box textAlign="center" py={8}>
                <Spinner size="lg" color="purple.500" />
                <Text mt={4} color="gray.600">
                  Loading available syllabi...
                </Text>
              </Box>
            ) : availableSyllabi.length === 0 ? (
              <VStack spacing={6} align="center" py={8}>
                <Icon as={MdSchedule} boxSize={12} color="gray.300" />
                <VStack spacing={2}>
                  <Text color="gray.500" fontSize="lg">
                    No Active Syllabi
                  </Text>
                  <Text color="gray.400" fontSize="sm" textAlign="center">
                    You need to create a syllabus first before assigning it to
                    this class.
                  </Text>
                </VStack>
                <Button
                  colorScheme="purple"
                  variant="outline"
                  onClick={onAssignClose}
                >
                  Create Syllabus First
                </Button>
              </VStack>
            ) : (
              <VStack spacing={4} align="stretch">
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  Available Syllabi ({availableSyllabi.length})
                </Text>
                {availableSyllabi.map((syllabus) => (
                  <Card
                    key={syllabus.id}
                    variant="outline"
                    cursor="pointer"
                    _hover={{ bg: 'gray.50', borderColor: 'purple.200' }}
                    transition="all 0.2s"
                    onClick={() => handleAssignSyllabus(syllabus.id)}
                  >
                    <CardBody>
                      <VStack align="start" spacing={3}>
                        <HStack justify="space-between" w="full">
                          <Text fontWeight="semibold" fontSize="lg">
                            {syllabus.name}
                          </Text>
                          <Badge colorScheme="purple" variant="subtle">
                            v{syllabus.version}
                          </Badge>
                        </HStack>
                        <Text fontSize="sm" color="gray.600" noOfLines={2}>
                          {syllabus.description}
                        </Text>
                        <HStack spacing={4}>
                          <Badge colorScheme="blue" variant="subtle">
                            {syllabus.totalWeeks} weeks
                          </Badge>
                          <Badge colorScheme="green" variant="subtle">
                            {syllabus.totalDays} days
                          </Badge>
                        </HStack>
                        <Text fontSize="xs" color="gray.500">
                          Click to assign this syllabus
                        </Text>
                      </VStack>
                    </CardBody>
                  </Card>
                ))}
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" onClick={onAssignClose}>
              Cancel
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
