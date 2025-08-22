import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  IconButton,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Badge,
  useToast,
  Accordion,
  AccordionItem,
  AccordionButton,
  AccordionPanel,
  AccordionIcon,
  Checkbox,
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
} from '@chakra-ui/react'
import { MdAdd, MdDelete, MdDragIndicator } from 'react-icons/md'
import { Syllabus, CreateSyllabusFormData, SyllabusWeek, SyllabusDay } from '../../../../types/syllabus.types'

interface SyllabusFormProps {
  syllabus?: Syllabus | null
  onSubmit: (data: CreateSyllabusFormData) => void
  isSubmitting: boolean
}

export const SyllabusForm: React.FC<SyllabusFormProps> = ({
  syllabus,
  onSubmit,
  isSubmitting
}) => {
  const [formData, setFormData] = useState<CreateSyllabusFormData>({
    name: '',
    description: '',
    weeks: []
  })
  const [errors, setErrors] = useState<Record<string, string>>({})
  const toast = useToast()

  useEffect(() => {
    if (syllabus) {
      setFormData({
        name: syllabus.name,
        description: syllabus.description,
        weeks: syllabus.weeks.map(week => ({
          weekNumber: week.weekNumber,
          title: week.title,
          order: week.order,
          days: week.days.map(day => ({
            dayNumber: day.dayNumber,
            title: day.title,
            content: day.content,
            assignments: day.assignments || [],
            resources: day.resources || [],
            duration: day.duration || '',
            isOnline: day.isOnline || false,
            isPhysical: day.isPhysical || false,
            order: day.order
          }))
        }))
      })
    }
  }, [syllabus])

  const validateForm = (): boolean => {
    const newErrors: Record<string, string> = {}

    if (!formData.name.trim()) {
      newErrors.name = 'Syllabus name is required'
    }

    if (!formData.description.trim()) {
      newErrors.description = 'Description is required'
    }

    if (formData.weeks.length === 0) {
      newErrors.weeks = 'At least one week is required'
    }

    // Validate weeks
    formData.weeks.forEach((week, weekIndex) => {
      if (!week.title.trim()) {
        newErrors[`week-${weekIndex}-title`] = 'Week title is required'
      }
      if (week.days.length === 0) {
        newErrors[`week-${weekIndex}-days`] = 'At least one day is required'
      }

      // Validate days
      week.days.forEach((day, dayIndex) => {
        if (!day.title.trim()) {
          newErrors[`week-${weekIndex}-day-${dayIndex}-title`] = 'Day title is required'
        }
        if (!day.content.trim()) {
          newErrors[`week-${weekIndex}-day-${dayIndex}-content`] = 'Day content is required'
        }
      })
    })

    setErrors(newErrors)
    return Object.keys(newErrors).length === 0
  }

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault()
    
    if (!validateForm()) {
      toast({
        title: 'Validation Error',
        description: 'Please fix the errors in the form',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    onSubmit(formData)
  }

  const addWeek = () => {
    const newWeek: Omit<SyllabusWeek, 'id'> = {
      weekNumber: formData.weeks.length + 1,
      title: `WEEK ${formData.weeks.length + 1}`,
      order: formData.weeks.length + 1,
      days: []
    }
    setFormData(prev => ({
      ...prev,
      weeks: [...prev.weeks, newWeek]
    }))
  }

  const removeWeek = (weekIndex: number) => {
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.filter((_, index) => index !== weekIndex)
    }))
  }

  const updateWeek = (weekIndex: number, field: keyof Omit<SyllabusWeek, 'id'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.map((week, index) => 
        index === weekIndex ? { ...week, [field]: value } : week
      )
    }))
  }

  const addDay = (weekIndex: number) => {
    const week = formData.weeks[weekIndex]
    const newDay: Omit<SyllabusDay, 'id'> = {
      dayNumber: week.days.length + 1,
      title: `Day ${week.days.length + 1}`,
      content: '',
      assignments: [],
      resources: [],
      duration: '',
      isOnline: false,
      isPhysical: true,
      order: week.days.length + 1
    }
    
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.map((w, index) => 
        index === weekIndex ? { ...w, days: [...w.days, newDay] } : w
      )
    }))
  }

  const removeDay = (weekIndex: number, dayIndex: number) => {
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.map((week, wIndex) => 
        wIndex === weekIndex 
          ? { ...week, days: week.days.filter((_, dIndex) => dIndex !== dayIndex) }
          : week
      )
    }))
  }

  const updateDay = (weekIndex: number, dayIndex: number, field: keyof Omit<SyllabusDay, 'id'>, value: any) => {
    setFormData(prev => ({
      ...prev,
      weeks: prev.weeks.map((week, wIndex) => 
        wIndex === weekIndex 
          ? {
              ...week,
              days: week.days.map((day, dIndex) => 
                dIndex === dayIndex ? { ...day, [field]: value } : day
              )
            }
          : week
      )
    }))
  }

  const addAssignment = (weekIndex: number, dayIndex: number) => {
    const currentAssignments = formData.weeks[weekIndex].days[dayIndex].assignments || []
    updateDay(weekIndex, dayIndex, 'assignments', [...currentAssignments, ''])
  }

  const removeAssignment = (weekIndex: number, dayIndex: number, assignmentIndex: number) => {
    const currentAssignments = formData.weeks[weekIndex].days[dayIndex].assignments || []
    const newAssignments = currentAssignments.filter((_, index) => index !== assignmentIndex)
    updateDay(weekIndex, dayIndex, 'assignments', newAssignments)
  }

  const updateAssignment = (weekIndex: number, dayIndex: number, assignmentIndex: number, value: string) => {
    const currentAssignments = formData.weeks[weekIndex].days[dayIndex].assignments || []
    const newAssignments = currentAssignments.map((assignment, index) => 
      index === assignmentIndex ? value : assignment
    )
    updateDay(weekIndex, dayIndex, 'assignments', newAssignments)
  }

  const addResource = (weekIndex: number, dayIndex: number) => {
    const currentResources = formData.weeks[weekIndex].days[dayIndex].resources || []
    updateDay(weekIndex, dayIndex, 'resources', [...currentResources, ''])
  }

  const removeResource = (weekIndex: number, dayIndex: number, resourceIndex: number) => {
    const currentResources = formData.weeks[weekIndex].days[dayIndex].resources || []
    const newResources = currentResources.filter((_, index) => index !== resourceIndex)
    updateDay(weekIndex, dayIndex, 'resources', newResources)
  }

  const updateResource = (weekIndex: number, dayIndex: number, resourceIndex: number, value: string) => {
    const currentResources = formData.weeks[weekIndex].days[dayIndex].resources || []
    const newResources = currentResources.map((resource, index) => 
      index === resourceIndex ? value : resource
    )
    updateDay(weekIndex, dayIndex, 'resources', newResources)
  }

  return (
    <Box as="form" onSubmit={handleSubmit}>
      <VStack spacing={6} align="stretch">
        {/* Basic Information */}
        <Card>
          <CardHeader>
            <Heading size="md">Basic Information</Heading>
          </CardHeader>
          <CardBody>
            <VStack spacing={4}>
              <FormControl isInvalid={!!errors.name} isRequired>
                <FormLabel>Syllabus Name</FormLabel>
                <Input
                  value={formData.name}
                  onChange={(e) => setFormData(prev => ({ ...prev, name: e.target.value }))}
                  placeholder="e.g., UI/UX Design Foundation Course"
                />
                {errors.name && <Text color="red.500" fontSize="sm">{errors.name}</Text>}
              </FormControl>

              <FormControl isInvalid={!!errors.description} isRequired>
                <FormLabel>Description</FormLabel>
                <Textarea
                  value={formData.description}
                  onChange={(e) => setFormData(prev => ({ ...prev, description: e.target.value }))}
                  placeholder="Describe the course syllabus..."
                  rows={3}
                />
                {errors.description && <Text color="red.500" fontSize="sm">{errors.description}</Text>}
              </FormControl>
            </VStack>
          </CardBody>
        </Card>

        {/* Weeks and Days */}
        <Card>
          <CardHeader>
            <HStack justify="space-between">
              <Heading size="md">Course Structure</Heading>
              <Button
                leftIcon={<MdAdd />}
                colorScheme="blue"
                onClick={addWeek}
                size="sm"
              >
                Add Week
              </Button>
            </HStack>
          </CardHeader>
          <CardBody>
            {errors.weeks && <Text color="red.500" fontSize="sm" mb={4}>{errors.weeks}</Text>}
            
            {formData.weeks.length === 0 ? (
              <Box textAlign="center" py={8}>
                <Text color="gray.500" mb={4}>No weeks added yet</Text>
                <Button colorScheme="blue" onClick={addWeek}>
                  Add First Week
                </Button>
              </Box>
            ) : (
              <Accordion allowMultiple>
                {formData.weeks.map((week, weekIndex) => (
                  <AccordionItem key={weekIndex}>
                    <AccordionButton>
                      <Box flex="1" textAlign="left">
                        <HStack>
                          <MdDragIndicator />
                          <Text fontWeight="medium">
                            {week.title} ({week.days.length} days)
                          </Text>
                        </HStack>
                      </Box>
                      <AccordionIcon />
                    </AccordionButton>
                    <AccordionPanel>
                      <VStack spacing={4} align="stretch">
                        {/* Week Details */}
                        <HStack justify="space-between">
                          <FormControl isInvalid={!!errors[`week-${weekIndex}-title`]} isRequired>
                            <FormLabel>Week Title</FormLabel>
                            <Input
                              value={week.title}
                              onChange={(e) => updateWeek(weekIndex, 'title', e.target.value)}
                              placeholder="e.g., WEEK ONE"
                            />
                            {errors[`week-${weekIndex}-title`] && (
                              <Text color="red.500" fontSize="sm">
                                {errors[`week-${weekIndex}-title`]}
                              </Text>
                            )}
                          </FormControl>
                          
                          <FormControl>
                            <FormLabel>Week Number</FormLabel>
                            <NumberInput
                              value={week.weekNumber}
                              onChange={(_, value) => updateWeek(weekIndex, 'weekNumber', value)}
                              min={1}
                            >
                              <NumberInputField />
                              <NumberInputStepper>
                                <NumberIncrementStepper />
                                <NumberDecrementStepper />
                              </NumberInputStepper>
                            </NumberInput>
                          </FormControl>

                          <IconButton
                            aria-label="Remove week"
                            icon={<MdDelete />}
                            colorScheme="red"
                            variant="ghost"
                            onClick={() => removeWeek(weekIndex)}
                            size="sm"
                          />
                        </HStack>

                        {/* Days */}
                        <Box>
                          <HStack justify="space-between" mb={4}>
                            <Text fontWeight="medium">Days</Text>
                            <Button
                              leftIcon={<MdAdd />}
                              size="sm"
                              onClick={() => addDay(weekIndex)}
                            >
                              Add Day
                            </Button>
                          </HStack>

                          {errors[`week-${weekIndex}-days`] && (
                            <Text color="red.500" fontSize="sm" mb={4}>
                              {errors[`week-${weekIndex}-days`]}
                            </Text>
                          )}

                          {week.days.length === 0 ? (
                            <Box textAlign="center" py={4}>
                              <Text color="gray.500" mb={2}>No days added yet</Text>
                              <Button size="sm" onClick={() => addDay(weekIndex)}>
                                Add First Day
                              </Button>
                            </Box>
                          ) : (
                            <VStack spacing={4}>
                              {week.days.map((day, dayIndex) => (
                                <Card key={dayIndex} variant="outline" w="full">
                                  <CardBody>
                                    <VStack spacing={4} align="stretch">
                                      <HStack justify="space-between">
                                        <Text fontWeight="medium">Day {day.dayNumber}</Text>
                                        <IconButton
                                          aria-label="Remove day"
                                          icon={<MdDelete />}
                                          colorScheme="red"
                                          variant="ghost"
                                          size="sm"
                                          onClick={() => removeDay(weekIndex, dayIndex)}
                                        />
                                      </HStack>

                                      <FormControl isInvalid={!!errors[`week-${weekIndex}-day-${dayIndex}-title`]} isRequired>
                                        <FormLabel>Day Title</FormLabel>
                                        <Input
                                          value={day.title}
                                          onChange={(e) => updateDay(weekIndex, dayIndex, 'title', e.target.value)}
                                          placeholder="e.g., Introduction to UI/UX Design"
                                        />
                                        {errors[`week-${weekIndex}-day-${dayIndex}-title`] && (
                                          <Text color="red.500" fontSize="sm">
                                            {errors[`week-${weekIndex}-day-${dayIndex}-title`]}
                                          </Text>
                                        )}
                                      </FormControl>

                                      <FormControl isInvalid={!!errors[`week-${weekIndex}-day-${dayIndex}-content`]} isRequired>
                                        <FormLabel>Content</FormLabel>
                                        <Textarea
                                          value={day.content}
                                          onChange={(e) => updateDay(weekIndex, dayIndex, 'content', e.target.value)}
                                          placeholder="Describe what will be covered in this day..."
                                          rows={4}
                                        />
                                        {errors[`week-${weekIndex}-day-${dayIndex}-content`] && (
                                          <Text color="red.500" fontSize="sm">
                                            {errors[`week-${weekIndex}-day-${dayIndex}-content`]}
                                          </Text>
                                        )}
                                      </FormControl>

                                      <HStack spacing={4}>
                                        <FormControl>
                                          <FormLabel>Duration</FormLabel>
                                          <Input
                                            value={day.duration}
                                            onChange={(e) => updateDay(weekIndex, dayIndex, 'duration', e.target.value)}
                                            placeholder="e.g., 2-3 hours"
                                          />
                                        </FormControl>

                                        <FormControl>
                                          <FormLabel>Class Type</FormLabel>
                                          <HStack>
                                            <Checkbox
                                              isChecked={day.isPhysical}
                                              onChange={(e) => updateDay(weekIndex, dayIndex, 'isPhysical', e.target.checked)}
                                            >
                                              Physical
                                            </Checkbox>
                                            <Checkbox
                                              isChecked={day.isOnline}
                                              onChange={(e) => updateDay(weekIndex, dayIndex, 'isOnline', e.target.checked)}
                                            >
                                              Online
                                            </Checkbox>
                                          </HStack>
                                        </FormControl>
                                      </HStack>

                                      {/* Assignments */}
                                      <Box>
                                        <HStack justify="space-between" mb={2}>
                                          <Text fontWeight="medium">Assignments</Text>
                                          <Button
                                            leftIcon={<MdAdd />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => addAssignment(weekIndex, dayIndex)}
                                          >
                                            Add Assignment
                                          </Button>
                                        </HStack>
                                        <VStack spacing={2}>
                                          {(day.assignments || []).map((assignment, assignmentIndex) => (
                                            <HStack key={assignmentIndex} w="full">
                                              <Input
                                                value={assignment}
                                                onChange={(e) => updateAssignment(weekIndex, dayIndex, assignmentIndex, e.target.value)}
                                                placeholder="Enter assignment description..."
                                              />
                                              <IconButton
                                                aria-label="Remove assignment"
                                                icon={<MdDelete />}
                                                colorScheme="red"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeAssignment(weekIndex, dayIndex, assignmentIndex)}
                                              />
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>

                                      {/* Resources */}
                                      <Box>
                                        <HStack justify="space-between" mb={2}>
                                          <Text fontWeight="medium">Resources</Text>
                                          <Button
                                            leftIcon={<MdAdd />}
                                            size="sm"
                                            variant="ghost"
                                            onClick={() => addResource(weekIndex, dayIndex)}
                                          >
                                            Add Resource
                                          </Button>
                                        </HStack>
                                        <VStack spacing={2}>
                                          {(day.resources || []).map((resource, resourceIndex) => (
                                            <HStack key={resourceIndex} w="full">
                                              <Input
                                                value={resource}
                                                onChange={(e) => updateResource(weekIndex, dayIndex, resourceIndex, e.target.value)}
                                                placeholder="Enter resource URL or description..."
                                              />
                                              <IconButton
                                                aria-label="Remove resource"
                                                icon={<MdDelete />}
                                                colorScheme="red"
                                                variant="ghost"
                                                size="sm"
                                                onClick={() => removeResource(weekIndex, dayIndex, resourceIndex)}
                                              />
                                            </HStack>
                                          ))}
                                        </VStack>
                                      </Box>
                                    </VStack>
                                  </CardBody>
                                </Card>
                              ))}
                            </VStack>
                          )}
                        </Box>
                      </VStack>
                    </AccordionPanel>
                  </AccordionItem>
                ))}
              </Accordion>
            )}
          </CardBody>
        </Card>

        {/* Submit Button */}
        <HStack justify="flex-end" spacing={4}>
          <Button
            type="submit"
            colorScheme="purple"
            size="lg"
            isLoading={isSubmitting}
            loadingText="Saving..."
          >
            {syllabus ? 'Update Syllabus' : 'Create Syllabus'}
          </Button>
        </HStack>
      </VStack>
    </Box>
  )
}
