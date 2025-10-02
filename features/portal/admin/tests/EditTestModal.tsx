import React, { useState, useEffect } from 'react'
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
  Text,
  Select,
  useToast,
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
} from '@chakra-ui/react'
import {
  updateTest,
  getTestQuestions,
  updateQuestion,
  deleteQuestion,
  addQuestion,
} from '../../../../lib/firebase/tests'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Test, Question } from '../../../../types/test'

interface EditTestModalProps {
  isOpen: boolean
  onClose: () => void
  test: Test
  onTestUpdated: () => void
}

export const EditTestModal: React.FC<EditTestModalProps> = ({
  isOpen,
  onClose,
  test,
  onTestUpdated,
}) => {
  const { portalUser } = usePortalAuth()
  const [loading, setLoading] = useState(false)
  const [saving, setSaving] = useState(false)
  const [questions, setQuestions] = useState<Question[]>([])
  const [loadingQuestions, setLoadingQuestions] = useState(false)
  const [testData, setTestData] = useState({
    testName: test.testName,
    testDescription: test.testDescription || '',
    duration: test.duration,
    maxAttempts: test.maxAttempts,
    passingScore: test.passingScore,
    isActive: test.isActive,
    status: test.status,
    allowRetakes: test.allowRetakes || false,
  })
  const [newQuestion, setNewQuestion] = useState({
    questionText: '',
    options: ['', '', '', ''],
    correctAnswer: '',
    points: 1,
  })

  const toast = useToast()

  useEffect(() => {
    if (isOpen) {
      loadQuestions()
    }
  }, [isOpen])

  const loadQuestions = async () => {
    try {
      setLoadingQuestions(true)
      const questionsData = await getTestQuestions(test.testId)
      setQuestions(questionsData)
    } catch (error) {
      console.error('Error loading questions:', error)
      toast({
        title: 'Error',
        description: 'Failed to load questions',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoadingQuestions(false)
    }
  }

  const handleSave = async () => {
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

    setSaving(true)
    try {
      await updateTest(test.testId, {
        ...testData,
        updatedBy: portalUser.uid,
      })

      toast({
        title: 'Test Updated',
        description: 'Test information has been updated successfully',
        status: 'success',
        duration: 3000,
      })

      onTestUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating test:', error)
      toast({
        title: 'Error',
        description: 'Failed to update test',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSaving(false)
    }
  }

  const handleUpdateQuestion = async (
    questionId: string,
    updates: Partial<Question>,
  ) => {
    try {
      await updateQuestion(questionId, updates)
      toast({
        title: 'Question Updated',
        description: 'Question has been updated successfully',
        status: 'success',
        duration: 2000,
      })
      loadQuestions() // Reload questions to get updated data
    } catch (error) {
      console.error('Error updating question:', error)
      toast({
        title: 'Error',
        description: 'Failed to update question',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteQuestion = async (questionId: string) => {
    if (
      !confirm(
        'Are you sure you want to delete this question? This action cannot be undone.',
      )
    ) {
      return
    }

    try {
      await deleteQuestion(questionId)
      toast({
        title: 'Question Deleted',
        description: 'Question has been deleted successfully',
        status: 'success',
        duration: 2000,
      })
      loadQuestions() // Reload questions
    } catch (error) {
      console.error('Error deleting question:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete question',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleAddQuestion = async () => {
    if (!newQuestion.questionText.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter question text',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (newQuestion.options.some((opt) => !opt.trim())) {
      toast({
        title: 'Error',
        description: 'Please fill all options',
        status: 'error',
        duration: 3000,
      })
      return
    }

    if (!newQuestion.correctAnswer) {
      toast({
        title: 'Error',
        description: 'Please select a correct answer',
        status: 'error',
        duration: 3000,
      })
      return
    }

    try {
      await addQuestion(test.testId, {
        questionText: newQuestion.questionText,
        options: newQuestion.options,
        correctAnswer: newQuestion.correctAnswer,
        points: newQuestion.points,
        order: questions.length,
      })

      toast({
        title: 'Question Added',
        description: 'New question has been added successfully',
        status: 'success',
        duration: 2000,
      })

      // Reset new question form
      setNewQuestion({
        questionText: '',
        options: ['', '', '', ''],
        correctAnswer: '',
        points: 1,
      })

      loadQuestions() // Reload questions
    } catch (error) {
      console.error('Error adding question:', error)
      toast({
        title: 'Error',
        description: 'Failed to add question',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const updateNewQuestionOption = (index: number, value: string) => {
    const updatedOptions = [...newQuestion.options]
    updatedOptions[index] = value
    setNewQuestion({ ...newQuestion, options: updatedOptions })
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Test: {test.testName}</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Test Information */}
            <Box p={4} borderWidth={1} borderRadius="md">
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

              <HStack spacing={4} mb={4}>
                <FormControl>
                  <FormLabel>Duration (minutes)</FormLabel>
                  <NumberInput
                    min={1}
                    value={testData.duration}
                    onChange={(value) =>
                      setTestData({
                        ...testData,
                        duration: parseInt(value) || 30,
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
                    onChange={(value) =>
                      setTestData({
                        ...testData,
                        passingScore: parseInt(value) || 70,
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
                    onChange={(value) =>
                      setTestData({
                        ...testData,
                        maxAttempts: parseInt(value) || 1,
                      })
                    }
                  >
                    <NumberInputField />
                  </NumberInput>
                </FormControl>
              </HStack>

              <HStack spacing={4}>
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

                <FormControl>
                  <FormLabel>Active Status</FormLabel>
                  <Select
                    value={testData.isActive ? 'active' : 'inactive'}
                    onChange={(e) =>
                      setTestData({
                        ...testData,
                        isActive: e.target.value === 'active',
                      })
                    }
                  >
                    <option value="active">Active</option>
                    <option value="inactive">Inactive</option>
                  </Select>
                </FormControl>
              </HStack>

              <Alert status="info" mt={4} borderRadius="md">
                <AlertIcon />
                <Box>
                  <AlertTitle>Access Code</AlertTitle>
                  <AlertDescription>
                    The access code for this test is:{' '}
                    <Text as="span" fontFamily="mono" fontWeight="bold">
                      {test.accessCode}
                    </Text>
                  </AlertDescription>
                </Box>
              </Alert>
            </Box>

            {/* Existing Questions */}
            <Box>
              <Text fontWeight="bold" mb={4}>
                Existing Questions ({questions.length})
              </Text>

              {loadingQuestions ? (
                <Text>Loading questions...</Text>
              ) : questions.length === 0 ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  No questions found for this test.
                </Alert>
              ) : (
                <VStack spacing={4}>
                  {questions.map((question, index) => (
                    <QuestionEditor
                      key={question.questionId}
                      question={question}
                      index={index}
                      onUpdate={(updates) =>
                        handleUpdateQuestion(question.questionId, updates)
                      }
                      onDelete={() => handleDeleteQuestion(question.questionId)}
                    />
                  ))}
                </VStack>
              )}
            </Box>

            {/* Add New Question */}
            <Box p={4} borderWidth={1} borderRadius="md" borderStyle="dashed">
              <Text fontWeight="bold" mb={4}>
                Add New Question
              </Text>

              <FormControl isRequired mb={4}>
                <FormLabel>Question Text</FormLabel>
                <Input
                  value={newQuestion.questionText}
                  onChange={(e) =>
                    setNewQuestion({
                      ...newQuestion,
                      questionText: e.target.value,
                    })
                  }
                  placeholder="Enter your question here..."
                />
              </FormControl>

              <VStack spacing={3} mb={4}>
                <FormLabel>Options (Select the correct answer)</FormLabel>
                {newQuestion.options.map((option, index) => (
                  <HStack key={index} width="100%">
                    <Input
                      value={option}
                      onChange={(e) =>
                        updateNewQuestionOption(index, e.target.value)
                      }
                      placeholder={`Option ${index + 1}`}
                    />
                    <Button
                      size="sm"
                      colorScheme={
                        newQuestion.correctAnswer === option ? 'green' : 'gray'
                      }
                      onClick={() =>
                        setNewQuestion({
                          ...newQuestion,
                          correctAnswer: option,
                        })
                      }
                      flexShrink={0}
                    >
                      {newQuestion.correctAnswer === option
                        ? 'Correct'
                        : 'Mark Correct'}
                    </Button>
                  </HStack>
                ))}
              </VStack>

              <FormControl mb={4}>
                <FormLabel>Points</FormLabel>
                <NumberInput
                  min={1}
                  max={10}
                  value={newQuestion.points}
                  onChange={(value) =>
                    setNewQuestion({
                      ...newQuestion,
                      points: parseInt(value) || 1,
                    })
                  }
                >
                  <NumberInputField />
                </NumberInput>
              </FormControl>

              <Button
                colorScheme="blue"
                onClick={handleAddQuestion}
                isDisabled={
                  !newQuestion.questionText || !newQuestion.correctAnswer
                }
              >
                Add Question
              </Button>
            </Box>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose} isDisabled={saving}>
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleSave}
            isLoading={saving}
            loadingText="Saving..."
          >
            Save Changes
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}

// Helper component for editing individual questions
interface QuestionEditorProps {
  question: Question
  index: number
  onUpdate: (updates: Partial<Question>) => void
  onDelete: () => void
}

const QuestionEditor: React.FC<QuestionEditorProps> = ({
  question,
  index,
  onUpdate,
  onDelete,
}) => {
  const [editing, setEditing] = useState(false)
  const [editedQuestion, setEditedQuestion] = useState({
    questionText: question.questionText,
    options: [...question.options],
    correctAnswer: question.correctAnswer,
    points: question.points,
  })

  const handleSave = () => {
    onUpdate(editedQuestion)
    setEditing(false)
  }

  const handleCancel = () => {
    setEditedQuestion({
      questionText: question.questionText,
      options: [...question.options],
      correctAnswer: question.correctAnswer,
      points: question.points,
    })
    setEditing(false)
  }

  const updateOption = (optionIndex: number, value: string) => {
    const updatedOptions = [...editedQuestion.options]
    updatedOptions[optionIndex] = value
    setEditedQuestion({ ...editedQuestion, options: updatedOptions })
  }

  if (!editing) {
    return (
      <Box width="100%" p={4} borderWidth={1} borderRadius="md">
        <HStack justify="space-between" mb={2}>
          <Text fontWeight="bold">Question {index + 1}</Text>
          <HStack>
            <Button size="sm" onClick={() => setEditing(true)}>
              Edit
            </Button>
            <Button
              size="sm"
              colorScheme="red"
              variant="outline"
              onClick={onDelete}
            >
              Delete
            </Button>
          </HStack>
        </HStack>
        <Text mb={2}>{question.questionText}</Text>
        <VStack align="start" spacing={1}>
          {question.options.map((option, optIndex) => (
            <HStack key={optIndex}>
              <Text
                fontSize="sm"
                color={
                  option === question.correctAnswer ? 'green.600' : 'gray.600'
                }
              >
                {optIndex + 1}. {option}
                {option === question.correctAnswer && ' ✓'}
              </Text>
            </HStack>
          ))}
        </VStack>
        <Text fontSize="sm" color="gray.500" mt={2}>
          Points: {question.points}
        </Text>
      </Box>
    )
  }

  return (
    <Box
      width="100%"
      p={4}
      borderWidth={2}
      borderRadius="md"
      borderColor="blue.200"
    >
      <HStack justify="space-between" mb={4}>
        <Text fontWeight="bold">Editing Question {index + 1}</Text>
        <HStack>
          <Button size="sm" colorScheme="blue" onClick={handleSave}>
            Save
          </Button>
          <Button size="sm" variant="outline" onClick={handleCancel}>
            Cancel
          </Button>
        </HStack>
      </HStack>

      <FormControl isRequired mb={4}>
        <FormLabel>Question Text</FormLabel>
        <Input
          value={editedQuestion.questionText}
          onChange={(e) =>
            setEditedQuestion({
              ...editedQuestion,
              questionText: e.target.value,
            })
          }
        />
      </FormControl>

      <VStack spacing={3} mb={4}>
        <FormLabel>Options (Select the correct answer)</FormLabel>
        {editedQuestion.options.map((option, optIndex) => (
          <HStack key={optIndex} width="100%">
            <Input
              value={option}
              onChange={(e) => updateOption(optIndex, e.target.value)}
            />
            <Button
              size="sm"
              colorScheme={
                editedQuestion.correctAnswer === option ? 'green' : 'gray'
              }
              onClick={() =>
                setEditedQuestion({ ...editedQuestion, correctAnswer: option })
              }
            >
              {editedQuestion.correctAnswer === option
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
          max={10}
          value={editedQuestion.points}
          onChange={(value) =>
            setEditedQuestion({
              ...editedQuestion,
              points: parseInt(value) || 1,
            })
          }
        >
          <NumberInputField />
        </NumberInput>
      </FormControl>
    </Box>
  )
}
