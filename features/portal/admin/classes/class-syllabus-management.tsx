import React, { useMemo } from 'react'
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
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Icon,
} from '@chakra-ui/react'
import { MdAdd, MdSchedule } from 'react-icons/md'
import { Syllabus } from '../../../../types/syllabus.types'
import { useSyllabusManager } from './hooks/useSyllabusManager'
import {
  SyllabusHeader,
  SyllabusDayCard,
  EmptySyllabusState,
  getDayStatus,
} from './components/SyllabusComponents'

interface ClassSyllabusManagementProps {
  classId: string
  currentSyllabusId?: string
  classStartDate?: Date
  classEndDate?: Date
  classPlan?: any
  classPlanSyllabusId?: any
  onSyllabusUpdate?: (syllabusId: string) => void
}

export const ClassSyllabusManagement: React.FC<
  ClassSyllabusManagementProps
> = ({
  classId,
  currentSyllabusId,
  classStartDate,
  classEndDate,
  classPlan,
  classPlanSyllabusId,
  onSyllabusUpdate,
}) => {
  // Use custom hook for all syllabus management logic
  const {
    syllabus,
    availableSyllabi,
    scheduledDays,
    loading,
    loadingSyllabi,
    error,
    editingDay,
    editDayTitle,
    editDayContent,
    savingDayEdit,
    isAdmin,
    fetchAvailableSyllabi,
    startEditingDay,
    cancelEditingDay,
    handleTitleChange,
    handleContentChange,
    saveDayEdit,
    saveScheduledDayInline,
    getScheduledDay,
    handleScheduleUpdate,
    handleAssignSyllabus,
    handleRemoveSyllabus,
    safeToISOString,
    editDayAssignments,
    handleAssignmentChange,
  } = useSyllabusManager({ classId, currentSyllabusId, onSyllabusUpdate })

  // const [editDayAssignments, setEditDayAssignments] = React.useState('')

  const {
    isOpen: isAssignOpen,
    onOpen: onAssignOpen,
    onClose: onAssignClose,
  } = useDisclosure()

  // Fetch syllabi when modal opens
  React.useEffect(() => {
    if (isAssignOpen && isAdmin) {
      fetchAvailableSyllabi()
    }
  }, [isAssignOpen, isAdmin, fetchAvailableSyllabi])

  // Memoized handlers
  const handleAssignSyllabusWithClose = useMemo(
    () => async (syllabusId: string) => {
      const success = await handleAssignSyllabus(syllabusId)
      if (success) {
        onAssignClose()
      }
    },
    [handleAssignSyllabus, onAssignClose],
  )

  // Loading state
  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading syllabus...</Text>
      </Box>
    )
  }

  // Error state
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
      {/* Syllabus Content */}
      {syllabus ? (
        <>
          <SyllabusHeader
            syllabus={syllabus}
            onRemoveSyllabus={handleRemoveSyllabus}
          />

          {/* Full Syllabus with Inline Scheduling */}
          <VStack spacing={6} align="stretch">
            {syllabus.weeks.map((week: any, weekIndex: number) => (
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
                    {week.days.map((day: any, dayIndex: number) => {
                      const scheduled = getScheduledDay(day.id)
                      const status = getDayStatus(scheduled)

                      return (
                        <SyllabusDayCard
                          key={day.id || dayIndex}
                          day={day}
                          weekIndex={weekIndex}
                          scheduled={scheduled}
                          status={status}
                          isEditing={editingDay === day.id}
                          editDayTitle={editDayTitle}
                          editDayContent={editDayContent}
                          editDayAssignments={editDayAssignments}
                          onEditStart={() => {
                            handleAssignmentChange(
                              Array.isArray(day.assignments)
                                ? day.assignments.join('\n')
                                : '',
                            )
                            startEditingDay(day)
                          }}
                          onEditSave={() => {
                            const assignmentsArray = editDayAssignments
                              .split('\n')
                              .map((s) => s.trim())
                              .filter(Boolean)
                            saveDayEdit({
                              ...day,
                              assignments: assignmentsArray,
                            })
                          }}
                          onEditCancel={() => {
                            handleAssignmentChange('')
                            cancelEditingDay()
                          }}
                          onTitleChange={handleTitleChange}
                          onContentChange={handleContentChange}
                          onAssignmentChange={handleAssignmentChange}
                          onScheduleUpdate={handleScheduleUpdate}
                          onSaveInline={saveScheduledDayInline}
                          scheduledDays={scheduledDays}
                          classStartDate={classStartDate}
                          classEndDate={classEndDate}
                          isSaving={savingDayEdit}
                          safeToISOString={safeToISOString}
                        />
                      )
                    })}
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </VStack>
        </>
      ) : (
        <EmptySyllabusState onAssignSyllabus={onAssignOpen} />
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
                    onClick={() => handleAssignSyllabusWithClose(syllabus.id)}
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
