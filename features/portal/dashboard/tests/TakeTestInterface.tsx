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

// Fisher-Yates shuffle algorithm
const shuffleArray = <T,>(array: T[]): T[] => {
  const shuffled = [...array]
  for (let i = shuffled.length - 1; i > 0; i--) {
    const j = Math.floor(Math.random() * (i + 1))
    ;[shuffled[i], shuffled[j]] = [shuffled[j], shuffled[i]]
  }
  return shuffled
}

// Extended Question type to handle shuffled options
interface ShuffledQuestion extends Question {
  originalOptions?: string[]
  optionMap?: { [original: string]: string } // Maps original option to shuffled option
}

export const TakeTestInterface: React.FC<TakeTestInterfaceProps> = ({
  test,
  testId,
}) => {
  const { user } = usePortalAuth()
  const router = useRouter()
  const [originalQuestions, setOriginalQuestions] = useState<Question[]>([])
  const [shuffledQuestions, setShuffledQuestions] = useState<
    ShuffledQuestion[]
  >([])
  const [answers, setAnswers] = useState<Record<string, string>>({})
  const [currentQuestion, setCurrentQuestion] = useState(0)
  const [timeLeft, setTimeLeft] = useState(0)
  const [submitting, setSubmitting] = useState(false)
  const [loadingQuestions, setLoadingQuestions] = useState(true)
  const [error, setError] = useState('')
  // Tab switching monitoring
  const [tabSwitchCount, setTabSwitchCount] = useState(0)
  const [isWindowFocused, setIsWindowFocused] = useState(true)

  const { isOpen, onOpen, onClose } = useDisclosure()
  const {
    isOpen: isSuccessOpen,
    onOpen: onSuccessOpen,
    onClose: onSuccessClose,
  } = useDisclosure()
  // Tab switch warning modal
  const {
    isOpen: isTabWarningOpen,
    onOpen: onTabWarningOpen,
    onClose: onTabWarningClose,
  } = useDisclosure()

  useEffect(() => {
    loadQuestions()

    // Initialize timer
    if (test.duration) {
      setTimeLeft(test.duration * 60) // Convert minutes to seconds
    }
  }, [test, testId])

  // Answer handling with shuffled options
  const handleAnswerChange = (questionId: string, value: string) => {
    setAnswers((prev) => ({
      ...prev,
      [questionId]: value,
    }))
  }

  // Scoring with shuffled options
  const submitTest = async (isAutoSubmit = false, autoSubmitMessage = '') => {
    if (!user || !shuffledQuestions.length || submitting) return

    try {
      setSubmitting(true)
      setError('')

      let score = 0
      let totalPoints = 0

      shuffledQuestions.forEach((question) => {
        totalPoints += question.points

        const studentAnswer = answers[question.questionId]

        // Handle shuffled options
        let isCorrect = false
        if (test.shuffleOptions && question.optionMap) {
          // For shuffled options, map the student's answer back to original
          const originalStudentAnswer =
            question.optionMap[studentAnswer] || studentAnswer
          isCorrect = originalStudentAnswer === question.correctAnswer
        } else {
          // For non-shuffled options, compare directly
          isCorrect = studentAnswer === question.correctAnswer
        }

        if (isCorrect) {
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
        tabSwitchCount,
        wasAutoSubmitted: isAutoSubmit,
        autoSubmitReason: autoSubmitMessage,
        wasShuffled: test.shuffleQuestions || test.shuffleOptions,
      }

      await submitTestAttempt(attempt)

      if (!isAutoSubmit) {
        onSuccessOpen()
      } else {
        router.push(
          `/portal/dashboard/tests?submitted=true&message=${encodeURIComponent(
            autoSubmitMessage,
          )}`,
        )
      }
    } catch (error) {
      console.error('Error submitting test:', error)
      setError('Failed to submit test. Please try again.')
    } finally {
      setSubmitting(false)
    }
  }

  // Tab visibility monitoring
  useEffect(() => {
    const handleVisibilityChange = () => {
      if (document.hidden) {
        // Tab/window lost focus
        setIsWindowFocused(false)
        if (test.maxTabSwitches && test.maxTabSwitches > 0) {
          const newCount = tabSwitchCount + 1
          setTabSwitchCount(newCount)

          if (newCount >= test.maxTabSwitches) {
            // Auto-submit on max tab switches reached
            handleAutoSubmit('tab_switch_limit')
          } else {
            // Show warning
            onTabWarningOpen()
          }
        }
      } else {
        // Tab/window gained focus
        setIsWindowFocused(true)
      }
    }

    const handleBlur = () => {
      setIsWindowFocused(false)
    }

    const handleFocus = () => {
      setIsWindowFocused(true)
    }

    // Listen to visibility change and focus events
    document.addEventListener('visibilitychange', handleVisibilityChange)
    window.addEventListener('blur', handleBlur)
    window.addEventListener('focus', handleFocus)

    //  Clean ups
    return () => {
      document.removeEventListener('visibilitychange', handleVisibilityChange)
      window.removeEventListener('blur', handleBlur)
      window.removeEventListener('focus', handleFocus)
    }
  }, [tabSwitchCount, test.maxTabSwitches])

  // Timer effect
  useEffect(() => {
    if (timeLeft <= 0 || submitting) return

    const timer = setInterval(() => {
      setTimeLeft((prev) => {
        if (prev <= 1) {
          clearInterval(timer)
          handleAutoSubmit('time_up')
          return 0
        }
        return prev - 1
      })
    }, 1000)

    return () => clearInterval(timer)
  }, [timeLeft, submitting])

  // Improved question loading and shuffling
  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true)
      const questionsData = await getTestQuestions(testId)
      setOriginalQuestions(questionsData)

      let processedQuestions: ShuffledQuestion[] = [...questionsData]

      // Apply question shuffling
      if (test.shuffleQuestions) {
        processedQuestions = shuffleArray(processedQuestions)
      }

      // Apply option shuffling and create mapping
      if (test.shuffleOptions) {
        processedQuestions = processedQuestions.map((question) => {
          const shuffledOptions = shuffleArray([...question.options])

          // Create a mapping from shuffled options back to original options
          const optionMap: { [shuffled: string]: string } = {}
          question.options.forEach((originalOption, index) => {
            optionMap[shuffledOptions[index]] = originalOption
          })

          return {
            ...question,
            options: shuffledOptions,
            originalOptions: question.options, // Store original order
            optionMap, // Store mapping for answer validation
          }
        })
      }

      setShuffledQuestions(processedQuestions)

      // Initialize empty answers
      const initialAnswers: Record<string, string> = {}
      processedQuestions.forEach((q) => {
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

  const handleNext = () => {
    if (currentQuestion < shuffledQuestions.length - 1) {
      setCurrentQuestion((prev) => prev + 1)
    }
  }

  const handlePrevious = () => {
    if (currentQuestion > 0) {
      setCurrentQuestion((prev) => prev - 1)
    }
  }

  const handleAutoSubmit = async (reason: 'time_up' | 'tab_switch_limit') => {
    if (!user || submitting) return

    let message = ''
    if (reason === 'time_up') {
      message = 'Time is up! Your test has been automatically submitted.'
    } else if (reason === 'tab_switch_limit') {
      message = 'Test submitted automatically due to excessive tab switching.'
    }

    await submitTest(true, message) // Changed to true for auto-submit
  }

  // Check if all questions are answered
  const unanswered = shuffledQuestions.filter((q) => !answers[q.questionId])
  const handleSubmit = async () => {
    if (!user) return
    onOpen()

    // await submitTest(false)
  }

  if (loadingQuestions) {
    return (
      <Box textAlign="center" py={10}>
        <Text>Loading questions...</Text>
      </Box>
    )
  }

  if (shuffledQuestions.length === 0 && !error) {
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

  const currentQ = shuffledQuestions[currentQuestion]
  const progress = ((currentQuestion + 1) / shuffledQuestions.length) * 100
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

                {/* Shuffle status */}
                {(test.shuffleQuestions || test.shuffleOptions) && (
                  <Badge colorScheme="purple" variant="subtle">
                    {test.shuffleQuestions && 'Questions Shuffled'}
                    {test.shuffleQuestions && test.shuffleOptions && ' • '}
                    {test.shuffleOptions && 'Options Shuffled'}
                  </Badge>
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
                  {answeredCount}/{shuffledQuestions.length} questions answered
                </Text>
                <Text fontSize="sm" color="gray.600">
                  Passing: {test.passingScore}%
                </Text>
                {/*Tab switch counter */}
                {test.maxTabSwitches && test.maxTabSwitches > 0 && (
                  <Badge
                    colorScheme={
                      tabSwitchCount >= test.maxTabSwitches
                        ? 'red'
                        : tabSwitchCount > 0
                        ? 'orange'
                        : 'green'
                    }
                    variant="subtle"
                  >
                    Tab Switches: {tabSwitchCount}/{test.maxTabSwitches}
                  </Badge>
                )}

                {/*  Window focus indicator */}
                {!isWindowFocused && (
                  <Badge colorScheme="red" variant="solid">
                    ⚠️ Return to Test
                  </Badge>
                )}
              </VStack>
            </HStack>

            {/* Security warnings */}
            {test.maxTabSwitches &&
              test.maxTabSwitches > 0 &&
              tabSwitchCount > 0 && (
                <Alert
                  status={
                    tabSwitchCount >= test.maxTabSwitches ? 'error' : 'warning'
                  }
                  size="sm"
                >
                  <AlertIcon />
                  <Box>
                    <Text fontSize="sm" fontWeight="medium">
                      {tabSwitchCount >= test.maxTabSwitches
                        ? 'Maximum tab switches reached!'
                        : `Warning: ${tabSwitchCount}/${test.maxTabSwitches} tab switches`}
                    </Text>
                    <Text fontSize="xs">
                      {tabSwitchCount >= test.maxTabSwitches
                        ? 'Test will be submitted automatically.'
                        : 'Leaving this tab may result in automatic submission.'}
                    </Text>
                  </Box>
                </Alert>
              )}

            <Progress value={progress} colorScheme="blue" size="lg" />
            <Text fontSize="sm" textAlign="center">
              Question {currentQuestion + 1} of {shuffledQuestions.length}
              {test.shuffleQuestions && ' • Questions are shuffled'}
              {test.shuffleOptions && ' • Options are shuffled'}
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
                {currentQuestion < shuffledQuestions.length - 1 ? (
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
            {shuffledQuestions.map((question, index) => (
              <button
                type="button"
                className={`btnQuest ${
                  currentQuestion === index && answers[question.questionId]
                    ? 'btnQuestsolidB'
                    : currentQuestion === index && !answers[question.questionId]
                    ? 'btnQuestsolidG'
                    : !(currentQuestion === index) &&
                      answers[question.questionId]
                    ? 'btnQuestOutlineB'
                    : 'btnQuestOutlineG'
                }`}
                key={question.questionId}
                onClick={() => setCurrentQuestion(index)}
              >
                {index + 1}
              </button>
            ))}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Unanswered Questions Modal */}
      <Modal isOpen={isOpen} onClose={onClose}>
        <ModalOverlay />
        <ModalContent>
          {unanswered.length > 0 ? (
            <>
              <ModalHeader>Unanswered Questions</ModalHeader>
              <ModalBody>
                <Text>
                  You have unanswered questions. Are you sure you want to
                  submit?
                </Text>
                <Text mt={2} fontSize="sm" color="gray.600">
                  You can still go back and answer them before submitting.
                </Text>
              </ModalBody>
            </>
          ) : (
            <>
              <ModalHeader>All Questions Answered</ModalHeader>
              <ModalBody>
                <Text>Are you sure you want to submit?</Text>
                <Text mt={2} fontSize="sm" color="gray.600">
                  You can still go back and review your answers before
                  submitting.
                </Text>
              </ModalBody>
            </>
          )}

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

      {/* Tab Switch Warning Modal */}
      <Modal isOpen={isTabWarningOpen} onClose={onTabWarningClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader color="orange.500">
            ⚠️ Warning: Tab Switch Detected
          </ModalHeader>
          <ModalBody>
            <Text>
              You have switched tabs/windows {tabSwitchCount} time(s).
            </Text>
            <Text mt={2} fontWeight="medium">
              Maximum allowed: {test.maxTabSwitches}
            </Text>
            <Text mt={2} fontSize="sm" color="gray.600">
              Continuing to leave this tab may result in automatic Test/Exam
              submission.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button colorScheme="orange" onClick={onTabWarningClose}>
              I Understand
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
              onClick={() =>
                router.push(`/portal/dashboard/tests/results/${testId}`)
              }
            >
              View Results
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
