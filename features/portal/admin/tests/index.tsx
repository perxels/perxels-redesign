import React, { useState, useEffect } from 'react'
import {
  Box,
  Button,
  VStack,
  HStack,
  Text,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  useDisclosure,
  Spinner,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  useToast,
  Input,
  Select,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import {
  FiEye,
  FiEdit,
  FiTrash2,
  FiUsers,
  FiPlay,
  FiPause,
  FiPlus,
} from 'react-icons/fi'
import { CreateTestModal } from './CreateTestModal'
import { TestAccessModal } from './TestAccessModal'
import { EditTestModal } from './EditTestModal'
import {
  getAllTests,
  toggleTestStatus,
  deleteTest,
  getTestAnalytics,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test } from '../../../../types/test'

export const AdminTestsWrapper = () => {
  const { portalUser } = usePortalAuth()
  const [tests, setTests] = useState<Test[]>([])
  const [filteredTests, setFilteredTests] = useState<Test[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [selectedTest, setSelectedTest] = useState<Test | null>(null)
  const [testToToggle, setTestToToggle] = useState<Test | null>(null)
  const [testToDelete, setTestToDelete] = useState<Test | null>(null)

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const {
    isOpen: isAccessOpen,
    onOpen: onAccessOpen,
    onClose: onAccessClose,
  } = useDisclosure()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  const toast = useToast()

  useEffect(() => {
    loadTests()
  }, [])

  // Filter tests
  useEffect(() => {
    let filtered = tests

    if (searchTerm) {
      filtered = filtered.filter(
        (test) =>
          test.testName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          test.testDescription
            ?.toLowerCase()
            .includes(searchTerm.toLowerCase()) ||
          test.accessCode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    if (statusFilter !== 'all') {
      filtered = filtered.filter((test) =>
        statusFilter === 'active' ? test.isActive : !test.isActive,
      )
    }

    setFilteredTests(filtered)
  }, [tests, searchTerm, statusFilter])

  const loadTests = async () => {
    try {
      setError('')
      setLoading(true)
      const testsData = await getAllTests()
      setTests(testsData)
    } catch (error) {
      console.error('Error loading tests:', error)
      setError('Failed to load tests. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleViewAccess = async (test: Test) => {
    try {
      // Load analytics data for the test
      const analytics = await getTestAnalytics(test.testId)
      setSelectedTest({ ...test, analytics })
      onAccessOpen()
    } catch (error) {
      console.error('Error loading test analytics:', error)
      toast({
        title: 'Error',
        description: 'Failed to load test analytics',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleEditTest = (test: Test) => {
    setSelectedTest(test)
    onEditOpen()
  }

  const handleToggleStatus = (test: Test) => {
    setTestToToggle(test)
    onConfirmOpen()
  }

  const handleDeleteTest = (test: Test) => {
    setTestToDelete(test)
    onDeleteOpen()
  }

  const confirmToggleStatus = async () => {
    if (!testToToggle) return

    try {
      await toggleTestStatus(testToToggle.testId, !testToToggle.isActive)
      toast({
        title: 'Status Changed',
        description: `Test "${testToToggle.testName}" is now ${
          testToToggle.isActive ? 'inactive' : 'active'
        }.`,
        status: 'success',
        duration: 3000,
      })
      loadTests()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast({
        title: 'Error',
        description: 'Failed to toggle test status',
        status: 'error',
        duration: 3000,
      })
    } finally {
      onConfirmClose()
      setTestToToggle(null)
    }
  }

  const confirmDeleteTest = async () => {
    if (!testToDelete) return

    try {
      await deleteTest(testToDelete.testId)
      toast({
        title: 'Test Deleted',
        description: `Test "${testToDelete.testName}" has been deleted.`,
        status: 'success',
        duration: 3000,
      })
      loadTests()
    } catch (error) {
      console.error('Error deleting test:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete test',
        status: 'error',
        duration: 3000,
      })
    } finally {
      onDeleteClose()
      setTestToDelete(null)
    }
  }

  const getStats = () => {
    const totalTests = tests.length
    const activeTests = tests.filter((t) => t.isActive).length
    const totalParticipants = tests.reduce(
      (sum, test) => sum + test.totalParticipants,
      0,
    )

    return { totalTests, activeTests, totalParticipants }
  }

  const stats = getStats()

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" />
        <Text>Loading tests...</Text>
      </VStack>
    )
  }

  return (
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="2xl" fontWeight="bold">
              Tests Management
            </Text>
            <Text color="gray.600">
              Create and manage tests with access codes
            </Text>
          </Box>
          <Button
            leftIcon={<FiPlus />}
            colorScheme="blue"
            onClick={onCreateOpen}
          >
            Create Test
          </Button>
        </Flex>

        {/* Stats */}
        <HStack spacing={6}>
          <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">
              Total Tests
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.600">
              {stats.totalTests}
            </Text>
          </Box>
          <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">
              Active Tests
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.600">
              {stats.activeTests}
            </Text>
          </Box>
          <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
            <Text fontSize="sm" color="gray.500">
              Total Participants
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="purple.600">
              {stats.totalParticipants}
            </Text>
          </Box>
        </HStack>

        {/* Filters */}
        <HStack spacing={4} bg="white" p={4} borderRadius="lg" shadow="sm">
          <Input
            placeholder="Search tests..."
            value={searchTerm}
            onChange={(e) => setSearchTerm(e.target.value)}
            maxW="300px"
          />
          <Select
            value={statusFilter}
            onChange={(e) => setStatusFilter(e.target.value as any)}
            maxW="150px"
          >
            <option value="all">All Status</option>
            <option value="active">Active</option>
            <option value="inactive">Inactive</option>
          </Select>
        </HStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            {error}
          </Alert>
        )}

        {/* Tests Table */}
        <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
          {filteredTests.length === 0 ? (
            <Box p={8} textAlign="center">
              <Text color="gray.500" fontSize="lg">
                {tests.length === 0
                  ? 'No tests created yet'
                  : 'No tests match your filters'}
              </Text>
              {tests.length === 0 && (
                <Button
                  mt={4}
                  colorScheme="blue"
                  leftIcon={<FiPlus />}
                  onClick={onCreateOpen}
                >
                  Create Your First Test
                </Button>
              )}
            </Box>
          ) : (
            <Table variant="simple">
              <Thead bg="gray.50">
                <Tr>
                  <Th>Test Name</Th>
                  <Th>Access Code</Th>
                  <Th>Participants</Th>
                  <Th>Duration</Th>
                  <Th>Status</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredTests.map((test) => (
                  <Tr key={test.testId} _hover={{ bg: 'gray.50' }}>
                    <Td fontWeight="medium">{test.testName}</Td>
                    <Td>
                      <Badge colorScheme="blue" fontSize="md" fontFamily="mono">
                        {test.accessCode}
                      </Badge>
                    </Td>
                    <Td>
                      <HStack>
                        <Text>{test.totalParticipants}</Text>
                        <Text fontSize="sm" color="gray.500">
                          students
                        </Text>
                      </HStack>
                    </Td>
                    <Td>{test.duration} mins</Td>
                    <Td>
                      <Badge colorScheme={test.isActive ? 'green' : 'red'}>
                        {test.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      {test.createdAt?.toDate
                        ? new Date(test.createdAt.toDate()).toLocaleDateString()
                        : 'Invalid date'}
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Tooltip label="View Participants & Results">
                          <IconButton
                            aria-label="View access"
                            icon={<FiUsers />}
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAccess(test)}
                          />
                        </Tooltip>
                        <Tooltip label="Edit Test">
                          <IconButton
                            aria-label="Edit test"
                            icon={<FiEdit />}
                            size="sm"
                            onClick={() => handleEditTest(test)}
                          />
                        </Tooltip>
                        <Tooltip
                          label={test.isActive ? 'Deactivate' : 'Activate'}
                        >
                          <IconButton
                            aria-label="Toggle status"
                            icon={test.isActive ? <FiPause /> : <FiPlay />}
                            size="sm"
                            variant="ghost"
                            colorScheme={test.isActive ? 'red' : 'green'}
                            onClick={() => handleToggleStatus(test)}
                          />
                        </Tooltip>
                        <Tooltip label="Delete Test">
                          <IconButton
                            aria-label="Delete test"
                            icon={<FiTrash2 />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDeleteTest(test)}
                          />
                        </Tooltip>
                      </HStack>
                    </Td>
                  </Tr>
                ))}
              </Tbody>
            </Table>
          )}
        </Box>
      </VStack>

      {/* Modals */}
      <CreateTestModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onTestCreated={loadTests}
      />

      {selectedTest && (
        <TestAccessModal
          isOpen={isAccessOpen}
          onClose={onAccessClose}
          test={selectedTest}
        />
      )}

      {selectedTest && (
        <EditTestModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          test={selectedTest}
          onTestUpdated={loadTests}
        />
      )}

      {/* Toggle Status Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Status Change</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to{' '}
              {testToToggle?.isActive ? 'deactivate' : 'activate'} the test
              &ldquo;{testToToggle?.testName}&rdquo;?
            </Text>
            {testToToggle?.isActive && (
              <Text mt={2} color="orange.600" fontSize="sm">
                Deactivating will prevent students from accessing this test.
              </Text>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button
              colorScheme={testToToggle?.isActive ? 'red' : 'green'}
              onClick={confirmToggleStatus}
            >
              {testToToggle?.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Test</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete the test &ldquo;
              {testToDelete?.testName}&rdquo;?
            </Text>
            <Text mt={2} color="red.600" fontSize="sm">
              This action cannot be undone. All test data, questions, and
              results will be permanently deleted.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={confirmDeleteTest}>
              Delete Test
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
