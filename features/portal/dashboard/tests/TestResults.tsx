import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  HStack,
  Badge,
  Progress,
  SimpleGrid,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  AlertDescription,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  getTestById,
  getStudentAttempts,
  getTestQuestions,
  getStudentRemarks,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import {
  Test,
  TestAttempt,
  Question,
  StudentRemark,
} from '../../../../types/test'
import { FiArrowLeft, FiMessageSquare } from 'react-icons/fi'

interface TestResultsProps {
  testId: string
}

export const TestResults: React.FC<TestResultsProps> = ({ testId }) => {
  const { user } = usePortalAuth()
  const router = useRouter()
  const [test, setTest] = useState<Test | null>(null)
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
  const [remarks, setRemarks] = useState<StudentRemark[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')

  useEffect(() => {
    if (testId && user) {
      loadResults()
    }
  }, [testId, user])

  const loadResults = async () => {
    try {
      setLoading(true)
      const [testData, attemptsData, questionsData, remarksData] =
        await Promise.all([
          getTestById(testId),
          getStudentAttempts(user!.uid, testId),
          getTestQuestions(testId),
          getStudentRemarks(user!.uid, testId),
        ])

      if (!testData) {
        setError('Test not found')
        return
      }

      setTest(testData)
      setAttempts(attemptsData)
      setQuestions(questionsData)
      setRemarks(remarksData.filter((remark) => remark.isVisibleToStudent)) // Only show visible remarks
    } catch (error) {
      console.error('Error loading results:', error)
      setError('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  // Function to format remarks
  const formatRemarks = (remarks: StudentRemark[]) => {
    return (
      <Box display={'flex'} flexWrap={'wrap'} gap={5}>
        {remarks.map((remark) => (
          <Card key={remark.remarkId} variant="outline" mt={2}>
            <CardBody>
              <VStack align="start" spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  From {remark.addedByName} • {formatDate(remark.createdAt)}
                </Text>
                <Text>{remark.remark}</Text>
              </VStack>
            </CardBody>
          </Card>
        ))}
      </Box>
    )
  }

  const getLatestAttempt = () => {
    return attempts.length > 0 ? attempts[0] : null
  }
  // const getLatestAttempt = () => {
  //   return attempts.length > 0 ? attempts[attempts.length - 1] : null
  // }

  const getBestAttempt = () => {
    if (attempts.length === 0) return null
    return attempts.reduce((best, current) =>
      (current.percentage || 0) > (best.percentage || 0) ? current : best,
    )
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading results...</Text>
      </Box>
    )
  }

  if (error || !test) {
    return (
      <Box textAlign="center" py={10}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error || 'Test not found'}
        </Alert>
        <Button onClick={() => router.push('/portal/dashboard/tests')}>
          Back to Tests
        </Button>
      </Box>
    )
  }

  const getPerformanceLabel = (percentage: any) => {
    if (percentage >= 80) {
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
    if (percentage >= 80) return 'green'
    if (percentage >= 60) return 'blue'
    if (percentage >= 40) return 'orange'
    return 'red'
  }

  const latestAttempt = getLatestAttempt()
  const bestAttempt = getBestAttempt()
  const visibleRemarks = remarks.filter((remark) => remark.isVisibleToStudent)

  return (
    <Box maxW="6xl" mx="auto">
      <Box mb={3}>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="outline"
          size="sm"
          onClick={() => router.push('/portal/dashboard/tests')}
        >
          Back
        </Button>
      </Box>
      <VStack spacing={6} align="stretch">
        {/* Test Header */}
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <HStack justify="space-between" width="100%">
                <Text fontSize="2xl" fontWeight="bold">
                  {test.testName}
                </Text>
                {visibleRemarks.length > 0 && (
                  <Badge colorScheme="blue" variant="subtle" fontSize="md">
                    <HStack spacing={1}>
                      <FiMessageSquare />
                      <Text>{visibleRemarks.length} Remark(s)</Text>
                    </HStack>
                  </Badge>
                )}
              </HStack>

              {test.testDescription && (
                <Text color="gray.600">{test.testDescription}</Text>
              )}

              <SimpleGrid columns={[2, 3, 4]} spacing={6} width="100%">
                {attempts.length > 1 && (
                  <>
                    <StatCard
                      label="Total Attempts"
                      value={attempts.length.toString()}
                      color="blue"
                    />
                    <StatCard
                      label="Best Score"
                      value={`${bestAttempt?.percentage || 0}%`}
                      color="green"
                    />
                  </>
                )}
                {attempts.length === 1 && (
                  <StatCard
                    label="Your Points"
                    value={`${latestAttempt?.score}/${latestAttempt?.totalPoints}`}
                    color="purple"
                  />
                )}

                <StatCard
                  label="Your Score"
                  value={`${latestAttempt?.percentage || 0}%`}
                  color="purple"
                />
                <StatCard
                  label="Passing Score"
                  value={`${test.passingScore}%`}
                  color="green"
                />

                {bestAttempt && (
                  <Badge
                    colorScheme={getPerformanceColor(bestAttempt.percentage)}
                    fontSize="lg"
                    px={4}
                    py={2}
                    width={'fit-content'}
                    height={'fit-content'}
                  >
                    {/* {bestAttempt.passed ? 'PASSED' : 'NOT PASSED'} */}
                    {getPerformanceLabel(bestAttempt.percentage)}
                  </Badge>
                )}
              </SimpleGrid>
            </VStack>
          </CardBody>
        </Card>

        {/* Instructor Remarks Section */}
        {visibleRemarks.length > 0 && (
          <Card>
            <CardBody>
              <VStack align="start" spacing={4}>
                <HStack>
                  <FiMessageSquare />
                  <Text fontSize="xl" fontWeight="bold">
                    Instructor Remarks & Recommendations
                  </Text>
                </HStack>
                <Alert status="info" variant="subtle">
                  <AlertIcon />
                  <AlertDescription>
                    Your instructor has provided feedback and recommendations
                    for your performance.
                  </AlertDescription>
                </Alert>
                {formatRemarks(visibleRemarks)}
              </VStack>
            </CardBody>
          </Card>
        )}

        {/* Attempt History */}
        {attempts.length > 1 && (
          <Card>
            <CardBody>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Attempt History
              </Text>

              {attempts.length === 0 ? (
                <Alert status="info">
                  <AlertIcon />
                  No attempts found for this test.
                </Alert>
              ) : (
                <Table variant="simple">
                  <Thead>
                    <Tr>
                      <Th>Attempt Date</Th>
                      <Th>Score</Th>
                      <Th>Percentage</Th>
                      <Th>Time Spent</Th>
                      <Th>Status</Th>
                    </Tr>
                  </Thead>
                  <Tbody>
                    {attempts.map((attempt, index) => (
                      <Tr key={attempt.attemptId}>
                        <Td>
                          {attempt.submittedAt?.toDate
                            ? new Date(
                                attempt.submittedAt.toDate(),
                              ).toLocaleString()
                            : 'N/A'}
                        </Td>
                        <Td>
                          {attempt.score}/{attempt.totalPoints}
                        </Td>
                        <Td>
                          <Badge
                            colorScheme={
                              attempt.percentage &&
                              attempt.percentage >= test.passingScore
                                ? 'green'
                                : 'red'
                            }
                          >
                            {attempt.percentage}%
                          </Badge>
                        </Td>
                        <Td>
                          {attempt.timeSpent
                            ? `${Math.floor(attempt.timeSpent / 60)}m ${
                                attempt.timeSpent % 60
                              }s`
                            : 'N/A'}
                        </Td>
                        <Td>
                          <Badge colorScheme={attempt.passed ? 'green' : 'red'}>
                            {attempt.passed ? 'Passed' : 'Failed'}
                          </Badge>
                        </Td>
                      </Tr>
                    ))}
                  </Tbody>
                </Table>
              )}
            </CardBody>
          </Card>
        )}

        {/* Question Review */}
        {latestAttempt && questions.length > 0 && (
          <Card>
            <CardBody>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Question Review{' '}
                {attempts.length > 1 && <span>(Latest Attempt)</span>}
              </Text>
              <VStack spacing={4}>
                {questions.map((question, index) => {
                  const studentAnswer =
                    latestAttempt.answers[question.questionId]
                  const isCorrect = studentAnswer === question.correctAnswer

                  return (
                    <Card
                      key={question.questionId}
                      width="100%"
                      variant="outline"
                    >
                      <CardBody>
                        <VStack align="start" spacing={3}>
                          <HStack justify="space-between" width="100%">
                            <Text fontWeight="bold">Question {index + 1}</Text>
                            <Badge colorScheme={isCorrect ? 'green' : 'red'}>
                              {isCorrect ? 'Correct' : 'Incorrect'}
                            </Badge>
                          </HStack>

                          <Text>{question.questionText}</Text>

                          <VStack align="start" spacing={1}>
                            <Text fontSize="sm" color="gray.700">
                              Your answer: {studentAnswer || 'Not answered'}
                            </Text>
                            <Text
                              fontSize="md"
                              color="green.500"
                              fontWeight={'bold'}
                            >
                              Correct answer: {question.correctAnswer}
                            </Text>
                          </VStack>

                          <Text fontSize="sm" color="gray.500">
                            Points: {question.points}
                          </Text>
                        </VStack>
                      </CardBody>
                    </Card>
                  )
                })}
              </VStack>
            </CardBody>
          </Card>
        )}

        <Button
          onClick={() => router.push('/portal/dashboard/tests')}
          colorScheme="blue"
        >
          Back to Tests
        </Button>
      </VStack>
    </Box>
  )
}

const StatCard = ({ label, value, color }: any) => (
  <Box textAlign="center">
    <Text fontSize="sm" color="gray.600" mb={1}>
      {label}
    </Text>
    <Text fontSize="2xl" fontWeight="bold" color={`${color}.600`}>
      {value}
    </Text>
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
