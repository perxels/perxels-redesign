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
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalCloseButton,
  ModalBody,
} from '@chakra-ui/react'

interface StudentHistoryReportProps {
  students: Array<{
    id: string
    fullName?: string
    email?: string
    phone?: string
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
  const [selectedStudent, setSelectedStudent] = useState<any>('')

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

  // For view SAH details modal
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure()

  const viewDetails = (student: any) => {
    setSelectedStudent(student)
    onDetailsOpen()
  }

  return (
    <Box>
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
                  {filteredStudents[0]?.totalSessions === 1 ? (
                    <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                      Status
                    </Th>
                  ) : (
                    <>
                      <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                        Present
                      </Th>
                      <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                        Absent
                      </Th>
                    </>
                  )}

                  {/* <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Rate
                </Th>
                <Th fontSize="sm" fontWeight="semibold" color="gray.600">
                  Status
                </Th> */}
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
                              {student.email}
                            </Text>
                            <Text
                              fontSize="xs"
                              color="gray.500"
                              fontFamily="mono"
                            >
                              {/* {student.id.substring(0, 8)}... */}
                              {student.phone}
                            </Text>
                          </VStack>
                        </HStack>
                      </Td>
                      <Td>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="gray.700"
                        >
                          {student.schoolFeeInfo?.cohort || 'N/A'}
                        </Text>
                      </Td>
                      <Td>
                        <Text fontSize="sm" color="gray.600">
                          {student.schoolFeeInfo?.classPlan || 'N/A'}
                        </Text>
                      </Td>
                      <Td>
                        <Badge
                          colorScheme="blue"
                          variant="subtle"
                          fontSize="xs"
                        >
                          {student.totalSessions}
                        </Badge>
                      </Td>
                      <Td>
                        <Text
                          fontSize="sm"
                          fontWeight="medium"
                          color="green.600"
                        >
                          {student.checkIns}
                        </Text>
                      </Td>
                      {/* Rate */}
                      {/* <Td>
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
                    </Td> */}

                      {/* Present and Absent */}
                      {student.totalSessions === 1 ? (
                        <>
                          {student.totalSessions === student.checkIns ? (
                            <Td>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="green.600"
                              >
                                Present
                              </Text>
                            </Td>
                          ) : (
                            <Td>
                              <Text
                                fontSize="sm"
                                fontWeight="medium"
                                color="red"
                              >
                                Absent
                              </Text>
                            </Td>
                          )}
                        </>
                      ) : (
                        <>
                          <Td>
                            <Text
                              fontSize="sm"
                              fontWeight="medium"
                              color="green.600"
                            >
                              {student.checkIns}
                            </Text>
                          </Td>
                          <Td>
                            <Badge
                              colorScheme={
                                student.checkIns >
                                student.totalSessions - student.checkIns
                                  ? 'green'
                                  : student.checkIns ==
                                    student.totalSessions - student.checkIns
                                  ? 'yellow'
                                  : 'red'
                              }
                              variant="solid"
                              fontSize="xs"
                            >
                              {student.totalSessions - student.checkIns}
                            </Badge>
                          </Td>
                        </>
                      )}

                      <Td>
                        <Button
                          size="xs"
                          variant="outline"
                          onClick={() => viewDetails(student)}
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
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="lg">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Attendance History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={2} align="stretch" p={4} borderRadius="lg">
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Name:
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  fontWeight="medium"
                  casing={'capitalize'}
                >
                  {selectedStudent.fullName || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Email:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.email || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Phone:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.phone || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Gender:
                </Text>
                <Text
                  fontSize="sm"
                  color="gray.600"
                  fontWeight="medium"
                  casing={'capitalize'}
                >
                  {selectedStudent.growthInfo?.gender || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Cohort:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.schoolFeeInfo?.cohort || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Class Plan:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.schoolFeeInfo?.classPlan || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Sessions:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.totalSessions || 'N/A'}
                </Text>
              </HStack>
              <HStack align="center" justifyContent="space-between" spacing={4}>
                <Text fontSize="md" color="gray.600" fontWeight="bold">
                  Check-Ins:
                </Text>
                <Text fontSize="sm" color="gray.600" fontWeight="medium">
                  {selectedStudent.checkIns || 0}
                </Text>
              </HStack>
              <VStack mt={3} spacing={2}>
                <Text>Session Details</Text>
                {selectedStudent.sessions &&
                  selectedStudent.sessions.map((session: any) => (
                    <HStack
                      align="center"
                      justifyContent="space-between"
                      spacing={2}
                      width={'100%'}
                      key={session.sessionId}
                    >
                      <Box display={'flex'} alignItems="center" gap={1}>
                        <Text fontSize="md" color="gray.600" fontWeight="bold">
                          Day:
                        </Text>

                        <Text
                          fontSize="sm"
                          color="gray.600"
                          fontWeight="medium"
                        >
                          {session.date}
                        </Text>
                      </Box>
                      <Text
                        fontSize="md"
                        fontWeight="bold"
                        color={session.checkedIn ? 'green' : 'red'}
                      >
                        {session.checkedIn ? 'Present' : 'Absent'}
                      </Text>
                    </HStack>
                  ))}
              </VStack>
            </VStack>
          </ModalBody>
        </ModalContent>
      </Modal>
    </Box>
  )
}
