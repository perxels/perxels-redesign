import React, { useEffect, useState, useMemo } from 'react'
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
  FormControl,
  Textarea,
  FormLabel,
  Switch,
  Card,
  CardBody,
  Tooltip,
  IconButton,
  useDisclosure,
} from '@chakra-ui/react'
import {
  FiSearch,
  FiUser,
  FiMail,
  FiCalendar,
  FiAward,
  FiFilter,
  FiX,
  FiEye,
  FiEyeOff,
  FiTrash2,
  FiMessageSquare,
  FiMessageCircle,
} from 'react-icons/fi' // Added FiFilter and FiX
import { Test, TestParticipant, StudentRemark } from '../../../../types/test'
import {
  getTestParticipants,
  getTestAnalytics,
  addStudentRemark,
  getStudentRemarks,
  updateStudentRemark,
  deleteStudentRemark,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'

interface TestAccessModalProps {
  isOpen: boolean
  onClose: () => void
  test: Test
}

//  Add Remark Modal Component
const AddRemarkModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  student: TestParticipant
  test: Test
  onRemarkAdded: () => void
}> = ({ isOpen, onClose, student, test, onRemarkAdded }) => {
  const { portalUser } = usePortalAuth()
  const [remark, setRemark] = useState('')
  const [loading, setLoading] = useState(false)
  const [isVisibleToStudent, setIsVisibleToStudent] = useState(true)

  const handleSubmit = async () => {
    if (!remark.trim() || !portalUser) return

    setLoading(true)
    try {
      await addStudentRemark({
        testId: test.testId,
        studentId: student.studentId,
        addedBy: portalUser.uid,
        addedByName: portalUser.fullName || 'Admin',
        remark: remark.trim(),
        isVisibleToStudent,
      })

      setRemark('')
      onRemarkAdded()
      onClose()
    } catch (error) {
      console.error('Error adding remark:', error)
    } finally {
      setLoading(false)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="lg">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Add Remark for {student.studentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4}>
            <FormControl>
              <FormLabel>Remark/Recommendation</FormLabel>
              <Textarea
                value={remark}
                onChange={(e) => setRemark(e.target.value)}
                placeholder="Enter your remarks or recommendations for this student..."
                rows={6}
              />
            </FormControl>

            {/* <FormControl display="flex" alignItems="center">
              <FormLabel htmlFor="visible-to-student" mb="0">
                Visible to student
              </FormLabel>
              <Switch
                id="visible-to-student"
                isChecked={isVisibleToStudent}
                onChange={(e) => setIsVisibleToStudent(e.target.checked)}
                colorScheme="blue"
              />
            </FormControl> */}

            {/* {!isVisibleToStudent && (
              <Alert status="info" size="sm">
                <AlertIcon />
                This remark will only be visible to admins and facilitators
              </Alert>
            )} */}
          </VStack>
        </ModalBody>
        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={!remark.trim()}
          >
            Add Remark
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

//  View Remarks Modal Component
const ViewRemarksModal: React.FC<{
  isOpen: boolean
  onClose: () => void
  student: TestParticipant
  test: Test
}> = ({ isOpen, onClose, student, test }) => {
  const { portalUser } = usePortalAuth()
  const [remarks, setRemarks] = useState<StudentRemark[]>([])
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    if (isOpen) {
      loadRemarks()
    }
  }, [isOpen])

  const loadRemarks = async () => {
    try {
      setLoading(true)
      const remarksData = await getStudentRemarks(
        student.studentId,
        test.testId,
      )
      setRemarks(remarksData)
    } catch (error) {
      console.error('Error loading remarks:', error)
    } finally {
      setLoading(false)
    }
  }

  const handleToggleVisibility = async (
    remarkId: string,
    currentVisibility: boolean,
  ) => {
    try {
      await updateStudentRemark(remarkId, {
        isVisibleToStudent: !currentVisibility,
      })
      loadRemarks() // Reload to reflect changes
    } catch (error) {
      console.error('Error updating remark visibility:', error)
    }
  }

  const handleDeleteRemark = async (remarkId: string) => {
    if (!confirm('Are you sure you want to delete this remark?')) return

    try {
      await deleteStudentRemark(remarkId)
      loadRemarks() // Reload to reflect changes
    } catch (error) {
      console.error('Error deleting remark:', error)
    }
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Remarks for {student.studentName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {loading ? (
            <Box textAlign="center" py={4}>
              <Spinner size="lg" />
              <Text mt={2}>Loading remarks...</Text>
            </Box>
          ) : remarks.length === 0 ? (
            <Alert status="info">
              <AlertIcon />
              No remarks added for this student yet.
            </Alert>
          ) : (
            <VStack spacing={4} align="stretch">
              {remarks.map((remark) => (
                <Card key={remark.remarkId} variant="outline">
                  <CardBody>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" width="100%">
                        <Text fontSize="sm" color="gray.600">
                          By {remark.addedByName} •{' '}
                          {formatDate(remark.createdAt)}
                        </Text>
                        <HStack>
                          <Tooltip
                            label={
                              remark.isVisibleToStudent
                                ? 'Hide from student'
                                : 'Show to student'
                            }
                          >
                            <IconButton
                              aria-label="Toggle visibility"
                              icon={
                                remark.isVisibleToStudent ? (
                                  <FiEye />
                                ) : (
                                  <FiEyeOff />
                                )
                              }
                              size="sm"
                              variant="ghost"
                              colorScheme={
                                remark.isVisibleToStudent ? 'green' : 'gray'
                              }
                              onClick={() =>
                                handleToggleVisibility(
                                  remark.remarkId,
                                  remark.isVisibleToStudent || false,
                                )
                              }
                            />
                          </Tooltip>
                          <IconButton
                            aria-label="Delete remark"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteRemark(remark.remarkId)}
                          />
                        </HStack>
                      </HStack>
                      <Text>{remark.remark}</Text>
                      {!remark.isVisibleToStudent && (
                        <Badge colorScheme="orange" variant="subtle">
                          Private (Student cannot see this)
                        </Badge>
                      )}
                    </VStack>
                  </CardBody>
                </Card>
              ))}
            </VStack>
          )}
        </ModalBody>
        <ModalFooter>
          <Button onClick={onClose}>Close</Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

export const TestAccessModal: React.FC<TestAccessModalProps> = ({
  isOpen,
  onClose,
  test,
}) => {
  const { portalUser } = usePortalAuth()
  const [participants, setParticipants] = useState<TestParticipant[]>([])
  const [analytics, setAnalytics] = useState<any>(null)
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [filterPassed, setFilterPassed] = useState<'all' | 'passed' | 'failed'>(
    'all',
  )
  const [filterCohort, setFilterCohort] = useState('all')
  const [filterClassPlan, setFilterClassPlan] = useState('all')
  // State for remark modals
  const [selectedStudent, setSelectedStudent] =
    useState<TestParticipant | null>(null)

  const {
    isOpen: isAddRemarkOpen,
    onOpen: onAddRemarkOpen,
    onClose: onAddRemarkClose,
  } = useDisclosure()
  const {
    isOpen: isViewRemarksOpen,
    onOpen: onViewRemarksOpen,
    onClose: onViewRemarksClose,
  } = useDisclosure()

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

  // Handle adding remark
  const handleAddRemark = (student: TestParticipant) => {
    setSelectedStudent(student)
    onAddRemarkOpen()
  }

  // Handle viewing remarks
  const handleViewRemarks = (student: TestParticipant) => {
    setSelectedStudent(student)
    onViewRemarksOpen()
  }

  // Refresh data after remark is added
  const handleRemarkAdded = () => {
    // Might want to refresh participant data or show a success message
  }

  // Get unique values for cohort and class plan filters
  const { uniqueCohorts, uniqueClassPlans } = useMemo(() => {
    const cohorts = new Set<string>()
    const classPlans = new Set<string>()

    participants.forEach((participant) => {
      if (participant.cohort) cohorts.add(participant.cohort)
      if (participant.classPlan) classPlans.add(participant.classPlan)
    })

    return {
      uniqueCohorts: Array.from(cohorts).sort(),
      uniqueClassPlans: Array.from(classPlans).sort(),
    }
  }, [participants])

  //  Filter participants based on all criteria(search, status, cohort Class plan etc...)
  const filteredParticipants = useMemo(() => {
    return participants.filter((participant) => {
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

      // Cohort filter
      const matchesCohort =
        filterCohort === 'all' || participant.cohort === filterCohort

      // Class plan filter
      const matchesClassPlan =
        filterClassPlan === 'all' || participant.classPlan === filterClassPlan

      return matchesSearch && matchesStatus && matchesCohort && matchesClassPlan
    })
  }, [participants, searchTerm, filterPassed, filterCohort, filterClassPlan])

  // Check if any filters are active
  const hasActiveFilters =
    filterPassed !== 'all' ||
    filterCohort !== 'all' ||
    filterClassPlan !== 'all' ||
    searchTerm !== ''

  // Clear all filters
  const clearAllFilters = () => {
    setSearchTerm('')
    setFilterPassed('all')
    setFilterCohort('all')
    setFilterClassPlan('all')
  }

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

  const getPerformanceLabel = (percentage: any) => {
    if (percentage >= 70) {
      return '🏅 Excellent'
    } else if (percentage >= 60) {
      return '💪🏽 Good'
    } else if (percentage >= 40) {
      return '⚖️ Fair'
    } else {
      return '❌ Poor'
    }
  }

  const getPerformanceColor = (percentage: any) => {
    if (percentage >= 70) return 'green'
    if (percentage >= 60) return 'blue'
    if (percentage >= 40) return 'orange'
    return 'red'
  }

  const getScoreColor = (percentage?: number) => {
    if (!percentage) return 'gray'
    if (percentage < test.passingScore) return 'red'
    if (percentage < 70) return 'yellow'
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
                    code <strong>{test.accessCode}</strong> with your students.
                  </Alert>
                ) : (
                  <VStack spacing={4} align="stretch">
                    {/* Filters Section */}
                    <VStack spacing={4} align="stretch">
                      {/* Search and Filter Controls */}
                      <HStack spacing={4} wrap="wrap">
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
                          onChange={(e) =>
                            setFilterPassed(e.target.value as any)
                          }
                          maxW="150px"
                        >
                          <option value="all">All Status</option>
                          <option value="passed">Passed</option>
                          <option value="failed">Failed</option>
                        </Select>

                        {/* Cohort Filter */}
                        <Select
                          value={filterCohort}
                          onChange={(e) => setFilterCohort(e.target.value)}
                          maxW="180px"
                        >
                          <option value="all">All Cohorts</option>
                          {uniqueCohorts.map((cohort) => (
                            <option key={cohort} value={cohort}>
                              {cohort}
                            </option>
                          ))}
                        </Select>

                        {/* Class Plan Filter */}
                        <Select
                          value={filterClassPlan}
                          onChange={(e) => setFilterClassPlan(e.target.value)}
                          maxW="180px"
                        >
                          <option value="all">All Class Plans</option>
                          {uniqueClassPlans.map((classPlan) => (
                            <option key={classPlan} value={classPlan}>
                              {classPlan}
                            </option>
                          ))}
                        </Select>

                        {/* Clear Filters Button */}
                        {hasActiveFilters && (
                          <Button
                            size="sm"
                            variant="outline"
                            leftIcon={<FiX />}
                            onClick={clearAllFilters}
                            colorScheme="gray"
                          >
                            Clear Filters
                          </Button>
                        )}
                      </HStack>

                      {/* Active Filters Display */}
                      {hasActiveFilters && (
                        <HStack spacing={2} flexWrap="wrap">
                          <Text
                            fontSize="md"
                            color="gray.600"
                            fontWeight="bold"
                          >
                            Active Filters:
                          </Text>
                          {filterPassed !== 'all' && (
                            <Badge colorScheme="blue" variant="subtle">
                              Status: {filterPassed}
                            </Badge>
                          )}
                          {filterCohort !== 'all' && (
                            <Badge colorScheme="green" variant="subtle">
                              Cohort: {filterCohort}
                            </Badge>
                          )}
                          {filterClassPlan !== 'all' && (
                            <Badge colorScheme="purple" variant="subtle">
                              Class Plan: {filterClassPlan}
                            </Badge>
                          )}
                          {searchTerm && (
                            <Badge colorScheme="orange" variant="subtle">
                              Search: &apos;{searchTerm}&apos;
                            </Badge>
                          )}
                        </HStack>
                      )}

                      {/* Results Count */}
                      <Text fontSize="sm" color="gray.600">
                        Showing {filteredParticipants.length} of{' '}
                        {participants.length} participants
                      </Text>
                    </VStack>

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
                            {/* <Th>Attempts</Th> */}
                            <Th>Score Points</Th>
                            <Th>Best Score</Th>
                            <Th>Status</Th>
                            <Th>Remarks</Th>
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
                              {/* <Td>
                                <Text fontWeight="medium">
                                  {participant.attempts}
                                </Text>
                              </Td> */}
                              <Td>
                                <Text fontWeight="medium">
                                  {participant.bestScore}
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
                                {/* <Badge
                                  colorScheme={
                                    participant.passed ? 'green' : 'red'
                                  }
                                  variant="subtle"
                                >
                                  {participant.passed ? 'Passed' : 'Failed'}
                                </Badge> */}
                                <Badge
                                  colorScheme={getPerformanceColor(
                                    participant.bestPercentage,
                                  )}
                                  fontSize="lg"
                                  px={4}
                                  py={2}
                                  width={'fit-content'}
                                  height={'fit-content'}
                                >
                                  {getPerformanceLabel(
                                    participant.bestPercentage,
                                  )}
                                </Badge>
                              </Td>
                              {/* Remarks Column */}
                              <Td>
                                <HStack spacing={1}>
                                  <Tooltip label="Add Remark">
                                    <IconButton
                                      aria-label="Add remark"
                                      icon={<FiMessageCircle />}
                                      size="sm"
                                      colorScheme="blue"
                                      variant="ghost"
                                      onClick={() =>
                                        handleAddRemark(participant)
                                      }
                                    />
                                  </Tooltip>
                                  <Tooltip label="View Remarks">
                                    <IconButton
                                      aria-label="View remarks"
                                      icon={<FiEye />}
                                      size="sm"
                                      variant="ghost"
                                      onClick={() =>
                                        handleViewRemarks(participant)
                                      }
                                    />
                                  </Tooltip>
                                </HStack>
                              </Td>
                            </Tr>
                          ))}
                        </Tbody>
                      </Table>
                    </Box>

                    {filteredParticipants.length === 0 && (
                      <Alert status="info">
                        <AlertIcon />
                        {hasActiveFilters
                          ? 'No participants match your filter criteria.'
                          : 'No participants found for this test.'}
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

      {/* Remark Modals */}
      {selectedStudent && (
        <>
          <AddRemarkModal
            isOpen={isAddRemarkOpen}
            onClose={onAddRemarkClose}
            student={selectedStudent}
            test={test}
            onRemarkAdded={handleRemarkAdded}
          />
          <ViewRemarksModal
            isOpen={isViewRemarksOpen}
            onClose={onViewRemarksClose}
            student={selectedStudent}
            test={test}
          />
        </>
      )}
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

// HELPER FUNCTION
const formatDate = (date: any) => {
  if (!date) return 'Unknown date'
  try {
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
      hour: '2-digit',
      minute: '2-digit',
    })
  } catch {
    return 'Invalid Date'
  }
}
