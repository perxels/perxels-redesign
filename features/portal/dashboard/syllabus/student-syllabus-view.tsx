// features/portal/dashboard/syllabus/student-syllabus-view.tsx
import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Progress,
  Card,
  CardBody,
  Badge,
  Icon,
} from '@chakra-ui/react'
import { MdCheckCircle, MdSchedule, MdWarning } from 'react-icons/md'
import { useSyllabusProgress } from '../../../../hooks/useSyllabusProgress'

interface StudentSyllabusViewProps {
  classPlanSyllabusId: string
  studentId: string
}

export const StudentSyllabusView: React.FC<StudentSyllabusViewProps> = ({
  classPlanSyllabusId,
  studentId,
}) => {
  const { progress, loading } = useSyllabusProgress(
    classPlanSyllabusId,
    studentId,
  )

  if (loading) {
    return <Text>Loading progress...</Text>
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Progress Overview */}
      <Card>
        <CardBody>
          <VStack spacing={4}>
            <HStack justify="space-between" w="full">
              <Text fontWeight="bold">Course Progress</Text>
              <Text fontSize="sm" color="gray.600">
                {progress.completedDays} / {progress.totalDays} sessions
              </Text>
            </HStack>
            <Progress
              value={progress.completionPercentage}
              colorScheme="green"
              size="lg"
              w="full"
            />
            <Text fontSize="2xl" fontWeight="bold" color="green.500">
              {Math.round(progress.completionPercentage)}%
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Upcoming Sessions */}
      {progress.upcomingSessions.length > 0 && (
        <Card>
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={MdSchedule} color="blue.500" />
                <Text fontWeight="bold">Upcoming Sessions</Text>
              </HStack>
              {progress.upcomingSessions.map(
                ([dayId, session]: [string, any]) => (
                  <HStack key={dayId} justify="space-between" w="full">
                    <Text fontSize="sm">Session {session.dayNumber}</Text>
                    <Badge colorScheme="blue">
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </Badge>
                  </HStack>
                ),
              )}
            </VStack>
          </CardBody>
        </Card>
      )}

      {/* Overdue Sessions */}
      {progress.overdueSessions.length > 0 && (
        <Card>
          <CardBody>
            <VStack align="start" spacing={3}>
              <HStack>
                <Icon as={MdWarning} color="orange.500" />
                <Text fontWeight="bold">Missed Sessions</Text>
              </HStack>
              {progress.overdueSessions.map(
                ([dayId, session]: [string, any]) => (
                  <HStack key={dayId} justify="space-between" w="full">
                    <Text fontSize="sm">Session {session.dayNumber}</Text>
                    <Badge colorScheme="orange">
                      {new Date(session.scheduledDate).toLocaleDateString()}
                    </Badge>
                  </HStack>
                ),
              )}
            </VStack>
          </CardBody>
        </Card>
      )}
    </VStack>
  )
}
