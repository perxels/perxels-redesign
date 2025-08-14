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
  FormControl,
  FormLabel,
  Input,
  Textarea,
  Tooltip,
  Icon,
} from '@chakra-ui/react'
import { MdEdit, MdSave, MdClose, MdSchedule } from 'react-icons/md'
import { SyllabusDay } from '../../../../../types/syllabus.types'

// Types
interface ScheduledDay {
  scheduledDate: Date
  isCompleted: boolean
  notes?: string
}

// Utility functions
const getDayStatus = (scheduled: ScheduledDay | null): string => {
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

// Sub-components
export const SyllabusHeader: React.FC<{
  syllabus: {
    name: string
    description: string
    totalWeeks: number
    totalDays: number
    version: string
  }
  onRemoveSyllabus: () => void
}> = ({ syllabus, onRemoveSyllabus }) => (
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
              onClick={onRemoveSyllabus}
            >
              Remove Syllabus
            </Button>
          </HStack>
        </HStack>

        {/* Instructions */}
        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
          <Text fontSize="sm" color="blue.700" fontWeight="medium">
            💡 <strong>How to edit day content:</strong> Click the &ldquo;Edit&rdquo; button next to any day title to modify the day&apos;s title and content. 
            Use the Escape key to cancel editing.
          </Text>
        </Box>
      </VStack>
    </CardBody>
  </Card>
)

export const DayContentEditor: React.FC<{
  day: SyllabusDay
  editDayTitle: string
  editDayContent: string
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onSave: () => void
  onCancel: () => void
  isSaving: boolean
}> = ({ 
  day, 
  editDayTitle, 
  editDayContent, 
  onTitleChange, 
  onContentChange, 
  onSave, 
  onCancel, 
  isSaving 
}) => (
  <VStack align="start" spacing={3} w="full">
    <HStack spacing={2} w="full" justify="space-between">
      <Badge colorScheme="purple" variant="solid" size="sm">
        <HStack spacing={1}>
          <MdEdit />
          <Text>Editing Day {day.dayNumber}</Text>
        </HStack>
      </Badge>
    </HStack>
    
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="semibold" color="purple.600">
        Day {day.dayNumber} Title:
      </FormLabel>
      <Input
        value={editDayTitle}
        onChange={(e) => onTitleChange(e.target.value)}
        size="sm"
        placeholder="Enter day title..."
        borderColor="purple.200"
        _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
      />
    </FormControl>
    
    <FormControl>
      <FormLabel fontSize="sm" fontWeight="semibold" color="purple.600">
        Day Content:
      </FormLabel>
      <Textarea
        value={editDayContent}
        onChange={(e) => onContentChange(e.target.value)}
        size="sm"
        placeholder="Enter day content..."
        rows={4}
        borderColor="purple.200"
        _focus={{ borderColor: 'purple.500', boxShadow: '0 0 0 1px var(--chakra-colors-purple-500)' }}
        resize="vertical"
      />
      <Text fontSize="xs" color="gray.500" mt={1}>
        {editDayContent.length} characters
      </Text>
    </FormControl>

    <HStack spacing={2} w="full" justify="flex-end">
      <Button
        size="sm"
        variant="outline"
        onClick={onCancel}
        isDisabled={isSaving}
        leftIcon={<MdClose />}
      >
        Cancel
      </Button>
      <Button
        size="sm"
        colorScheme="purple"
        onClick={onSave}
        isLoading={isSaving}
        loadingText="Saving..."
        leftIcon={<MdSave />}
      >
        Save Changes
      </Button>
    </HStack>
  </VStack>
)

export const DayContentView: React.FC<{
  day: SyllabusDay
  status: string
  onEdit: () => void
}> = ({ day, status, onEdit }) => (
  <HStack justify="space-between" align="start">
    <VStack align="start" spacing={1} flex="1">
      <HStack justify="space-between" align="center" w="full">
        <Text fontWeight="bold" fontSize="lg">
          Day {day.dayNumber}: {day.title}
        </Text>
        <Tooltip label="Edit day title and content" placement="top">
          <Button
            size="xs"
            variant="ghost"
            colorScheme="purple"
            leftIcon={<MdEdit />}
            onClick={onEdit}
          >
            Edit
          </Button>
        </Tooltip>
      </HStack>
      <Box
        bg="gray.50"
        p={3}
        borderRadius="md"
        border="1px solid"
        borderColor="gray.200"
        w="full"
      >
        <Text fontSize="sm" color="gray.700" whiteSpace="pre-line" lineHeight="1.5">
          {day.content}
        </Text>
      </Box>
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
)

export const SyllabusDayCard: React.FC<{
  day: SyllabusDay
  weekIndex: number
  scheduled: ScheduledDay | null
  status: string
  isEditing: boolean
  editDayTitle: string
  editDayContent: string
  onEditStart: () => void
  onEditSave: () => void
  onEditCancel: () => void
  onTitleChange: (title: string) => void
  onContentChange: (content: string) => void
  onScheduleUpdate: (dayId: string, scheduledDay: ScheduledDay) => void
  onSaveInline: (dayId: string, scheduledDay: ScheduledDay) => void
  scheduledDays: Record<string, ScheduledDay>
  classStartDate?: Date
  classEndDate?: Date
  isSaving: boolean
  safeToISOString: (date: any) => string
}> = ({
  day,
  weekIndex,
  scheduled,
  status,
  isEditing,
  editDayTitle,
  editDayContent,
  onEditStart,
  onEditSave,
  onEditCancel,
  onTitleChange,
  onContentChange,
  onScheduleUpdate,
  onSaveInline,
  scheduledDays,
  classStartDate,
  classEndDate,
  isSaving,
  safeToISOString
}) => (
  <Box
    p={4}
    border="2px solid"
    borderColor={isEditing ? "purple.400" : "gray.200"}
    borderRadius="lg"
    bg={isEditing ? "purple.50" : "white"}
    transition="all 0.2s"
    position="relative"
    _hover={{
      borderColor: isEditing ? "purple.500" : "gray.300",
      boxShadow: isEditing ? "0 4px 12px rgba(128, 90, 213, 0.15)" : "0 2px 4px rgba(0, 0, 0, 0.05)"
    }}
  >
    {isEditing && (
      <Box
        position="absolute"
        top={-2}
        left={4}
        bg="purple.500"
        color="white"
        px={3}
        py={1}
        borderRadius="md"
        fontSize="xs"
        fontWeight="bold"
        zIndex={1}
      >
        EDITING MODE
      </Box>
    )}
    <VStack spacing={4} align="stretch">
      {isEditing ? (
        <DayContentEditor
          day={day}
          editDayTitle={editDayTitle}
          editDayContent={editDayContent}
          onTitleChange={onTitleChange}
          onContentChange={onContentChange}
          onSave={onEditSave}
          onCancel={onEditCancel}
          isSaving={isSaving}
        />
      ) : (
        <DayContentView
          day={day}
          status={status}
          onEdit={onEditStart}
        />
      )}

      {/* Inline Date Editor */}
      <Box p={4} bg="gray.50" borderRadius="md">
        <VStack spacing={3} align="stretch">
          <HStack justify="space-between" align="center">
            <Text fontWeight="medium" fontSize="sm">Schedule Date:</Text>
            <HStack spacing={2}>
              <input
                type="date"
                value={scheduled ? safeToISOString(scheduled.scheduledDate) : ''}
                onChange={(e) => {
                  if (e.target.value) {
                    onScheduleUpdate(day.id, {
                      scheduledDate: new Date(e.target.value),
                      isCompleted: scheduled?.isCompleted || false,
                      notes: scheduled?.notes || ''
                    })
                  }
                }}
                min={classStartDate?.toISOString().split('T')[0]}
                max={classEndDate?.toISOString().split('T')[0]}
                style={{
                  padding: '0.5rem',
                  border: '1px solid #e2e8f0',
                  borderRadius: '0.375rem',
                  fontSize: '0.875rem'
                }}
              />
              <Button
                size="sm"
                colorScheme="blue"
                variant="outline"
                onClick={() => scheduled && onSaveInline(day.id, scheduled)}
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
                <input
                  type="checkbox"
                  checked={scheduled.isCompleted}
                  onChange={(e) => {
                    const updatedScheduled = { ...scheduled, isCompleted: e.target.checked }
                    onScheduleUpdate(day.id, updatedScheduled)
                    onSaveInline(day.id, updatedScheduled)
                  }}
                  style={{ marginLeft: '0.5rem' }}
                />
                <Text fontSize="sm">Mark as completed</Text>
              </HStack>

              <HStack justify="space-between" align="start">
                <Text fontWeight="medium" fontSize="sm">Notes:</Text>
                <textarea
                  value={scheduled.notes || ''}
                  onChange={(e) => {
                    onScheduleUpdate(day.id, { ...scheduled, notes: e.target.value })
                  }}
                  placeholder="Add notes about this day..."
                  rows={2}
                  style={{
                    width: '300px',
                    padding: '0.5rem',
                    border: '1px solid #e2e8f0',
                    borderRadius: '0.375rem',
                    fontSize: '0.875rem',
                    resize: 'vertical'
                  }}
                />
              </HStack>

              <HStack justify="flex-end" spacing={2}>
                <Button
                  size="sm"
                  colorScheme="blue"
                  onClick={() => onSaveInline(day.id, scheduled)}
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

export const EmptySyllabusState: React.FC<{
  onAssignSyllabus: () => void
}> = ({ onAssignSyllabus }) => (
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
            leftIcon={<MdSchedule />}
            colorScheme="purple"
            size="lg"
            onClick={onAssignSyllabus}
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
)

// Export types and utilities
export type { ScheduledDay }
export { getDayStatus, getStatusColor, getStatusText }
