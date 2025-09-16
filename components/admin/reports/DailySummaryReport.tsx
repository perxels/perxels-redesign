import React from 'react'
import {
  Box,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
} from '@chakra-ui/react'
import { formatDate } from '../../../lib/utils/attendance-formatters'

interface DailySummaryReportProps {
  dailySummary: Array<{
    date: string
    sessions: any[]
    totalStudents: number
    totalCheckIns: number
  }>
}

export function DailySummaryReport({ dailySummary }: DailySummaryReportProps) {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardHeader pb={4}>
        <Heading size="md" color="gray.700">📊 Daily Attendance Summary</Heading>
        <Text fontSize="sm" color="gray.500">
          Daily breakdown of attendance across all sessions
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.50">
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Date</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Sessions</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Students</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Check-ins</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Attendance Rate</Th>
              </Tr>
            </Thead>
            <Tbody>
              {dailySummary.map((day, index) => {
                const attendanceRate = day.totalStudents > 0 ? (day.totalCheckIns / day.totalStudents) * 100 : 0
                return (
                  <Tr key={index} _hover={{ bg: "gray.50" }}>
                    <Td fontWeight="medium" color="gray.700">{formatDate(day.date)}</Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle">{day.sessions.length}</Badge>
                    </Td>
                    <Td>{day.totalStudents}</Td>
                    <Td>
                      <Text fontWeight="medium" color="green.600">{day.totalCheckIns}</Text>
                    </Td>
                    <Td>
                      <Badge 
                        colorScheme={attendanceRate >= 80 ? 'green' : attendanceRate >= 60 ? 'yellow' : 'red'}
                        variant="solid"
                        fontSize="xs"
                      >
                        {attendanceRate.toFixed(1)}%
                      </Badge>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>
      </CardBody>
    </Card>
  )
}
