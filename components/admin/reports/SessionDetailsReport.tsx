import React from 'react'
import {
  Card,
  CardBody,
  CardHeader,
  Heading,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react'
import { formatDate, getStatusColor } from '../../../lib/utils/attendance-formatters'

interface SessionDetailsReportProps {
  sessionDetails: Array<{
    sessionId: string
    date: string
    cohortId: string
    planId: string
    totalStudents: number
    checkedInStudents: number
    attendanceRate: number
    status: string
  }>
}

export function SessionDetailsReport({ sessionDetails }: SessionDetailsReportProps) {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardHeader pb={4}>
        <Heading size="md" color="gray.700">📅 Session Details</Heading>
        <Text fontSize="sm" color="gray.500">
          Detailed breakdown of each session's attendance
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.50">
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Date</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Cohort</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Plan</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Students</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Check-ins</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Attendance Rate</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Status</Th>
              </Tr>
            </Thead>
            <Tbody>
              {sessionDetails.map((session, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="medium" color="gray.700">{formatDate(session.date)}</Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {session.cohortId}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {session.planId}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {session.totalStudents}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium" color="green.600">
                      {session.checkedInStudents}
                    </Text>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={session.attendanceRate >= 80 ? 'green' : session.attendanceRate >= 60 ? 'yellow' : 'red'}
                      variant="solid"
                      fontSize="xs"
                    >
                      {session.attendanceRate.toFixed(1)}%
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme={getStatusColor(session.status)} variant="subtle" fontSize="xs">
                      {session.status}
                    </Badge>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
}
