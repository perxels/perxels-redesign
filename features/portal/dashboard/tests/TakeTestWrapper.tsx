import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  Text,
  Button,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  Spinner,
  useToast,
  Card,
  CardBody,
  InputGroup,
  Input,
  InputRightElement,
} from '@chakra-ui/react'
import {
  getTestById,
  getTestQuestions,
  hasStudentTakenTest,
  validateAccessCode,
  getStudentAttempts,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test } from '../../../../types/test'
import { TakeTestInterface } from './TakeTestInterface'
import { canTakeTest } from '../../../../lib/utils/test-validation'

interface TakeTestWrapperProps {
  testId: string
}

export const TakeTestWrapper: React.FC<TakeTestWrapperProps> = ({ testId }) => {
  const { portalUser, user } = usePortalAuth()
  const [test, setTest] = useState<Test | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [hasTakenTest, setHasTakenTest] = useState(false)
  const [accessGranted, setAccessGranted] = useState(false)
  const [accessCode, setAccessCode] = useState('')
  const [validatingCode, setValidatingCode] = useState(false)
  const toast = useToast()

  useEffect(() => {
    if (testId && user) {
      checkTestAccess()
    }
  }, [testId, user])

  const checkTestAccess = async () => {
    try {
      setLoading(true)
      setError('')

      if (user) {
        // Get test details and previous attempts
        const [testData, previousAttempts] = await Promise.all([
          getTestById(testId),
          getStudentAttempts(user.uid, testId),
        ])

        if (!testData) {
          setError('Test not found')
          return
        }

        if (!testData.isActive) {
          setError('This test is no longer available')
          return
        }

        setTest(testData)

        // Validate if student can take the test
        const accessCheck = canTakeTest(user.uid, testData, previousAttempts)

        if (!accessCheck.canTake) {
          setError(accessCheck.reason)
          return
        }

        // Check if student has access (is in participants array)
        if (testData.participants.includes(user.uid)) {
          setAccessGranted(true)
        } else {
          setError('You need an access code to take this test.')
        }
      }
    } catch (error) {
      console.error('Error checking test access:', error)
      setError('Failed to load test. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  const handleAccessCodeSubmit = async () => {
    if (!accessCode.trim() || !user || !test) return

    setValidatingCode(true)
    try {
      const result = await validateAccessCode(accessCode, user.uid)

      if (result.success && result.test.testId === testId) {
        toast({
          title: 'Access Granted!',
          description: 'You can now take the test.',
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
        setAccessGranted(true)
        setError('')
      }
    } catch (error: any) {
      toast({
        title: 'Invalid Access Code',
        description: error.message,
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setValidatingCode(false)
    }
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading test...</Text>
      </Box>
    )
  }

  if (hasTakenTest) {
    return (
      <Box textAlign="center" py={10}>
        <Alert status="info" mb={4} maxW="md" mx="auto">
          <AlertIcon />
          <AlertTitle>Test Already Completed</AlertTitle>
          <AlertDescription>
            You have already taken this test. You cannot retake it at this time.
          </AlertDescription>
        </Alert>
        <Button as="a" href="/portal/dashboard/tests" colorScheme="blue">
          Back to Tests
        </Button>
      </Box>
    )
  }

  if (error && !accessGranted) {
    return (
      <Box maxW="md" mx="auto" py={10}>
        <VStack spacing={6}>
          <Alert status="error">
            <AlertIcon />
            <Box>
              <AlertTitle>Access Required</AlertTitle>
              <AlertDescription>{error}</AlertDescription>
            </Box>
          </Alert>

          {/* This still allows retakes after Test has expired */}
          {/* {test && (
            <Card width="100%">
              <CardBody>
                <VStack spacing={4}>
                  <Text fontWeight="bold" fontSize="lg">
                    {test.testName}
                  </Text>
                  {test.testDescription && (
                    <Text color="gray.600" textAlign="center">
                      {test.testDescription}
                    </Text>
                  )}
                  <Text fontSize="sm" color="gray.500">
                    Duration: {test.duration} minutes
                  </Text>

                  <VStack spacing={3} width="100%">
                    <Text fontWeight="medium">Enter Access Code</Text>
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
                          onClick={handleAccessCodeSubmit}
                          isLoading={validatingCode}
                          isDisabled={accessCode.length !== 6}
                        >
                          Submit
                        </Button>
                      </InputRightElement>
                    </InputGroup>
                    <Text fontSize="sm" color="gray.600" textAlign="center">
                      Enter the access code provided by your instructor to
                      unlock this test.
                    </Text>
                  </VStack>
                </VStack>
              </CardBody>
            </Card>
          )} */}

          <Button as="a" href="/portal/dashboard/tests" colorScheme="blue">
            Back to Tests
          </Button>
        </VStack>
      </Box>
    )
  }

  if (!test) {
    return (
      <Box textAlign="center" py={10}>
        <Alert status="warning" mb={4} maxW="md" mx="auto">
          <AlertIcon />
          <AlertTitle>Test Not Found</AlertTitle>
          <AlertDescription>
            The test you&apos;re looking for doesn&apos;t exist or is no longer
            available.
          </AlertDescription>
        </Alert>
        <Button as="a" href="/portal/dashboard/tests" colorScheme="blue">
          Back to Tests
        </Button>
      </Box>
    )
  }

  if (accessGranted && test) {
    return <TakeTestInterface test={test} testId={testId} />
  }

  return (
    <Box textAlign="center" py={10}>
      <Alert status="warning" mb={4} maxW="md" mx="auto">
        <AlertIcon />
        <AlertTitle>Access Restricted</AlertTitle>
        <AlertDescription>
          You do not have permission to access this test.
        </AlertDescription>
      </Alert>
      <Button as="a" href="/portal/dashboard/tests" colorScheme="blue">
        Back to Tests
      </Button>
    </Box>
  )
}
