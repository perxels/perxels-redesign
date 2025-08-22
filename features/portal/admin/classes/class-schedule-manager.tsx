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
  FormControl,
  FormLabel,
  Checkbox,
  Textarea,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Icon,
  Alert,
  AlertIcon,
  AlertDescription,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../../../components'
import { MdCalendarToday, MdCheckCircle, MdSchedule, MdEdit, MdAdd } from 'react-icons/md'
import { doc, getDoc, updateDoc, setDoc } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Syllabus, SyllabusDay } from '../../../../types/syllabus.types'
import { format } from 'date-fns'

interface ClassScheduleManagerProps {
  classId: string
  syllabus: Syllabus
  classStartDate: Date
  classEndDate: Date
}

interface ScheduledDay {
  scheduledDate: Date
  isCompleted: boolean
  notes?: string
}

export const ClassScheduleManager: React.FC<ClassScheduleManagerProps> = ({
  classId,
  syllabus,
  classStartDate,
  classEndDate
}) => {
  const [scheduledDays, setScheduledDays] = useState<Record<string, ScheduledDay>>({})
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [selectedDay, setSelectedDay] = useState<SyllabusDay | null>(null)
  const [editDate, setEditDate] = useState('')
  const [editNotes, setEditNotes] = useState('')
  const [editCompleted, setEditCompleted] = useState(false)
  
  const { isOpen: isScheduleOpen, onOpen: onScheduleOpen, onClose: onScheduleClose } = useDisclosure()
  const { isOpen: isAutoScheduleOpen, onOpen: onAutoScheduleOpen, onClose: onAutoScheduleClose } = useDisclosure()
  
  const toast = useToast()
  const { user, portalUser } = usePortalAuth()

  // Check if user is admin
  const isAdmin = portalUser?.role === 'admin'

  // Fetch scheduled days from Firestore
  const fetchScheduledDays = async () => {
    if (!isAdmin) return

    try {
      setLoading(true)
      const classRef = doc(portalDb, 'classes', classId)
      const classSnap = await getDoc(classRef)
      
      if (classSnap.exists()) {
        const classData = classSnap.data()
        const savedScheduledDays = classData.scheduledDays || {}
        
        // Convert Firestore timestamps to Date objects
        const convertedScheduledDays: Record<string, ScheduledDay> = {}
        Object.keys(savedScheduledDays).forEach(dayId => {
          const dayData = savedScheduledDays[dayId]
          convertedScheduledDays[dayId] = {
            scheduledDate: dayData.scheduledDate?.toDate() || new Date(),
            isCompleted: dayData.isCompleted || false,
            notes: dayData.notes || ''
          }
        })
        
        setScheduledDays(convertedScheduledDays)
      }
    } catch (err) {
      console.error('Error fetching scheduled days:', err)
      toast({
        title: 'Error',
        description: 'Failed to load scheduled days',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchScheduledDays()
  }, [classId, isAdmin])

  const handleScheduleDay = (day: SyllabusDay) => {
    setSelectedDay(day)
    const existingSchedule = scheduledDays[day.id]
    if (existingSchedule) {
      setEditDate(existingSchedule.scheduledDate.toISOString().split('T')[0])
      setEditNotes(existingSchedule.notes || '')
      setEditCompleted(existingSchedule.isCompleted)
    } else {
      setEditDate('')
      setEditNotes('')
      setEditCompleted(false)
    }
    onScheduleOpen()
  }

  const saveScheduledDay = async () => {
    if (!selectedDay || !user?.uid || !isAdmin) return

    try {
      setSaving(true)
      
      const newScheduledDays = {
        ...scheduledDays,
        [selectedDay.id]: {
          scheduledDate: new Date(editDate),
          isCompleted: editCompleted,
          notes: editNotes
        }
      }

      // Update Firestore
      await updateDoc(doc(portalDb, 'classes', classId), {
        scheduledDays: newScheduledDays,
        updatedAt: new Date()
      })

      setScheduledDays(newScheduledDays)

      toast({
        title: 'Day Scheduled Successfully! ✅',
        description: `${selectedDay.title} has been scheduled`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onScheduleClose()
    } catch (err) {
      console.error('Error saving scheduled day:', err)
      toast({
        title: 'Error',
        description: 'Failed to save scheduled day',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  }

  const saveScheduledDayInline = async (dayId: string, scheduledDay: ScheduledDay) => {
    if (!user?.uid || !isAdmin) return

    try {
      const newScheduledDays = {
        ...scheduledDays,
        [dayId]: scheduledDay
      }

      // Update Firestore
      await updateDoc(doc(portalDb, 'classes', classId), {
        scheduledDays: newScheduledDays,
        updatedAt: new Date()
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

  const autoScheduleDays = async () => {
    if (!user?.uid || !isAdmin) return

    try {
      setSaving(true)
      
      const newScheduledDays: Record<string, ScheduledDay> = {}
      let currentDate = new Date(classStartDate)
      
      // Schedule each day with 2-3 day intervals (typical for classes)
      syllabus.weeks.forEach((week, weekIndex) => {
        week.days.forEach((day, dayIndex) => {
          // Skip weekends (Saturday = 6, Sunday = 0)
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1)
          }
          
          // Don't schedule beyond class end date
          if (currentDate <= classEndDate) {
            newScheduledDays[day.id] = {
              scheduledDate: new Date(currentDate),
              isCompleted: false,
              notes: `Auto-scheduled for ${currentDate.toLocaleDateString()}`
            }
            
            // Move to next day (skip weekends)
            currentDate.setDate(currentDate.getDate() + 1)
            while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
              currentDate.setDate(currentDate.getDate() + 1)
            }
          }
        })
      })

      // Update Firestore
      await updateDoc(doc(portalDb, 'classes', classId), {
        scheduledDays: newScheduledDays,
        updatedAt: new Date()
      })

      setScheduledDays(newScheduledDays)

      toast({
        title: 'Auto-Schedule Complete! 📅',
        description: 'All days have been automatically scheduled',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      onAutoScheduleClose()
    } catch (err) {
      console.error('Error auto-scheduling days:', err)
      toast({
        title: 'Error',
        description: 'Failed to auto-schedule days',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setSaving(false)
    }
  }

  const getScheduledDay = (dayId: string): ScheduledDay | null => {
    return scheduledDays[dayId] || null
  }

  const getDayStatus = (day: SyllabusDay) => {
    const scheduled = getScheduledDay(day.id)
    if (!scheduled) return 'unscheduled'
    if (scheduled.isCompleted) return 'completed'
    if (scheduled.scheduledDate < new Date()) return 'overdue'
    return 'scheduled'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed': return 'green'
      case 'overdue': return 'red'
      case 'scheduled': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'overdue': return 'Overdue'
      case 'scheduled': return 'Scheduled'
      default: return 'Not Scheduled'
    }
  }

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading schedule...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardBody>
          <HStack justify="space-between" align="center">
            <VStack align="start" spacing={1}>
              <Heading size="md">Class Schedule</Heading>
              <Text fontSize="sm" color="gray.600">
                Schedule dates for each day of the syllabus • {syllabus.totalDays} days total
              </Text>
            </VStack>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="blue"
              size="md"
              onClick={onAutoScheduleOpen}
            >
              Auto-Schedule All
            </Button>
          </HStack>
        </CardBody>
      </Card>

      {/* Schedule Overview */}
      <Card>
        <CardBody>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between">
              <Text fontWeight="semibold">Schedule Overview</Text>
              <HStack spacing={2}>
                <Badge colorScheme="gray" variant="subtle">Not Scheduled</Badge>
                <Badge colorScheme="blue" variant="subtle">Scheduled</Badge>
                <Badge colorScheme="red" variant="subtle">Overdue</Badge>
                <Badge colorScheme="green" variant="subtle">Completed</Badge>
              </HStack>
            </HStack>

            <HStack spacing={6}>
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="gray.500">
                  {Object.keys(scheduledDays).length}
                </Text>
                <Text fontSize="sm" color="gray.600">Scheduled</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="green.500">
                  {Object.values(scheduledDays).filter(d => d.isCompleted).length}
                </Text>
                <Text fontSize="sm" color="gray.600">Completed</Text>
              </Box>
              <Box textAlign="center">
                <Text fontSize="2xl" fontWeight="bold" color="red.500">
                  {Object.values(scheduledDays).filter(d => !d.isCompleted && d.scheduledDate < new Date()).length}
                </Text>
                <Text fontSize="sm" color="gray.600">Overdue</Text>
              </Box>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Weekly Schedule */}
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
                            <Text fontSize="sm" color="gray.600" noOfLines={2}>
                              {day.content}
                            </Text>
                            <HStack spacing={2} mt={2}>
                              {day.duration && (
                                <Badge colorScheme="gray" variant="subtle" size="sm">
                                  {day.duration}
                                </Badge>
                              )}
                              {day.isOnline && (
                                <Badge colorScheme="blue" variant="subtle" size="sm">
                                  Online
                                </Badge>
                              )}
                              {day.isPhysical && (
                                <Badge colorScheme="green" variant="subtle" size="sm">
                                  Physical
                                </Badge>
                              )}
                            </HStack>
                          </VStack>
                          <VStack align="end" spacing={2}>
                            <Badge colorScheme={getStatusColor(status)} variant="subtle">
                              {getStatusText(status)}
                            </Badge>
                          </VStack>
                        </HStack>

                        {/* Inline Date Editor */}
                        <Box p={4} bg="gray.50" borderRadius="md">
                          <VStack spacing={3} align="stretch">
                            <HStack justify="space-between" align="center">
                              <Text fontWeight="medium" fontSize="sm">Schedule Date:</Text>
                              <HStack spacing={2}>
                                <CustomDatePicker
                                  name={`scheduledDate-${day.id}`}
                                  value={scheduled ? scheduled.scheduledDate.toISOString().split('T')[0] : ''}
                                  onChange={(date) => {
                                    if (date) {
                                      const newScheduledDays = {
                                        ...scheduledDays,
                                        [day.id]: {
                                          scheduledDate: date,
                                          isCompleted: scheduled?.isCompleted || false,
                                          notes: scheduled?.notes || ''
                                        }
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
                                      saveScheduledDayInline(day.id, scheduled)
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
                                <HStack justify="space-between" align="center">
                                  <Text fontWeight="medium" fontSize="sm">Status:</Text>
                                  <Checkbox
                                    isChecked={scheduled.isCompleted}
                                    onChange={(e) => {
                                      const newScheduledDays = {
                                        ...scheduledDays,
                                        [day.id]: {
                                          ...scheduled,
                                          isCompleted: e.target.checked
                                        }
                                      }
                                      setScheduledDays(newScheduledDays)
                                      saveScheduledDayInline(day.id, {
                                        ...scheduled,
                                        isCompleted: e.target.checked
                                      })
                                    }}
                                  >
                                    <Text fontSize="sm">Mark as completed</Text>
                                  </Checkbox>
                                </HStack>

                                <HStack justify="space-between" align="start">
                                  <Text fontWeight="medium" fontSize="sm">Notes:</Text>
                                  <Textarea
                                    size="sm"
                                    value={scheduled.notes || ''}
                                    onChange={(e) => {
                                      const newScheduledDays = {
                                        ...scheduledDays,
                                        [day.id]: {
                                          ...scheduled,
                                          notes: e.target.value
                                        }
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
                                    onClick={() => saveScheduledDayInline(day.id, scheduled)}
                                  >
                                    Save Changes
                                  </Button>
                                </HStack>
                              </>
                            )}
                          </VStack>
                        </Box>

                        {/* Quick Actions */}
                        <HStack justify="flex-end" spacing={2}>
                          {!scheduled && (
                            <Button
                              size="sm"
                              colorScheme="blue"
                              leftIcon={<MdAdd />}
                              onClick={() => handleScheduleDay(day)}
                            >
                              Schedule Day
                            </Button>
                          )}
                        </HStack>
                      </VStack>
                    </Box>
                  )
                })}
              </VStack>
            </CardBody>
          </Card>
        ))}
      </VStack>

      {/* Schedule Day Modal */}
      <Modal isOpen={isScheduleOpen} onClose={onScheduleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            Schedule Day: {selectedDay?.title}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl isRequired>
                <FormLabel>Date</FormLabel>
                <CustomDatePicker
                  name="editDate"
                  value={editDate}
                  onChange={(date) => setEditDate(date ? format(date, 'yyyy-MM-dd') : '')}
                  minDate={classStartDate}
                  maxDate={classEndDate}
                />
              </FormControl>

              <FormControl>
                <FormLabel>Notes</FormLabel>
                <Textarea
                  value={editNotes}
                  onChange={(e) => setEditNotes(e.target.value)}
                  placeholder="Add any notes about this day..."
                  rows={3}
                />
              </FormControl>

              <FormControl>
                <Checkbox
                  isChecked={editCompleted}
                  onChange={(e) => setEditCompleted(e.target.checked)}
                >
                  Mark as completed
                </Checkbox>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onScheduleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={saveScheduledDay}
              isLoading={saving}
              loadingText="Saving..."
            >
              Save Schedule
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Auto-Schedule Modal */}
      <Modal isOpen={isAutoScheduleOpen} onClose={onAutoScheduleClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Auto-Schedule Class Days</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <Alert status="info">
                <AlertIcon />
                <AlertDescription>
                  This will automatically schedule all syllabus days between {formatDate(classStartDate)} and {formatDate(classEndDate)}, 
                  skipping weekends. Existing schedules will be overwritten.
                </AlertDescription>
              </Alert>
              
              <Text fontSize="sm" color="gray.600">
                The system will:
              </Text>
              <VStack align="start" spacing={1}>
                <Text fontSize="sm">• Start from {formatDate(classStartDate)}</Text>
                <Text fontSize="sm">• Skip weekends (Saturday and Sunday)</Text>
                <Text fontSize="sm">• Schedule {syllabus.totalDays} days total</Text>
                <Text fontSize="sm">• End by {formatDate(classEndDate)}</Text>
              </VStack>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onAutoScheduleClose}>
              Cancel
            </Button>
            <Button
              colorScheme="blue"
              onClick={autoScheduleDays}
              isLoading={saving}
              loadingText="Scheduling..."
            >
              Auto-Schedule All Days
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
