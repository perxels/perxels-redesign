import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Card,
  CardBody,
  Button,
  HStack,
  Radio,
  RadioGroup,
  Progress,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  useDisclosure,
  SimpleGrid,
  Badge,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import {
  getTestQuestions,
  submitTestAttempt,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test, Question, TestAttempt } from '../../../../types/test'

interface TakeTestInterfaceProps {
  test: Test
  testId: string
}

export const TakeTestInterface: React.FC<TakeTestInterfaceProps> = ({
  test,
  testId,
}) => {
  const { user } = usePortalAuth()
  const router = useRouter()
  const [questions, setQuestions] = useState<Question[]>([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [error, setError] = useState('')

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure()

  useEffect(() => {
    loadQuestions()

    // Initialize timer
    if (test.duration) {
      setTimeLeft(test.duration * 60) // Convert minutes to seconds
    }
  }, [test])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || submitting) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit()
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitting])

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true)
      const questionsData = await getTestQuestions(testId)
      setQuestions(questionsData)

      // Initialize empty answers
      const initialAnswers: Record<string, string> = {}
      questionsData.forEach((q) => {
        initialAnswers[q.questionId] = ''
      })
      setAnswers(initialAnswers)
    } catch (error) {
      console.error('Error loading questions:', error)
      setError('Failed to load questions. Please try again.')
    } finally {
      setLoadingQuestions(false)
    }
  }

  const formatTime = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = seconds % 60
    return `${mins.toString().padStart(2, '0')}:${secs
      .toString()
      .padStart(2, '0')}`
  }

  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  const handleNext = () => {
    if (currentQuestion < questions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleAutoSubmit = async () => {
    if (!user || submitting) return
    await submitTest(true)
  }

  const handleSubmit = async () => {
    if (!user) return

    // Check if all questions are answered
    const unanswered = questions.filter((q) => !answers[q.questionId])
    if (unanswered.length > 0) {
      onOpen()
      return
    }

    await submitTest(false)
  }

  const submitTest = async (isAutoSubmit = false) => {
    if (!user || !questions.length || submitting) return

    try {
      setSubmitting(true)
      setError('')

      // Calculate score
      let score = 0
      let totalPoints = 0

      questions.forEach((question) => {
        totalPoints += question.points
        if (answers[question.questionId] === question.correctAnswer) {
          score += question.points
        }
      })

      const percentage = Math.round((score / totalPoints) * 100)
      const passed = percentage >= test.passingScore

      const attempt: Omit<TestAttempt, 'attemptId'> = {
        studentId: user.uid,
        testId: test.testId,
        accessCodeUsed: test.accessCode,
        startedAt: new Date(),
        submittedAt: new Date(),
        answers,
        score,
        totalPoints,
        percentage,
        status: 'graded',
        timeSpent: test.duration * 60 - timeLeft,
        passed,
        passingScore: test.passingScore,
      }

      await submitTestAttempt(attempt)

      if (!isAutoSubmit) {
        onSuccessOpen()
      } else {
        // For auto-submit, redirect immediately
        router.push('/portal/dashboard/tests?submitted=true')
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      setError('Failed to submit test. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  if (loadingQuestions) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading questions...</Text>
      </Box>
    )
  }

  if (questions.length === 0 && !error) {
    return (
      <Box textAlign="center" py={10}>
        <Text>No questions found for this test.</Text>
      </Box>
    )
  }

  if (error) {
    return (
      <Box textAlign="center" py={10}>
        <Alert status="error" mb={4}>
          <AlertIcon />
          {error}
        </Alert>
        <Button onClick={() => router.push('/portal/dashboard/tests')}>
          Back to Tests
        </Button>
      </Box>
    )
  }

  const currentQ = questions[currentQuestion]
  const progress = ((currentQuestion + 1) / questions.length) * 100
  const answeredCount = Object.values(answers).filter((a) => a !== '').length

  return (
    <Box maxW="4xl" mx="auto">
      {/* Test Header */}
      <Card mb={6}>
        <CardBody>
          <VStack align="stretch" spacing={4}>
            <HStack justify="space-between" wrap="wrap">
              <VStack align="start" spacing={1}>
                <Text fontSize="2xl" fontWeight="bold">
                  {test.testName}
                </Text>
                {test.testDescription && (
                  <Text color="gray.600">{test.testDescription}</Text>
                )}
              </VStack>

              <VStack align="end" spacing={1}>
                <Badge
                  colorScheme={timeLeft < 300 ? 'red' : 'green'}
                  fontSize="lg"
                >
                  Time: {formatTime(timeLeft)}
                </Badge>
                <Text fontSize="sm" color="gray.600">
                  {answeredCount}/{questions.length} questions answered
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Passing: {test.passingScore}%
                </Text>
              </VStack>
            </HStack>

            <Progress value={progress} colorScheme="blue" size="lg" />
            <Text fontSize="sm" textAlign="center">
              Question {currentQuestion + 1} of {questions.length}
            </Text>
          </VStack>
        </CardBody>
      </Card>

      {/* Question Card */}
      <Card mb={6}>
        <CardBody>
          <VStack align="stretch" spacing={6}>
            <Text fontSize="xl" fontWeight="bold">
              {currentQ.questionText}
            </Text>

            <RadioGroup
              value={answers[currentQ.questionId] || ''}
              onChange={(value) =>
                handleAnswerChange(currentQ.questionId, value)
              }
            >
              <SimpleGrid columns={[1, 2]} spacing={4}>
                {currentQ.options.map((option, index) => (
                  <Radio key={index} value={option} size="lg">
                    <Text fontSize="lg">{option}</Text>
                  </Radio>
                ))}
              </SimpleGrid>
            </RadioGroup>

            {/* Navigation */}
            <HStack justify="space-between" pt={4}>
              <Button
                onClick={handlePrevious}
                isDisabled={currentQuestion === 0}
                colorScheme="gray"
              >
                Previous
              </Button>

              <HStack>
                {currentQuestion < questions.length - 1 ? (
                  <Button onClick={handleNext} colorScheme="blue">
                    Next Question
                  </Button>
                ) : null}

                <Button
                  onClick={handleSubmit}
                  colorScheme="green"
                  isLoading={submitting}
                  loadingText="Submitting..."
                >
                  Submit Test
                </Button>
              </HStack>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Question Navigation Grid */}
      <Card>
        <CardBody>
          <Text fontWeight="bold" mb={4}>
            Question Navigation
          </Text>
          <SimpleGrid columns={[5, 8, 10]} spacing={2}>
            {questions.map((question, index) => (
              <Button
                key={question.questionId}
                size="sm"
                colorScheme={
                  answers[question.questionId]
                    ? 'blue'
                    : currentQuestion === index
                    ? 'green'
                    : 'gray'
                }
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </Button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Unanswered Questions Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Unanswered Questions</ModalHeader>
          <ModalBody>
            <Text>
              You have unanswered questions. Are you sure you want to submit?
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              You can still go back and answer them before submitting.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onClose}>
              Go Back
            </Button>
            <Button
              colorScheme="green"
              onClick={async () => {
                onClose()
                await submitTest(false)
              }}
              isLoading={submitting}
            >
              Submit Anyway
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Success Modal */}
      <Modal isOpen={isSuccessOpen} onClose={onSuccessClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="green.500">
            Test Submitted Successfully!
          </ModalHeader>
          <ModalBody>
            <Text>Your test has been submitted successfully.</Text>
            <Text mt={2}>You can view your results in the tests section.</Text>
          </ModalBody>
          <ModalFooter>
            <Button
              colorScheme="blue"
              onClick={() => router.push('/portal/dashboard/tests')}
            >
              View Results
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
