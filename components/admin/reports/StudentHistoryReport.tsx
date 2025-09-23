import React, { useState, useMemo } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  FormControl,
  FormLabel,
  Input,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  CardHeader,
  Heading,
} from '@chakra-ui/react'

interface StudentHistoryReportProps {
  students: Array<{
    id: string
    fullName?: string
    email?: string
    schoolFeeInfo?: {
      cohort?: string
      classPlan?: string
    }
    totalSessions: number
    checkIns: number
  }>
}

export function StudentHistoryReport({ students }: StudentHistoryReportProps) {
  const [searchTerm, setSearchTerm] = useState<string>('')
  const [selectedStudent, setSelectedStudent] = useState<string>('')

  // Filter students based on search term
  const filteredStudents = useMemo(() => {
    if (!searchTerm.trim()) return students

    const term = searchTerm.toLowerCase()
    return students.filter(
      (student) =>
        (student.fullName || '').toLowerCase().includes(term) ||
        (student.email || '').toLowerCase().includes(term) ||
        (student.id || '').toLowerCase().includes(term) ||
        (student.schoolFeeInfo?.cohort || '').toLowerCase().includes(term) ||
        (student.schoolFeeInfo?.classPlan || '').toLowerCase().includes(term),
    )
  }, [students, searchTerm])
  console.log({ selectedStudent })

  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardHeader pb={4}>
        <Heading size="md" color="gray.700">
          👥 Student Attendance History
        </Heading>
        <Text fontSize="sm" color="gray.500">
          Comprehensive student attendance tracking and analytics
        </Text>
      </CardHeader>
      <CardBody pt={0}>
        {/* Enhanced Search and Filter Controls */}
        <Box bg="gray.50" p={5} borderRadius="lg" mb={6}>
          <VStack spacing={4} align="stretch">
            <HStack justify="space-between" align="center">
              <Text fontSize="sm" fontWeight="medium" color="gray.600">
                Search & Filter Students
              </Text>
              <Text fontSize="xs" color="gray.500">
                {filteredStudents.length} student
                {filteredStudents.length !== 1 ? 's' : ''} found
              </Text>
            </HStack>

            <HStack spacing={4} alignItems="flex-end">
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Search Students
                </FormLabel>
                <Input
                  placeholder="Search by name, email, cohort, or plan..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  bg="white"
                  size="md"
                  _focus={{
                    borderColor: 'blue.400',
                    boxShadow: '0 0 0 1px blue.400',
                  }}
                />
              </FormControl>

              <HStack spacing={4} justify="flex-end">
                <Button
                  variant="outline"
                  onClick={() => {
                    setSelectedStudent('')
                    setSearchTerm('')
                  }}
                  size="md"
                  colorScheme="gray"
                >
                  Clear Filters
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </Box>

        {/* Enhanced All Students Summary Table */}
        <Box overflowX="auto">
          <Table variant="simple" size="sm">
            <Thead>
              <Tr bg="gray.50">
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Student
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Cohort
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Plan
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Sessions
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Check-ins
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Rate
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Status
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Actions
                </Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredStudents.map((student) => {
                const attendanceRate =
                  student.totalSessions > 0
                    ? (student.checkIns / student.totalSessions) * 100
                    : 0
                return (
                  <Tr key={student.id} _hover={{ bg: 'gray.50' }}>
                    <Td>
                      <HStack spacing={3}>
                        <Box
                          w={12}
                          h={12}
                          borderRadius="full"
                          bg="gradient-to-r"
                          bgGradient="linear(to-r, blue.400, purple.400)"
                          display="flex"
                          alignItems="center"
                          justifyContent="center"
                          fontSize="lg"
                          fontWeight="bold"
                          color="white"
                          shadow="sm"
                        >
                          {(student.fullName || student.email || student.id)
                            .charAt(0)
                            .toUpperCase()}
                        </Box>
                        <VStack align="start" spacing={1}>
                          <Text
                            fontWeight="medium"
                            fontSize="sm"
                            color="gray.700"
                          >
                            {student.fullName || student.email}
                          </Text>
                          <Text
                            fontSize="xs"
                            color="gray.500"
                            fontFamily="mono"
                          >
                            {student.id.substring(0, 8)}...
                          </Text>
                        </VStack>
                      </HStack>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium" color="gray.700">
                        {student.schoolFeeInfo?.cohort || 'N/A'}
                      </Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {student.schoolFeeInfo?.classPlan || 'N/A'}
                      </Text>
                    </Td>
                    <Td>
                      <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                        {student.totalSessions}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontSize="sm" fontWeight="medium" color="green.600">
                        {student.checkIns}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          attendanceRate >= 80
                            ? 'green'
                            : attendanceRate >= 60
                            ? 'yellow'
                            : 'red'
                        }
                        variant="solid"
                        fontSize="xs"
                      >
                        {attendanceRate.toFixed(1)}%
                      </Badge>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={
                          attendanceRate >= 80
                            ? 'green'
                            : attendanceRate >= 60
                            ? 'yellow'
                            : 'red'
                        }
                        variant="subtle"
                        fontSize="xs"
                      >
                        {attendanceRate >= 80
                          ? 'Excellent'
                          : attendanceRate >= 60
                          ? 'Good'
                          : 'Poor'}
                      </Badge>
                    </Td>
                    <Td>
                      <Button
                        size="xs"
                        variant="outline"
                        onClick={() => setSelectedStudent(student.id)}
                        colorScheme="blue"
                        _hover={{ bg: 'blue.50' }}
                      >
                        View Details
                      </Button>
                    </Td>
                  </Tr>
                )
              })}
            </Tbody>
          </Table>
        </Box>

        {filteredStudents.length === 0 && (
          <Box textAlign="center" py={12} bg="gray.50" borderRadius="lg">
            <Text fontSize="lg" color="gray.500" mb={2}>
              {searchTerm
                ? '🔍 No students found matching your search.'
                : '📊 No students found in the selected date range.'}
            </Text>
            <Text fontSize="sm" color="gray.400">
              Try adjusting your filters or search terms
            </Text>
          </Box>
        )}
      </CardBody>
    </Card>
  )
}
