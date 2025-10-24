// features/portal/admin/classes/class-plan-syllabus-editor.tsx
import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Badge,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Checkbox,
} from '@chakra-ui/react'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import {
  ClassPlanSyllabus,
  SyllabusDay,
} from '../../../../types/syllabus.types'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'

interface ClassPlanSyllabusEditorProps {
  classPlanSyllabusId: string
  classPlan: string
  onUpdate?: () => void
}

// Utility function to safely convert Firestore timestamps to Date objects
const convertToDate = (date: any): Date => {
  if (!date) return new Date()

  // If it's a Firestore timestamp
  if (date.toDate && typeof date.toDate === 'function') {
    return date.toDate()
  }

  // If it's already a Date object
  if (date instanceof Date) {
    return date
  }

  // If it's a string or number
  try {
    return new Date(date)
  } catch {
    return new Date()
  }
}

// Utility function to safely format dates
const formatDateSafely = (date: any): string => {
  try {
    const dateObj = convertToDate(date)
    return dateObj.toLocaleDateString()
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

export const ClassPlanSyllabusEditor: React.FC<
  ClassPlanSyllabusEditorProps
> = ({ classPlanSyllabusId, classPlan, onUpdate }) => {
  const [classPlanSyllabus, setClassPlanSyllabus] =
    useState<ClassPlanSyllabus | null>(null)
  const [loading, setLoading] = useState(true)
  const [saving, setSaving] = useState(false)
  const [editingDay, setEditingDay] = useState<string | null>(null)
  const [editForm, setEditForm] = useState<Partial<SyllabusDay>>({})
  const toast = useToast()
  const { portalUser } = usePortalAuth()
  const isAdmin = portalUser?.role === 'admin'

  useEffect(() => {
    fetchClassPlanSyllabus()
  }, [classPlanSyllabusId])

  const fetchClassPlanSyllabus = async () => {
    try {
      setLoading(true)
      const docRef = doc(portalDb, 'classPlanSyllabi', classPlanSyllabusId)
      const docSnap = await getDoc(docRef)

      if (docSnap.exists()) {
        const data = docSnap.data()

        // Convert all dates safely
        const convertedData: ClassPlanSyllabus = {
          id: docSnap.id,
          classId: data.classId,
          cohortName: data.cohortName,
          classPlan: data.classPlan,
          baseSyllabusId: data.baseSyllabusId,
          syllabus: data.syllabus,
          startDate: convertToDate(data.startDate),
          endDate: convertToDate(data.endDate),
          scheduledDays: convertScheduledDays(data.scheduledDays || {}),
          createdAt: convertToDate(data.createdAt),
          updatedAt: convertToDate(data.updatedAt),
          createdBy: data.createdBy,
          isActive: data.isActive,
        }

        setClassPlanSyllabus(convertedData)
      } else {
        setClassPlanSyllabus(null)
      }
    } catch (error) {
      console.error('Error fetching class plan syllabus:', error)
      toast({
        title: 'Error',
        description: 'Failed to load syllabus',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  // Helper function to convert scheduled days dates
  const convertScheduledDays = (scheduledDays: any): Record<string, any> => {
    const converted: Record<string, any> = {}

    Object.keys(scheduledDays).forEach((key) => {
      const dayData = scheduledDays[key]
      converted[key] = {
        ...dayData,
        scheduledDate: convertToDate(dayData.scheduledDate),
      }
    })

    return converted
  }

  const startEditingDay = (day: SyllabusDay) => {
    setEditingDay(day.id)
    setEditForm({ ...day })
  }

  const cancelEditing = () => {
    setEditingDay(null)
    setEditForm({})
  }

  const saveDayEdit = async (dayId: string) => {
    if (!classPlanSyllabus || !isAdmin) return

    try {
      setSaving(true)

      // Update the syllabus locally
      const updatedWeeks = classPlanSyllabus.syllabus.weeks.map((week) => ({
        ...week,
        days: week.days.map((day) =>
          day.id === dayId ? { ...day, ...editForm } : day,
        ),
      }))

      const updatedSyllabus = {
        ...classPlanSyllabus.syllabus,
        weeks: updatedWeeks,
      }

      // Update in Firestore
      const docRef = doc(portalDb, 'classPlanSyllabi', classPlanSyllabusId)
      await updateDoc(docRef, {
        syllabus: updatedSyllabus,
        updatedAt: new Date(),
      })

      // Update local state
      setClassPlanSyllabus({
        ...classPlanSyllabus,
        syllabus: updatedSyllabus,
      })

      setEditingDay(null)
      setEditForm({})

      toast({
        title: 'Day updated successfully!',
        status: 'success',
        duration: 2000,
      })

      onUpdate?.()
    } catch (error) {
      console.error('Error updating day:', error)
      toast({
        title: 'Error',
        description: 'Failed to update day',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  const updateScheduledDay = async (dayId: string, updates: any) => {
    if (!classPlanSyllabus || !isAdmin) return

    try {
      const updatedScheduledDays = {
        ...classPlanSyllabus.scheduledDays,
        [dayId]: {
          ...classPlanSyllabus.scheduledDays[dayId],
          ...updates,
        },
      }

      const docRef = doc(portalDb, 'classPlanSyllabi', classPlanSyllabusId)
      await updateDoc(docRef, {
        scheduledDays: updatedScheduledDays,
        updatedAt: new Date(),
      })

      setClassPlanSyllabus({
        ...classPlanSyllabus,
        scheduledDays: updatedScheduledDays,
      })

      toast({
        title: 'Schedule updated!',
        status: 'success',
        duration: 2000,
      })
    } catch (error) {
      console.error('Error updating schedule:', error)
      toast({
        title: 'Error',
        description: 'Failed to update schedule',
        status: 'error',
        duration: 3000,
      })
    }
  }

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading syllabus...</Text>
      </Box>
    )
  }

  if (!classPlanSyllabus) {
    return (
      <Alert status="error">
        <AlertIcon />
        Syllabus not found
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      <Card>
        <CardHeader>
          <VStack align="start" spacing={3}>
            <Heading size="lg">{classPlanSyllabus.syllabus.name}</Heading>
            <Text color="gray.600">
              {classPlanSyllabus.syllabus.description}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue">{classPlanSyllabus.classPlan}</Badge>
              <Badge colorScheme="green">
                {classPlanSyllabus.syllabus.totalWeeks} Weeks
              </Badge>
              <Badge colorScheme="purple">
                {classPlanSyllabus.syllabus.totalDays} Days
              </Badge>
            </HStack>
            <HStack spacing={4} fontSize="sm" color="gray.600">
              <Text>
                Start: {formatDateSafely(classPlanSyllabus.startDate)}
              </Text>
              <Text>End: {formatDateSafely(classPlanSyllabus.endDate)}</Text>
            </HStack>
          </VStack>
        </CardHeader>
      </Card>

      <Alert status="info">
        <AlertIcon />
        <Text>
          <strong>Note:</strong> Changes made here only affect this class plan (
          {classPlanSyllabus.classPlan}) and will not impact other class plans
          or the original syllabus template.
        </Text>
      </Alert>

      <Card>
        <CardHeader>
          <Heading size="md">Course Content</Heading>
        </CardHeader>
        <CardBody>
          <Accordion allowMultiple>
            {classPlanSyllabus.syllabus.weeks.map((week, weekIndex) => (
              <AccordionItem key={week.id || weekIndex}>
                <AccordionButton>
                  <Box flex="1" textAlign="left">
                    <HStack>
                      <Text fontWeight="bold">{week.title}</Text>
                      <Badge colorScheme="blue" variant="subtle">
                        {week.days.length} days
                      </Badge>
                    </HStack>
                  </Box>
                  <AccordionIcon />
                </AccordionButton>
                <AccordionPanel>
                  <VStack spacing={4} align="stretch">
                    {week.days.map((day, dayIndex) => {
                      const scheduled = classPlanSyllabus.scheduledDays[day.id]
                      const isEditing = editingDay === day.id

                      return (
                        <Card key={day.id || dayIndex} variant="outline">
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              {isEditing ? (
                                // Edit Mode
                                <VStack spacing={4} align="stretch">
                                  <FormControl>
                                    <FormLabel>Day Title</FormLabel>
                                    <Input
                                      value={editForm.title || ''}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          title: e.target.value,
                                        }))
                                      }
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel>Content</FormLabel>
                                    <Textarea
                                      value={editForm.content || ''}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          content: e.target.value,
                                        }))
                                      }
                                      rows={4}
                                    />
                                  </FormControl>
                                  <FormControl>
                                    <FormLabel>Duration</FormLabel>
                                    <Input
                                      value={editForm.duration || ''}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          duration: e.target.value,
                                        }))
                                      }
                                    />
                                  </FormControl>
                                  <HStack>
                                    <Checkbox
                                      isChecked={editForm.isOnline || false}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          isOnline: e.target.checked,
                                        }))
                                      }
                                    >
                                      Online
                                    </Checkbox>
                                    <Checkbox
                                      isChecked={editForm.isPhysical || false}
                                      onChange={(e) =>
                                        setEditForm((prev) => ({
                                          ...prev,
                                          isPhysical: e.target.checked,
                                        }))
                                      }
                                    >
                                      Physical
                                    </Checkbox>
                                  </HStack>
                                  <HStack spacing={2}>
                                    <Button
                                      size="sm"
                                      colorScheme="blue"
                                      onClick={() => saveDayEdit(day.id)}
                                      isLoading={saving}
                                    >
                                      Save
                                    </Button>
                                    <Button
                                      size="sm"
                                      variant="outline"
                                      onClick={cancelEditing}
                                    >
                                      Cancel
                                    </Button>
                                  </HStack>
                                </VStack>
                              ) : (
                                // View Mode
                                <>
                                  <HStack justify="space-between" align="start">
                                    <VStack align="start" spacing={1} flex="1">
                                      <Text fontWeight="bold" fontSize="lg">
                                        Day {day.dayNumber}: {day.title}
                                      </Text>
                                      <Text
                                        fontSize="sm"
                                        color="gray.600"
                                        whiteSpace="pre-line"
                                      >
                                        {day.content}
                                      </Text>
                                      <HStack spacing={2} mt={2}>
                                        {day.duration && (
                                          <Badge
                                            colorScheme="gray"
                                            variant="subtle"
                                          >
                                            {day.duration}
                                          </Badge>
                                        )}
                                        {day.isOnline && (
                                          <Badge
                                            colorScheme="blue"
                                            variant="subtle"
                                          >
                                            Online
                                          </Badge>
                                        )}
                                        {day.isPhysical && (
                                          <Badge
                                            colorScheme="green"
                                            variant="subtle"
                                          >
                                            Physical
                                          </Badge>
                                        )}
                                      </HStack>
                                    </VStack>
                                    {isAdmin && (
                                      <Button
                                        size="sm"
                                        colorScheme="purple"
                                        variant="outline"
                                        onClick={() => startEditingDay(day)}
                                      >
                                        Edit
                                      </Button>
                                    )}
                                  </HStack>

                                  {/* Schedule Information */}
                                  {scheduled && (
                                    <Box p={3} bg="blue.50" borderRadius="md">
                                      <Text fontSize="sm" fontWeight="medium">
                                        Scheduled for:{' '}
                                        {formatDateSafely(
                                          scheduled.scheduledDate,
                                        )}
                                      </Text>
                                      <Checkbox
                                        isChecked={
                                          scheduled.isCompleted || false
                                        }
                                        onChange={(e) =>
                                          updateScheduledDay(day.id, {
                                            isCompleted: e.target.checked,
                                          })
                                        }
                                        mt={2}
                                      >
                                        Mark as completed
                                      </Checkbox>
                                      {scheduled.notes && (
                                        <Text
                                          fontSize="xs"
                                          color="gray.600"
                                          mt={1}
                                        >
                                          Notes: {scheduled.notes}
                                        </Text>
                                      )}
                                    </Box>
                                  )}
                                </>
                              )}
                            </VStack>
                          </CardBody>
                        </Card>
                      )
                    })}
                  </VStack>
                </AccordionPanel>
              </AccordionItem>
            ))}
          </Accordion>
        </CardBody>
      </Card>
    </VStack>
  )
}
