import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  NumberInput,
  NumberInputField,
  VStack,
  HStack,
  Box,
  IconButton,
  Text,
  Select,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  useToast,
} from '@chakra-ui/react'
import { MdAdd, MdDelete } from 'react-icons/md'
import { createTest } from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test } from '../../../../types/test'

interface CreateTestModalProps {
  isOpen: boolean
  onClose: () => void
  onTestCreated: () => void
}

export const CreateTestModal: React.FC<CreateTestModalProps> = ({
  isOpen,
  onClose,
  onTestCreated,
}) => {
  const { portalUser } = usePortalAuth()
  const toast = useToast() // Add toast for better feedback
  const [loading, setLoading] = useState(false)
  const [createdTest, setCreatedTest] = useState<Test | null>(null)
  const [testData, setTestData] = useState({
    testName: '',
    testDescription: '',
    duration: 30,
    maxAttempts: 1,
    passingScore: 70,
    isActive: true,
    status: 'active' as 'active' | 'inactive' | 'draft',
    allowRetakes: false,
  })

  const [questions, setQuestions] = useState([
    {
      questionText: '',
      options: ['', '', '', ''],
      correctAnswer: '',
      points: 1,
      order: 0,
    },
  ])

  const addQuestion = () => {
    setQuestions([
      ...questions,
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
        order: questions.length,
      },
    ])
  }

  const removeQuestion = (index: number) => {
    setQuestions(questions.filter((_, i) => i !== index))
  }

  const updateQuestion = (index: number, field: string, value: any) => {
    const updated = [...questions]
    updated[index] = { ...updated[index], [field]: value }
    setQuestions(updated)
  }

  const updateOption = (qIndex: number, oIndex: number, value: string) => {
    const updated = [...questions]
    updated[qIndex].options[oIndex] = value
    setQuestions(updated)
  }

  const handleSubmit = async () => {
    if (!portalUser) return

    if (!testData.testName.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter a test name',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (questions.length === 0) {
      toast({
        title: 'Error',
        description: 'Please add at least one question',
        status: 'error',
        duration: 3000,
      })
      return
    }

    for (let index = 0; index < questions.length; index++) {
      const question = questions[index]

      if (!question.questionText.trim()) {
        toast({
          title: 'Error',
          description: `Please enter text for question ${index + 1}`,
          status: 'error',
          duration: 3000,
        })
        return
      }

      if (question.options.some((opt) => !opt.trim())) {
        toast({
          title: 'Error',
          description: `Please fill all options for question ${index + 1}`,
          status: 'error',
          duration: 3000,
        })
        return
      }

      if (!question.correctAnswer) {
        toast({
          title: 'Error',
          description: `Please select a correct answer for question ${
            index + 1
          }`,
          status: 'error',
          duration: 3000,
        })
        return
      }
    }

    setLoading(true)
    try {
      const newTest = await createTest(
        {
          ...testData,
          createdBy: portalUser.uid,
        },
        questions,
      )
      setCreatedTest(newTest)
      onTestCreated()

      toast({
        title: 'Success',
        description: 'Test created successfully!',
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error creating test:', error)
      toast({
        title: 'Error',
        description: 'Failed to create test. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  const handleClose = () => {
    setCreatedTest(null)
    setTestData({
      testName: '',
      testDescription: '',
      duration: 30,
      maxAttempts: 1,
      passingScore: 70,
      isActive: true,
      status: 'active',
      allowRetakes: false,
    })
    setQuestions([
      {
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
        order: 0,
      },
    ])
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>
          {createdTest ? 'Test Created Successfully!' : 'Create New Test'}
        </ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          {createdTest ? (
            <Alert status="success" flexDirection="column" alignItems="center">
              <AlertIcon boxSize="40px" mr={0} />
              <AlertTitle mt={4} mb={1} fontSize="lg">
                Test Created!
              </AlertTitle>
              <AlertDescription maxWidth="sm" textAlign="center">
                <Text fontWeight="bold" fontSize="xl" mb={2}>
                  Access Code: {createdTest.accessCode}
                </Text>
                <Text mt={2}>
                  Share this access code with students to allow them to take the
                  test.
                </Text>
              </AlertDescription>
            </Alert>
          ) : (
            <VStack spacing={6}>
              <Box width="100%" p={4} borderWidth={1} borderRadius="md">
                <Text fontWeight="bold" mb={4}>
                  Test Information
                </Text>

                <FormControl isRequired mb={4}>
                  <FormLabel>Test Name</FormLabel>
                  <Input
                    value={testData.testName}
                    onChange={(e) =>
                      setTestData({ ...testData, testName: e.target.value })
                    }
                    placeholder="Enter test name"
                  />
                </FormControl>

                <FormControl mb={4}>
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    value={testData.testDescription}
                    onChange={(e) =>
                      setTestData({
                        ...testData,
                        testDescription: e.target.value,
                      })
                    }
                    placeholder="Enter test description"
                  />
                </FormControl>

                <HStack width="100%" spacing={4}>
                  <FormControl>
                    <FormLabel>Duration (minutes)</FormLabel>
                    <NumberInput
                      min={1}
                      value={testData.duration}
                      onChange={(valueString, valueNumber) =>
                        setTestData({
                          ...testData,
                          duration: valueNumber || 30,
                        })
                      }
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Passing Score (%)</FormLabel>
                    <NumberInput
                      min={1}
                      max={100}
                      value={testData.passingScore}
                      onChange={(valueString, valueNumber) =>
                        setTestData({
                          ...testData,
                          passingScore: valueNumber || 70,
                        })
                      }
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Max Attempts</FormLabel>
                    <NumberInput
                      min={1}
                      max={5}
                      value={testData.maxAttempts}
                      onChange={(valueString, valueNumber) =>
                        setTestData({
                          ...testData,
                          maxAttempts: valueNumber || 1,
                        })
                      }
                    >
                      <NumberInputField />
                    </NumberInput>
                  </FormControl>
                </HStack>

                <HStack width="100%" spacing={4} mt={4}>
                  <FormControl>
                    <FormLabel>Status</FormLabel>
                    <Select
                      value={testData.status}
                      onChange={(e) =>
                        setTestData({
                          ...testData,
                          status: e.target.value as any,
                        })
                      }
                    >
                      <option value="draft">Draft</option>
                      <option value="active">Active</option>
                      <option value="inactive">Inactive</option>
                    </Select>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Allow Retakes</FormLabel>
                    <Select
                      value={testData.allowRetakes ? 'yes' : 'no'}
                      onChange={(e) =>
                        setTestData({
                          ...testData,
                          allowRetakes: e.target.value === 'yes',
                        })
                      }
                    >
                      <option value="no">No</option>
                      <option value="yes">Yes</option>
                    </Select>
                  </FormControl>
                </HStack>
              </Box>

              <Box width="100%">
                <HStack justify="space-between" mb={4}>
                  <Text fontWeight="bold">Questions ({questions.length})</Text>
                  <Button leftIcon={<MdAdd />} size="sm" onClick={addQuestion}>
                    Add Question
                  </Button>
                </HStack>

                <VStack spacing={6}>
                  {questions.map((question, qIndex) => (
                    <Box
                      key={qIndex}
                      width="100%"
                      p={4}
                      borderWidth={1}
                      borderRadius="md"
                    >
                      <HStack justify="space-between" mb={4}>
                        <Text fontWeight="bold">Question {qIndex + 1}</Text>
                        {questions.length > 1 && (
                          <IconButton
                            aria-label="Delete question"
                            icon={<MdDelete />}
                            size="sm"
                            colorScheme="red"
                            onClick={() => removeQuestion(qIndex)}
                          />
                        )}
                      </HStack>

                      <FormControl isRequired mb={4}>
                        <FormLabel>Question Text</FormLabel>
                        <Input
                          value={question.questionText}
                          onChange={(e) =>
                            updateQuestion(
                              qIndex,
                              'questionText',
                              e.target.value,
                            )
                          }
                          placeholder="Enter your question here..."
                        />
                      </FormControl>

                      <VStack spacing={3} mb={4}>
                        <FormLabel>
                          Options (Select the correct answer)
                        </FormLabel>
                        {question.options.map((option, oIndex) => (
                          <HStack key={oIndex} width="100%">
                            <Input
                              value={option}
                              onChange={(e) =>
                                updateOption(qIndex, oIndex, e.target.value)
                              }
                              placeholder={`Option ${oIndex + 1}`}
                            />
                            <Button
                              size="sm"
                              colorScheme={
                                question.correctAnswer === option
                                  ? 'green'
                                  : 'gray'
                              }
                              onClick={() =>
                                updateQuestion(qIndex, 'correctAnswer', option)
                              }
                              flexShrink={0}
                              isDisabled={!option.trim()} // Disable if option is empty
                            >
                              {question.correctAnswer === option
                                ? 'Correct'
                                : 'Mark Correct'}
                            </Button>
                          </HStack>
                        ))}
                      </VStack>

                      <FormControl>
                        <FormLabel>Points</FormLabel>
                        <NumberInput
                          min={1}
                          max={100}
                          value={question.points}
                          onChange={(valueString, valueNumber) =>
                            updateQuestion(qIndex, 'points', valueNumber || 1)
                          }
                          clampValueOnBlur={false}
                        >
                          <NumberInputField />
                        </NumberInput>
                      </FormControl>
                    </Box>
                  ))}
                </VStack>
              </Box>
            </VStack>
          )}
        </ModalBody>

        <ModalFooter>
          {!createdTest && (
            <>
              <Button
                variant="ghost"
                mr={3}
                onClick={handleClose}
                isDisabled={loading}
              >
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleSubmit}
                isLoading={loading}
                loadingText="Creating Test..."
                isDisabled={!testData.testName.trim() || questions.length === 0}
              >
                Create Test
              </Button>
            </>
          )}
          {createdTest && (
            <Button colorScheme="blue" onClick={handleClose}>
              Close
            </Button>
          )}
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
