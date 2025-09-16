import React from 'react'
import {
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
  Box,
} from '@chakra-ui/react'

interface CohortPerformanceReportProps {
  cohortPerformance: Array<{
    cohortId: string
    planId: string
    totalSessions: number
    totalStudents: number
    totalCheckIns: number
    attendanceRate: number
  }>
}

export function CohortPerformanceReport({ cohortPerformance }: CohortPerformanceReportProps) {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardHeader pb={4}>
        <Heading size="md" color="gray.700">🏆 Cohort Performance</Heading>
        <Text fontSize="sm" color="gray.500">
          Performance comparison across different cohorts and class plans
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.50">
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Cohort</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Plan</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Sessions</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Students</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Check-ins</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Attendance Rate</Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">Performance</Th>
              </Tr>
            </Thead>
            <Tbody>
              {cohortPerformance.map((cohort, index) => (
                <Tr key={index} _hover={{ bg: "gray.50" }}>
                  <Td fontWeight="medium" color="gray.700">{cohort.cohortId}</Td>
                  <Td>
                    <Text fontSize="sm" color="gray.600">
                      {cohort.planId}
                    </Text>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {cohort.totalSessions}
                    </Badge>
                  </Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium" color="gray.700">
                      {cohort.totalStudents}
                    </Text>
                  </Td>
                  <Td>
                    <Text fontSize="sm" fontWeight="medium" color="green.600">
                      {cohort.totalCheckIns}
                    </Text>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={cohort.attendanceRate >= 80 ? 'green' : cohort.attendanceRate >= 60 ? 'yellow' : 'red'}
                      variant="solid"
                      fontSize="xs"
                    >
                      {cohort.attendanceRate.toFixed(1)}%
                    </Badge>
                  </Td>
                  <Td>
                    <Badge 
                      colorScheme={cohort.attendanceRate >= 80 ? 'green' : cohort.attendanceRate >= 60 ? 'yellow' : 'red'}
                      variant="subtle"
                      fontSize="xs"
                    >
                      {cohort.attendanceRate >= 80 ? 'Excellent' : cohort.attendanceRate >= 60 ? 'Good' : 'Needs Improvement'}
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
