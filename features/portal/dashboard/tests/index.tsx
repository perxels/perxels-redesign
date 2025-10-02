import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  Button,
  HStack,
  Badge,
  SimpleGrid,
  Spinner,
  Alert,
  AlertIcon,
  Input,
  InputGroup,
  InputRightElement,
  useToast,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
} from '@chakra-ui/react'
import Link from 'next/link'
import {
  getStudentAccessibleTests,
  validateAccessCode,
  getStudentResults,
  getStudentAttempts,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { TestResult } from '../../../../types/test'
import { canTakeTest } from '../../../../lib/utils/test-validation'

export const StudentTestsWrapper = () => {
  const { portalUser, user } = usePortalAuth()
  const [availableTests, setAvailableTests] = useState<any[]>([])
  const [testResults, setTestResults] = useState<TestResult[]>([])
  const [loading, setLoading] = useState(true)
  const [resultsLoading, setResultsLoading] = useState(true)
  const [error, setError] = useState('')
  const [testStatus, setTestStatus] = useState<{ [key: string]: boolean }>({})
  const [accessCode, setAccessCode] = useState('')
  const [enteringCode, setEnteringCode] = useState(false)
  const [applyingCode, setApplyingCode] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [testAccessInfo, setTestAccessInfo] = useState<{
    [key: string]: { canTake: boolean; reason: string }
  }>({})

  const toast = useToast()

  useEffect(() => {
    if (portalUser && user) {
      loadData()
    }
  }, [portalUser, user])

  const loadData = async () => {
    try {
      setLoading(true)
      setResultsLoading(true)

      if (user) {
        const [testsData, resultsData] = await Promise.all([
          getStudentAccessibleTests(user.uid),
          getStudentResults(user.uid),
        ])

        setAvailableTests(testsData)
        setTestResults(resultsData)

        // Check access for each test
        const accessInfo: {
          [key: string]: { canTake: boolean; reason: string }
        } = {}

        for (const test of testsData) {
          if (test.testId) {
            const attempts = await getStudentAttempts(user.uid, test.testId)
            accessInfo[test.testId] = canTakeTest(user.uid, test, attempts)
          }
        }

        setTestAccessInfo(accessInfo)
      }
    } catch (error) {
      console.error('Error loading data:', error)
      setError('Failed to load tests. Please try again.')
    } finally {
      setLoading(false)
      setResultsLoading(false)
    }
  }

  const handleAccessCode = async () => {
    if (!accessCode.trim() || !user) return

    setApplyingCode(true)
    try {
      const result = await validateAccessCode(accessCode, user.uid)

      toast({
        title: 'Success!',
        description: result.message,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      setAccessCode('')
      setEnteringCode(false)
      loadData()
    } catch (error: any) {
      toast({
        title: 'Error',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setApplyingCode(false)
    }
  }

  const getStats = () => {
    const totalTests = availableTests.length
    const completedTests = testResults.length
    const passedTests = testResults.filter((result) => result.passed).length

    return { totalTests, completedTests, passedTests }
  }

  const stats = getStats()

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading tests...</Text>
      </Box>
    )
  }

  return (
    <Box>
      <Tabs
        index={activeTab}
        onChange={setActiveTab}
        variant=""
        colorScheme="blue"
      >
        <TabList mb={6}>
          <Tab>
            <Box
              bg="white"
              p={4}
              borderRadius="lg"
              shadow="sm"
              minWidth={'50px'}
            >
              <Text fontSize="sm" color="gray.500">
                Available Tests
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="blue.600">
                {stats.totalTests}
              </Text>
            </Box>
          </Tab>
          <Tab>
            <Box
              bg="white"
              p={4}
              borderRadius="lg"
              shadow="sm"
              minWidth={'50px'}
            >
              <Text fontSize="sm" color="gray.500">
                Completed
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="green.600">
                {stats.completedTests}
              </Text>
            </Box>
          </Tab>
          <Tab>
            <Box
              bg="white"
              p={4}
              borderRadius="lg"
              shadow="sm"
              minWidth={'50px'}
            >
              <Text fontSize="sm" color="gray.500">
                Passed
              </Text>
              <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                {stats.passedTests}
              </Text>
            </Box>
          </Tab>
        </TabList>

        <TabPanels>
          {/* Available Tests Tab */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <HStack justify="space-between" wrap="wrap">
                <Text fontSize="2xl" fontWeight="bold">
                  Available Tests
                </Text>
                <Button
                  colorScheme="blue"
                  onClick={() => setEnteringCode(!enteringCode)}
                >
                  {enteringCode ? 'Cancel' : 'Enter Access Code'}
                </Button>
              </HStack>

              {enteringCode && (
                <Card>
                  <CardBody>
                    <VStack spacing={3}>
                      <Text fontWeight="bold">Enter Test Access Code</Text>
                      <InputGroup size="md">
                        <Input
                          placeholder="Enter 6-digit access code"
                          value={accessCode}
                          onChange={(e) =>
                            setAccessCode(e.target.value.toUpperCase())
                          }
                          maxLength={6}
                        />
                        <InputRightElement width="4.5rem">
                          <Button
                            h="1.75rem"
                            size="sm"
                            onClick={handleAccessCode}
                            isLoading={applyingCode}
                            isDisabled={accessCode.length !== 6}
                          >
                            Apply
                          </Button>
                        </InputRightElement>
                      </InputGroup>
                      <Text fontSize="sm" color="gray.600">
                        Enter the 6-digit code provided by your instructor
                      </Text>
                    </VStack>
                  </CardBody>
                </Card>
              )}

              {error && (
                <Alert status="error">
                  <AlertIcon />
                  {error}
                </Alert>
              )}

              {availableTests.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <Box>
                    <Text fontWeight="bold">No Tests Available</Text>
                    <Text>
                      You haven&apos;t accessed any tests yet. Use an access
                      code provided by your instructor to get started.
                    </Text>
                  </Box>
                </Alert>
              ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                  {availableTests.map((test) => {
                    const accessInfo = testAccessInfo[test.testId] || {
                      canTake: true,
                      reason: '',
                    }
                    const hasTaken = testStatus[test.testId]

                    return (
                      <Card
                        key={test.testId}
                        shadow="md"
                        _hover={{ shadow: 'lg' }}
                        transition="shadow 0.2s"
                      >
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold" fontSize="lg" noOfLines={2}>
                              {test.testName}
                            </Text>

                            {test.testDescription && (
                              <Text
                                color="gray.600"
                                fontSize="sm"
                                noOfLines={3}
                              >
                                {test.testDescription}
                              </Text>
                            )}

                            <VStack align="start" spacing={1} width="100%">
                              <HStack flexWrap={'wrap'}>
                                <Badge colorScheme="blue">
                                  {test.duration} mins
                                </Badge>
                                <Badge colorScheme="purple">
                                  {test.passingScore}% to pass
                                </Badge>
                                <Badge colorScheme="orange">
                                  {test.maxAttempts} max attempts
                                </Badge>
                              </HStack>

                              {/* Show test status */}
                              {hasTaken && (
                                <Badge colorScheme="green">
                                  Previously Taken
                                </Badge>
                              )}

                              {!accessInfo.canTake && (
                                <Badge colorScheme="red">
                                  Access Restricted
                                </Badge>
                              )}
                            </VStack>

                            {accessInfo.canTake ? (
                              <Button
                                as={Link}
                                href={`/portal/dashboard/tests/take/${test.testId}`}
                                colorScheme={
                                  accessInfo.canTake ? 'blue' : 'gray'
                                }
                                width="full"
                                isDisabled={!accessInfo.canTake}
                                title={accessInfo.reason}
                              >
                                {accessInfo.canTake
                                  ? hasTaken
                                    ? 'Retake Test'
                                    : 'Take Test'
                                  : 'Cannot Take Test'}
                              </Button>
                            ) : (
                              <Button
                                colorScheme={
                                  accessInfo.canTake ? 'blue' : 'gray'
                                }
                                width="full"
                                isDisabled={!accessInfo.canTake}
                                title={accessInfo.reason}
                              >
                                {accessInfo.canTake
                                  ? hasTaken
                                    ? 'Retake Test'
                                    : 'Take Test'
                                  : 'Cannot Take Test'}
                              </Button>
                            )}

                            {!accessInfo.canTake && accessInfo.reason && (
                              <Text
                                fontSize="sm"
                                color="red.500"
                                textAlign="center"
                                width="full"
                              >
                                {accessInfo.reason}
                              </Text>
                            )}
                          </VStack>
                        </CardBody>
                      </Card>
                    )
                  })}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>

          {/* Completed Tests Tab */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <Text fontSize="2xl" fontWeight="bold">
                Completed Tests
              </Text>

              {resultsLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={2}>Loading results...</Text>
                </Box>
              ) : testResults.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <Text>
                    You haven&apos;t completed any tests yet. Complete a test to
                    see your results here.
                  </Text>
                </Alert>
              ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                  {testResults.map((result) => (
                    <Card
                      key={`${result.studentId}_${result.testId}`}
                      shadow="md"
                    >
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <Text fontWeight="bold" fontSize="lg">
                            {result.testName}
                          </Text>

                          <VStack align="start" spacing={1} width="100%">
                            <HStack justify="space-between" width="100%">
                              <Text fontSize="sm" color="gray.600">
                                Best Score:
                              </Text>
                              <Badge
                                colorScheme={result.passed ? 'green' : 'red'}
                                fontSize="md"
                              >
                                {result.bestPercentage}%
                              </Badge>
                            </HStack>
                            <HStack justify="space-between" width="100%">
                              <Text fontSize="sm" color="gray.600">
                                Attempts:
                              </Text>
                              <Text fontWeight="medium">
                                {result.attemptsCount}
                              </Text>
                            </HStack>
                            <HStack justify="space-between" width="100%">
                              <Text fontSize="sm" color="gray.600">
                                Status:
                              </Text>
                              <Badge
                                colorScheme={result.passed ? 'green' : 'red'}
                                variant="subtle"
                              >
                                {result.passed ? 'Passed' : 'Failed'}
                              </Badge>
                            </HStack>
                            <HStack justify="space-between" width="100%">
                              <Text fontSize="sm" color="gray.600">
                                Last Attempt:
                              </Text>
                              <Text fontSize="sm" color="gray.500">
                                {result.lastAttemptDate?.toDate
                                  ? new Date(
                                      result.lastAttemptDate.toDate(),
                                    ).toLocaleDateString()
                                  : 'N/A'}
                              </Text>
                            </HStack>
                          </VStack>

                          <Button
                            as={Link}
                            href={`/portal/dashboard/tests/results/${result.testId}`}
                            colorScheme="blue"
                            variant="outline"
                            width="full"
                            size="sm"
                          >
                            View Details
                          </Button>
                        </VStack>
                      </CardBody>
                    </Card>
                  ))}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>

          {/* Passed Tests Tab */}
          <TabPanel p={0}>
            <VStack align="stretch" spacing={6}>
              <Text fontSize="2xl" fontWeight="bold">
                Passed Tests
              </Text>

              {resultsLoading ? (
                <Box textAlign="center" py={8}>
                  <Spinner size="lg" />
                  <Text mt={2}>Loading results...</Text>
                </Box>
              ) : testResults.filter((r) => r.passed).length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  <Text>
                    You haven&apos;t passed any tests yet. Keep practicing!
                  </Text>
                </Alert>
              ) : (
                <SimpleGrid columns={[1, 2, 3]} spacing={6}>
                  {testResults
                    .filter((result) => result.passed)
                    .map((result) => (
                      <Card
                        key={`${result.studentId}_${result.testId}`}
                        shadow="md"
                        border="2px"
                        borderColor="green.200"
                      >
                        <CardBody>
                          <VStack align="start" spacing={3}>
                            <Text fontWeight="bold" fontSize="lg">
                              {result.testName}
                            </Text>

                            <VStack align="start" spacing={1} width="100%">
                              <HStack justify="space-between" width="100%">
                                <Text fontSize="sm" color="gray.600">
                                  Score:
                                </Text>
                                <Badge colorScheme="green" fontSize="md">
                                  {result.bestPercentage}%
                                </Badge>
                              </HStack>
                              <HStack justify="space-between" width="100%">
                                <Text fontSize="sm" color="gray.600">
                                  Attempts:
                                </Text>
                                <Text fontWeight="medium">
                                  {result.attemptsCount}
                                </Text>
                              </HStack>
                              <HStack justify="space-between" width="100%">
                                <Text fontSize="sm" color="gray.600">
                                  Completed:
                                </Text>
                                <Text fontSize="sm" color="gray.500">
                                  {result.lastAttemptDate?.toDate
                                    ? new Date(
                                        result.lastAttemptDate.toDate(),
                                      ).toLocaleDateString()
                                    : 'N/A'}
                                </Text>
                              </HStack>
                            </VStack>

                            <Badge
                              colorScheme="green"
                              variant="solid"
                              width="full"
                              textAlign="center"
                              py={1}
                            >
                              🎉 Congratulations! 🎉
                            </Badge>
                          </VStack>
                        </CardBody>
                      </Card>
                    ))}
                </SimpleGrid>
              )}
            </VStack>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </Box>
  )
}
