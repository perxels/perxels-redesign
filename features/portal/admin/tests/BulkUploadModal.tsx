import React, { useState, useRef } from 'react'
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
  Alert,
  AlertIcon,
  Box,
  Progress,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  Card,
  CardBody,
  useToast,
  Input,
} from '@chakra-ui/react'
import { FiUpload, FiFile, FiCheck, FiX, FiDownload } from 'react-icons/fi'
import * as XLSX from 'xlsx'
import {
  BulkQuestionParser,
  BulkQuestion,
  ParsingResult,
} from '../../../../lib/utils/bulk-upload-parser'
import { generateQuestionTemplate } from '../../../../lib/utils/excel-template-generator'

interface BulkUploadModalProps {
  isOpen: boolean
  onClose: () => void
  onQuestionsUploaded: (questions: BulkQuestion[]) => void
}

export const BulkUploadModal: React.FC<BulkUploadModalProps> = ({
  isOpen,
  onClose,
  onQuestionsUploaded,
}) => {
  const [parsingResult, setParsingResult] = useState<ParsingResult | null>(null)
  const [uploading, setUploading] = useState(false)
  const [fileName, setFileName] = useState<string>('')
  const fileInputRef = useRef<HTMLInputElement>(null)
  const toast = useToast()

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    setFileName(file.name)
    setParsingResult(null)

    // Validate file type
    const validTypes = [
      'application/vnd.ms-excel',
      'application/vnd.openxmlformats-officedocument.spreadsheetml.sheet',
      'text/csv',
    ]

    if (
      !validTypes.includes(file.type) &&
      !file.name.match(/\.(xlsx|xls|csv)$/)
    ) {
      toast({
        title: 'Invalid file type',
        description: 'Please upload an Excel file (.xlsx, .xls) or CSV',
        status: 'error',
        duration: 5000,
      })
      return
    }

    parseExcelFile(file)
  }

  const parseExcelFile = (file: File) => {
    const reader = new FileReader()

    reader.onload = (e) => {
      try {
        const data = new Uint8Array(e.target?.result as ArrayBuffer)
        const workbook = XLSX.read(data, { type: 'array' })

        // Get first sheet
        const firstSheetName = workbook.SheetNames[0]
        const worksheet = workbook.Sheets[firstSheetName]

        // Convert to JSON
        const jsonData = XLSX.utils.sheet_to_json(worksheet, { header: 1 })

        // Parse questions
        // const result = BulkQuestionParser.parseExcelData(jsonData)
        const result = BulkQuestionParser.parseExcelData(jsonData as any[][])
        setParsingResult(result)

        // Show validation results
        if (result.errors.length > 0) {
          toast({
            title: 'Validation Issues',
            description: `Found ${result.errors.length} errors in your file`,
            status: 'warning',
            duration: 5000,
          })
        } else {
          toast({
            title: 'File Parsed Successfully',
            description: `Found ${result.questions.length} valid questions`,
            status: 'success',
            duration: 3000,
          })
        }
      } catch (error) {
        console.error('Error parsing file:', error)
        toast({
          title: 'Error parsing file',
          description: 'Please check the file format and try again',
          status: 'error',
          duration: 5000,
        })
      }
    }

    reader.onerror = () => {
      toast({
        title: 'Error reading file',
        description: 'Please try again with a different file',
        status: 'error',
        duration: 5000,
      })
    }

    reader.readAsArrayBuffer(file)
  }

  const handleUpload = () => {
    if (!parsingResult || parsingResult.questions.length === 0) return

    // Final validation
    const validation = BulkQuestionParser.validateQuestions(
      parsingResult.questions,
    )

    if (!validation.isValid) {
      toast({
        title: 'Validation Failed',
        description: 'Please fix the errors before uploading',
        status: 'error',
        duration: 5000,
      })
      return
    }

    setUploading(true)

    // Simulate upload process
    setTimeout(() => {
      onQuestionsUploaded(parsingResult.questions)
      setUploading(false)
      handleClose()

      toast({
        title: 'Questions Uploaded',
        description: `Successfully added ${parsingResult.questions.length} questions`,
        status: 'success',
        duration: 3000,
      })
    }, 1000)
  }

  const handleClose = () => {
    setParsingResult(null)
    setFileName('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
    onClose()
  }

  const triggerFileInput = () => {
    fileInputRef.current?.click()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Bulk Upload Questions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* File Upload Section */}
            <Card variant="outline">
              <CardBody>
                <VStack spacing={4}>
                  <Box
                    border="2px dashed"
                    borderColor="gray.300"
                    borderRadius="lg"
                    p={8}
                    textAlign="center"
                    width="100%"
                    cursor="pointer"
                    onClick={triggerFileInput}
                    _hover={{ borderColor: 'blue.500', bg: 'blue.50' }}
                  >
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".xlsx,.xls,.csv"
                      style={{ display: 'none' }}
                    />

                    <FiUpload size={48} color="#CBD5E0" />
                    <Text fontSize="lg" fontWeight="medium" mt={2}>
                      {fileName ? fileName : 'Click to upload Excel/CSV file'}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Supports .xlsx, .xls, .csv formats
                    </Text>
                  </Box>

                  {/* File Requirements */}
                  <Box textAlign="left" width="100%">
                    <Text fontWeight="bold" mb={2}>
                      Expected File Format:
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      • Column A: Question Text (Required)
                      <br />
                      • Columns B-F: Options 1-5 (At least 2 required)
                      <br />
                      • Column G: Correct Answer Number (1-5)
                      <br />• Column H: Question Type (Optional, defaults to
                      Objective) - You don&apos;t have to fill this column
                      though
                      <br />• You can download 👇 a sample template to see what
                      the questions should look like.
                    </Text>
                    {/* Template */}
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={generateQuestionTemplate}
                      mt={2}
                      leftIcon={<FiDownload />}
                    >
                      Download Template
                    </Button>
                  </Box>
                </VStack>
              </CardBody>
            </Card>

            {/* Parsing Results */}
            {parsingResult && (
              <Card>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    <HStack justify="space-between">
                      <Text fontWeight="bold" fontSize="lg">
                        Parsing Results
                      </Text>
                      <Badge
                        colorScheme={
                          parsingResult.errors.length === 0 ? 'green' : 'orange'
                        }
                      >
                        {parsingResult.questions.length} Valid Questions
                      </Badge>
                    </HStack>

                    {/* Errors */}
                    {parsingResult.errors.length > 0 && (
                      <Alert status="error">
                        <AlertIcon />
                        <Box>
                          <Text fontWeight="bold">
                            {parsingResult.errors.length} Error(s) Found:
                          </Text>
                          <VStack align="start" mt={2} spacing={1}>
                            {parsingResult.errors
                              .slice(0, 5)
                              .map((error, index) => (
                                <Text key={index} fontSize="sm">
                                  • {error}
                                </Text>
                              ))}
                            {parsingResult.errors.length > 5 && (
                              <Text fontSize="sm" color="gray.600">
                                • ... and {parsingResult.errors.length - 5} more
                                errors
                              </Text>
                            )}
                          </VStack>
                        </Box>
                      </Alert>
                    )}

                    {/* Questions Preview */}
                    {parsingResult.questions.length > 0 && (
                      <Box>
                        <Text fontWeight="bold" mb={3}>
                          Questions Preview (First 5)
                        </Text>
                        <Box maxH="300px" overflowY="auto">
                          <Table variant="simple" size="sm">
                            <Thead>
                              <Tr>
                                <Th>#</Th>
                                <Th>Question</Th>
                                <Th>Options</Th>
                                <Th>Correct Answer</Th>
                                <Th>Type</Th>
                              </Tr>
                            </Thead>
                            <Tbody>
                              {parsingResult.questions
                                .slice(0, 5)
                                .map((question, index) => (
                                  <Tr key={index}>
                                    <Td fontWeight="medium">{index + 1}</Td>
                                    <Td>
                                      <Text
                                        fontSize="sm"
                                        noOfLines={2}
                                        title={question.questionText}
                                      >
                                        {question.questionText}
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Text fontSize="xs" color="gray.600">
                                        {question.options.length} options
                                      </Text>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme="green" fontSize="xs">
                                        {question.correctAnswer.substring(
                                          0,
                                          20,
                                        )}
                                        ...
                                      </Badge>
                                    </Td>
                                    <Td>
                                      <Badge colorScheme="blue" fontSize="xs">
                                        {question.type}
                                      </Badge>
                                    </Td>
                                  </Tr>
                                ))}
                            </Tbody>
                          </Table>
                        </Box>
                        {parsingResult.questions.length > 5 && (
                          <Text
                            fontSize="sm"
                            color="gray.600"
                            mt={2}
                            textAlign="center"
                          >
                            ... and {parsingResult.questions.length - 5} more
                            questions
                          </Text>
                        )}
                      </Box>
                    )}
                  </VStack>
                </CardBody>
              </Card>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button
            variant="outline"
            mr={3}
            onClick={handleClose}
            isDisabled={uploading}
          >
            Cancel
          </Button>
          <Button
            colorScheme="blue"
            onClick={handleUpload}
            isLoading={uploading}
            loadingText="Uploading Questions..."
            isDisabled={
              !parsingResult ||
              parsingResult.questions.length === 0 ||
              parsingResult.errors.length > 0
            }
            leftIcon={<FiUpload />}
          >
            Upload {parsingResult ? parsingResult.questions.length : 0}{' '}
            Questions
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
