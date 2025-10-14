import React, { useState, useRef, useCallback, useEffect } from 'react'
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
import { FiUpload, FiDownload } from 'react-icons/fi'
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
  const [isDragActive, setIsDragActive] = useState(false)
  const toast = useToast()

  // Fix scrolling issues
  useEffect(() => {
    if (isOpen) {
      // Prevent background scroll but allow modal scrolling
      document.body.style.overflow = 'hidden'

      return () => {
        document.body.style.overflow = 'unset'
      }
    }
  }, [isOpen])

  // ... rest of your existing handlers (handleDrag, handleDrop, handleFile, etc.)

  return (
    <Modal
      isOpen={isOpen}
      onClose={handleClose}
      size="4xl"
      blockScrollOnMount={false}
      scrollBehavior="inside"
      motionPreset="slideInBottom"
    >
      <ModalOverlay />
      <ModalContent
        maxH="90vh"
        overflow="hidden"
        sx={{
          '& .chakra-modal__body': {
            overflowY: 'auto',
            maxHeight: 'calc(90vh - 140px)',
            padding: '20px',
          },
        }}
      >
        <ModalHeader>Bulk Upload Questions</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Your existing file upload section */}
            <Card variant="outline">
              <CardBody>
                <VStack spacing={4}>
                  <Box
                    border="2px dashed"
                    borderColor={isDragActive ? 'blue.500' : 'gray.300'}
                    borderRadius="lg"
                    p={8}
                    textAlign="center"
                    width="100%"
                    cursor="pointer"
                    onClick={triggerFileInput}
                    onDragEnter={handleDrag}
                    onDragLeave={handleDrag}
                    onDragOver={handleDrag}
                    onDrop={handleDrop}
                    bg={isDragActive ? 'blue.50' : 'transparent'}
                    transition="all 0.2s"
                    _hover={{
                      borderColor: 'blue.500',
                      bg: 'blue.50',
                    }}
                  >
                    <Input
                      type="file"
                      ref={fileInputRef}
                      onChange={handleFileSelect}
                      accept=".xlsx,.xls,.csv"
                      style={{ display: 'none' }}
                    />

                    <FiUpload
                      size={48}
                      color={isDragActive ? '#3182CE' : '#CBD5E0'}
                    />
                    <Text fontSize="lg" fontWeight="medium" mt={2}>
                      {fileName
                        ? fileName
                        : 'Drag & drop or click to upload Excel/CSV file'}
                    </Text>
                    <Text fontSize="sm" color="gray.600" mt={1}>
                      Supports .xlsx, .xls, .csv formats
                    </Text>
                    {isDragActive && (
                      <Text
                        fontSize="sm"
                        color="blue.500"
                        fontWeight="medium"
                        mt={2}
                      >
                        Drop your file here...
                      </Text>
                    )}
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
                      Objective)
                    </Text>
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

            {/* Your existing parsing results section */}
            {parsingResult && (
              <Card>
                <CardBody>
                  {/* ... your existing parsing results content ... */}
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
