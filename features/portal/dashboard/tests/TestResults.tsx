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
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  getTestById,
  getStudentAttempts,
  getTestQuestions,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test, TestAttempt, Question } from '../../../../types/test'

interface TestResultsProps {
  testId: string
}

export const TestResults: React.FC<TestResultsProps> = ({ testId }) => {
  const { user } = usePortalAuth()
  const router = useRouter()
  const [test, setTest] = useState<Test | null>(null)
  const [attempts, setAttempts] = useState<TestAttempt[]>([])
  const [questions, setQuestions] = useState<Question[]>([])
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
      const [testData, attemptsData, questionsData] = await Promise.all([
        getTestById(testId),
        getStudentAttempts(user!.uid, testId),
        getTestQuestions(testId),
      ])

      if (!testData) {
        setError('Test not found')
        return
      }

      setTest(testData)
      setAttempts(attemptsData)
      setQuestions(questionsData)
    } catch (error) {
      console.error('Error loading results:', error)
      setError('Failed to load test results')
    } finally {
      setLoading(false)
    }
  }

  const getLatestAttempt = () => {
    return attempts.length > 0 ? attempts[attempts.length - 1] : null
  }

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

  const latestAttempt = getLatestAttempt()
  const bestAttempt = getBestAttempt()

  return (
    <Box maxW="6xl" mx="auto">
      <VStack spacing={6} align="stretch">
        {/* Test Header */}
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Text fontSize="2xl" fontWeight="bold">
                {test.testName}
              </Text>
              {test.testDescription && (
                <Text color="gray.600">{test.testDescription}</Text>
              )}

              <SimpleGrid columns={[2, 3, 4]} spacing={6} width="100%">
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
                <StatCard
                  label="Latest Score"
                  value={`${latestAttempt?.percentage || 0}%`}
                  color="purple"
                />
                <StatCard
                  label="Passing Score"
                  value={`${test.passingScore}%`}
                  color="orange"
                />
              </SimpleGrid>

              {bestAttempt && (
                <Badge
                  colorScheme={bestAttempt.passed ? 'green' : 'red'}
                  fontSize="lg"
                  px={3}
                  py={1}
                >
                  {bestAttempt.passed ? 'PASSED' : 'NOT PASSED'}
                </Badge>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Attempt History */}
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

        {/* Question Review */}
        {latestAttempt && questions.length > 0 && (
          <Card>
            <CardBody>
              <Text fontSize="xl" fontWeight="bold" mb={4}>
                Question Review (Latest Attempt)
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
                            <Text fontSize="sm" color="gray.600">
                              Your answer: {studentAnswer || 'Not answered'}
                            </Text>
                            <Text fontSize="sm" color="gray.600">
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
