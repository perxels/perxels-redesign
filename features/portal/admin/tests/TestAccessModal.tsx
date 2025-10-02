import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Badge,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Box,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Input,
  InputGroup,
  InputLeftElement,
  SimpleGrid,
  Select,
} from '@chakra-ui/react'
import { FiSearch, FiUser, FiMail, FiCalendar, FiAward } from 'react-icons/fi'
import { Test, TestParticipant } from '../../../../types/test'
import {
  getTestParticipants,
  getTestAnalytics,
} from '../../../../lib/firebase/tests'

interface TestAccessModalProps {
  isOpen: boolean
  onClose: () => void
  test: Test
}

export const TestAccessModal: React.FC<TestAccessModalProps> = ({
  isOpen,
  onClose,
  test,
}) => {
  const [participants, setParticipants] = useState<TestParticipant[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPassed, setFilterPassed] = useState<'all' | 'passed' | 'failed'>(
    'all',
  )

  useEffect(() => {
    if (isOpen && test.testId) {
      loadData()
    }
  }, [isOpen, test.testId])

  const loadData = async () => {
    try {
      setLoading(true)
      const [participantsData, analyticsData] = await Promise.all([
        getTestParticipants(test.testId),
        getTestAnalytics(test.testId),
      ])
      setParticipants(participantsData)
      setAnalytics(analyticsData)
    } catch (error) {
      console.error('Error loading test data:', error)
    } finally {
      setLoading(false)
    }
  }

  // Filter participants based on search and status
  const filteredParticipants = participants.filter((participant) => {
    const matchesSearch =
      participant.studentName
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.studentEmail
        .toLowerCase()
        .includes(searchTerm.toLowerCase()) ||
      participant.cohort?.toLowerCase().includes(searchTerm.toLowerCase()) ||
      participant.classPlan?.toLowerCase().includes(searchTerm.toLowerCase())

    const matchesStatus =
      filterPassed === 'all' ||
      (filterPassed === 'passed' && participant.passed) ||
      (filterPassed === 'failed' && !participant.passed)

    return matchesSearch && matchesStatus
  })

  const formatDate = (date: any) => {
    if (!date) return 'Never'
    try {
      const dateObj = date.toDate ? date.toDate() : new Date(date)
      return dateObj.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'Invalid Date'
    }
  }

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return 'gray'
    if (percentage < test.passingScore) return 'red'
    if (percentage < 80) return 'yellow'
    return 'green'
  }

  const stats = {
    total: participants.length,
    passed: participants.filter((p) => p.passed).length,
    failed: participants.filter((p) => !p.passed).length,
    averageScore: analytics?.averageScore || 0,
    passRate: analytics?.passRate || 0,
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="xl" fontWeight="bold">
              Test Analytics: {test.testName}
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="blue" variant="subtle">
                Code: {test.accessCode}
              </Badge>
              <Badge
                colorScheme={test.isActive ? 'green' : 'red'}
                variant="subtle"
              >
                {test.isActive ? 'Active' : 'Inactive'}
              </Badge>
              <Badge colorScheme="purple" variant="subtle">
                {stats.total} Participants
              </Badge>
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs colorScheme="blue">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Participants ({participants.length})</Tab>
              <Tab>Analytics</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Key Metrics */}
                  <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                    <StatCard
                      label="Total Participants"
                      value={stats.total}
                      color="blue"
                      icon={FiUser}
                    />
                    <StatCard
                      label="Passed"
                      value={stats.passed}
                      color="green"
                      icon={FiAward}
                    />
                    <StatCard
                      label="Failed"
                      value={stats.failed}
                      color="red"
                      icon={FiAward}
                    />
                    <StatCard
                      label="Average Score"
                      value={`${Math.round(stats.averageScore)}%`}
                      color="purple"
                      icon={FiAward}
                    />
                  </SimpleGrid>

                  {/* Test Information */}
                  <Box
                    bg="white"
                    p={6}
                    borderRadius="lg"
                    border="1px"
                    borderColor="gray.200"
                  >
                    <Text fontWeight="bold" mb={4} fontSize="lg">
                      Test Information
                    </Text>
                    <SimpleGrid columns={{ base: 2, md: 4 }} spacing={6}>
                      <InfoItem
                        label="Duration"
                        value={`${test.duration} minutes`}
                      />
                      <InfoItem
                        label="Passing Score"
                        value={`${test.passingScore}%`}
                      />
                      <InfoItem
                        label="Max Attempts"
                        value={test.maxAttempts.toString()}
                      />
                      <InfoItem
                        label="Created"
                        value={formatDate(test.createdAt)}
                      />
                    </SimpleGrid>
                    {test.testDescription && (
                      <Box mt={4}>
                        <Text fontSize="sm" color="gray.600" mb={1}>
                          Description
                        </Text>
                        <Text fontSize="sm">{test.testDescription}</Text>
                      </Box>
                    )}
                  </Box>
                </VStack>
              </TabPanel>

              {/* Participants Tab */}
              <TabPanel>
                {loading ? (
                  <Box textAlign="center" py={8}>
                    <Spinner size="lg" />
                    <Text mt={2} color="gray.500">
                      Loading participants...
                    </Text>
                  </Box>
                ) : participants.length === 0 ? (
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    No students have accessed this test yet. Share the access
                    code <strong> {test.accessCode} </strong> with your
                    students.
                  </Alert>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {/* Filters */}
                    <HStack spacing={4}>
                      <InputGroup maxW="300px">
                        <InputLeftElement pointerEvents="none">
                          <FiSearch color="gray.300" />
                        </InputLeftElement>
                        <Input
                          placeholder="Search participants..."
                          value={searchTerm}
                          onChange={(e) => setSearchTerm(e.target.value)}
                        />
                      </InputGroup>
                      <Select
                        value={filterPassed}
                        onChange={(e) => setFilterPassed(e.target.value as any)}
                        maxW="150px"
                      >
                        <option value="all">All Status</option>
                        <option value="passed">Passed</option>
                        <option value="failed">Failed</option>
                      </Select>
                    </HStack>

                    {/* Participants Table */}
                    <Box
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.200"
                      overflow="hidden"
                    >
                      <Table variant="simple">
                        <Thead bg="gray.50">
                          <Tr>
                            <Th>Student</Th>
                            <Th>Cohort</Th>
                            <Th>Class Plan</Th>
                            <Th>First Access</Th>
                            <Th>Attempts</Th>
                            <Th>Best Score</Th>
                            <Th>Status</Th>
                          </Tr>
                        </Thead>
                        <Tbody>
                          {filteredParticipants.map((participant) => (
                            <Tr
                              key={participant.studentId}
                              _hover={{ bg: 'gray.50' }}
                            >
                              <Td>
                                <VStack align="start" spacing={0}>
                                  <Text fontWeight="medium" fontSize="sm">
                                    {participant.studentName}
                                  </Text>
                                  <Text fontSize="xs" color="gray.500">
                                    {participant.studentEmail}
                                  </Text>
                                </VStack>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {participant.cohort || '-'}
                                </Text>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {participant.classPlan || '-'}
                                </Text>
                              </Td>
                              <Td>
                                <Text fontSize="sm">
                                  {formatDate(participant.accessedAt)}
                                </Text>
                              </Td>
                              <Td>
                                <Text fontWeight="medium">
                                  {participant.attempts}
                                </Text>
                              </Td>
                              <Td>
                                {participant.bestPercentage ? (
                                  <Badge
                                    colorScheme={getScoreColor(
                                      participant.bestPercentage,
                                    )}
                                    variant="subtle"
                                    fontSize="sm"
                                  >
                                    {participant.bestPercentage}%
                                  </Badge>
                                ) : (
                                  <Text fontSize="sm" color="gray.400">
                                    -
                                  </Text>
                                )}
                              </Td>
                              <Td>
                                <Badge
                                  colorScheme={
                                    participant.passed ? 'green' : 'red'
                                  }
                                  variant="subtle"
                                >
                                  {participant.passed ? 'Passed' : 'Failed'}
                                </Badge>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>

                    {filteredParticipants.length === 0 && searchTerm && (
                      <Alert status="info">
                        <AlertIcon />
                        No participants match your search criteria.
                      </Alert>
                    )}
                  </VStack>
                )}
              </TabPanel>

              {/* Analytics Tab */}
              <TabPanel>
                {analytics && (
                  <VStack spacing={6} align="stretch">
                    {/* Performance Metrics */}
                    <SimpleGrid columns={{ base: 1, md: 3 }} spacing={6}>
                      <StatCard
                        label="Total Attempts"
                        value={analytics.totalAttempts}
                        color="blue"
                      />
                      <StatCard
                        label="Average Score"
                        value={`${Math.round(analytics.averageScore)}%`}
                        color="green"
                      />
                      <StatCard
                        label="Pass Rate"
                        value={`${Math.round(analytics.passRate)}%`}
                        color="purple"
                      />
                    </SimpleGrid>

                    {/* Score Distribution (Placeholder for charts) */}
                    {/* <Box
                      bg="white"
                      p={6}
                      borderRadius="lg"
                      border="1px"
                      borderColor="gray.200"
                    >
                      <Text fontWeight="bold" mb={4}>
                        Performance Overview
                      </Text>
                      <Text color="gray.500" textAlign="center" py={8}>
                        Thinking about what should be here...
                      </Text>
                    </Box> */}
                  </VStack>
                )}
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Helper Components
const StatCard = ({ label, value, color, icon: Icon }: any) => (
  <Box bg="white" p={4} borderRadius="lg" border="1px" borderColor="gray.200">
    <HStack spacing={3}>
      {Icon && <Icon size={20} />}
      <Box>
        <Text fontSize="sm" color="gray.600">
          {label}
        </Text>
        <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
          {value}
        </Text>
      </Box>
    </HStack>
  </Box>
)

const InfoItem = ({ label, value }: { label: string; value: string }) => (
  <Box>
    <Text fontSize="sm" color="gray.600" mb={1}>
      {label}
    </Text>
    <Text fontWeight="medium">{value}</Text>
  </Box>
)
