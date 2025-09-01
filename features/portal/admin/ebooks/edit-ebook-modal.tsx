import React, { useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  useToast,
  Text,
  Box,
  Badge,
  Divider,
  Alert,
  AlertIcon,
  Progress,
  Icon,
  IconButton,
} from '@chakra-ui/react'
import { FiUpload, FiFile, FiX, FiImage } from 'react-icons/fi'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { PortalEbook } from '../../../../types/ebook.types'
import { updateEbook } from '../../../../lib/utils/ebook.utils'

const editEbookValidationSchema = Yup.object({
  title: Yup.string()
    .required('Title is required')
    .max(200, 'Title must be less than 200 characters'),
  description: Yup.string()
    .required('Description is required')
    .max(1000, 'Description must be less than 1000 characters'),
  author: Yup.string()
    .required('Author is required')
    .max(100, 'Author must be less than 100 characters'),
  category: Yup.string().optional(),
  maxAccess: Yup.number().min(1, 'Max access must be at least 1').optional(),
  pageCount: Yup.number().min(1, 'Page count must be at least 1').optional(),
  language: Yup.string().optional(),
  isbn: Yup.string().optional(),
})

interface EditEbookModalProps {
  isOpen: boolean
  onClose: () => void
  ebook: PortalEbook
  onEbookUpdated: () => void
}

export const EditEbookModal: React.FC<EditEbookModalProps> = ({
  isOpen,
  onClose,
  ebook,
  onEbookUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [thumbnailError, setThumbnailError] = useState('')
  const toast = useToast()

  const formik = useFormik({
    initialValues: {
      title: ebook.title,
      description: ebook.description,
      author: ebook.author,
      category: ebook.category || '',
      maxAccess: ebook.maxAccess || undefined,
      pageCount: ebook.pageCount || undefined,
      language: ebook.language || '',
      isbn: ebook.isbn || '',
    },
    validationSchema: editEbookValidationSchema,
    onSubmit: async (values) => {
      setIsSubmitting(true)
      setUploadProgress(0)

      try {
        // Create updates object with only defined values
        const updates: any = {
          title: values.title,
          description: values.description,
          author: values.author,
        }

        // Add optional fields only if they have values
        if (values.category) updates.category = values.category
        if (values.maxAccess) updates.maxAccess = values.maxAccess
        if (values.pageCount) updates.pageCount = values.pageCount
        if (values.language) updates.language = values.language
        if (values.isbn) updates.isbn = values.isbn

        // Handle file uploads if new files are selected
        if (selectedFile) {
          setUploadProgress(25)
          const fileUrl = await uploadFile(selectedFile)
          setUploadProgress(75)

          updates.fileUrl = fileUrl
          updates.fileName = selectedFile.name
          updates.fileSize = selectedFile.size
          updates.fileType = selectedFile.type
        }

        // Handle thumbnail upload if new thumbnail is selected
        if (selectedThumbnail) {
          const thumbnailUrl = await uploadFile(selectedThumbnail)
          updates.thumbnailUrl = thumbnailUrl
        }

        setUploadProgress(90)

        await updateEbook(ebook.id, updates)
        setUploadProgress(100)

        toast({
          title: 'Success! 🎉',
          description: 'Ebook updated successfully',
          status: 'success',
          duration: 3000,
        })

        onEbookUpdated()
        onClose()
      } catch (error) {
        console.error('Error updating ebook:', error)

        let errorMessage = 'Failed to update ebook. Please try again.'
        if (error instanceof Error) {
          if (error.message.includes('Cloudinary')) {
            errorMessage = 'Failed to upload file. Please try again.'
          } else if (error.message.includes('permission')) {
            errorMessage = 'Permission denied. Please check your admin access.'
          } else if (error.message.includes('network')) {
            errorMessage = 'Network error. Please check your connection.'
          }
        }

        toast({
          title: 'Error',
          description: errorMessage,
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsSubmitting(false)
        setUploadProgress(0)
      }
    },
  })

  // File upload function
  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Import the upload function dynamically
      const { uploadFileToFirebase } = await import(
        '../../../../lib/utils/firebase-storage.utils'
      )

      const folder = 'portal/ebooks'
      const downloadURL = await uploadFileToFirebase(file, folder)
      return downloadURL
    } catch (error) {
      console.error('Error uploading file:', error)
      throw new Error('Failed to upload file')
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = [
      'application/pdf',
      'application/epub+zip',
      'text/plain',
    ]
    if (!allowedTypes.includes(file.type)) {
      setFileError('Please select a valid file type (PDF, EPUB, or TXT)')
      return
    }

    // Validate file size (50MB limit)
    const maxSize = 50 * 1024 * 1024 // 50MB
    if (file.size > maxSize) {
      setFileError('File size must be less than 50MB')
      return
    }

    setSelectedFile(file)
    setFileError('')
  }

  const handleThumbnailSelect = (
    event: React.ChangeEvent<HTMLInputElement>,
  ) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file type
    const allowedTypes = ['image/jpeg', 'image/png', 'image/webp']
    if (!allowedTypes.includes(file.type)) {
      setThumbnailError('Please select a valid image type (JPEG, PNG, or WebP)')
      return
    }

    // Validate file size (5MB limit)
    const maxSize = 5 * 1024 * 1024 // 5MB
    if (file.size > maxSize) {
      setThumbnailError('Image size must be less than 5MB')
      return
    }

    setSelectedThumbnail(file)
    setThumbnailError('')
  }

  const handleClose = () => {
    setSelectedFile(null)
    setSelectedThumbnail(null)
    setFileError('')
    setThumbnailError('')
    setUploadProgress(0)
    onClose()
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Ebook</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={6} align="stretch">
            {/* Current Ebook Info */}
            <Alert status="info">
              <AlertIcon />
              <VStack align="start" spacing={2}>
                <Text fontWeight="semibold">Current Ebook Information</Text>
                <HStack spacing={4} wrap="wrap">
                  <Badge
                    colorScheme="purple"
                    variant="outline"
                    fontFamily="mono"
                  >
                    Access Code: {ebook.accessCode}
                  </Badge>
                  <Badge colorScheme="blue" variant="subtle">
                    Downloads: {ebook.downloadCount}
                  </Badge>
                  <Badge colorScheme="green" variant="subtle">
                    {formatFileSize(ebook.fileSize)}
                  </Badge>
                </HStack>
                <Text fontSize="sm" color="gray.600">
                  File: {ebook.fileName} ({ebook.fileType.toUpperCase()})
                </Text>
                {ebook.thumbnailUrl && (
                  <Text fontSize="sm" color="gray.600">
                    Cover Image: Available
                  </Text>
                )}
              </VStack>
            </Alert>

            <Divider />

            {/* Edit Form */}
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl
                  isInvalid={!!formik.errors.title && formik.touched.title}
                >
                  <FormLabel>Title</FormLabel>
                  <Input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ebook title"
                  />
                  {formik.errors.title && formik.touched.title && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {formik.errors.title}
                    </Text>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={
                    !!formik.errors.description && formik.touched.description
                  }
                >
                  <FormLabel>Description</FormLabel>
                  <Textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ebook description"
                    rows={4}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {formik.errors.description}
                    </Text>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={!!formik.errors.author && formik.touched.author}
                >
                  <FormLabel>Author</FormLabel>
                  <Input
                    name="author"
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter author name"
                  />
                  {formik.errors.author && formik.touched.author && (
                    <Text color="red.500" fontSize="sm" mt={1}>
                      {formik.errors.author}
                    </Text>
                  )}
                </FormControl>

                {/* File Upload Section */}
                <VStack spacing={4} align="stretch">
                  <Text fontWeight="semibold" fontSize="lg">
                    Update Files (Optional)
                  </Text>

                  {/* PDF File Upload */}
                  <FormControl>
                    <FormLabel>Update PDF File</FormLabel>
                    <Box
                      border="2px dashed"
                      borderColor={selectedFile ? 'green.300' : 'gray.300'}
                      borderRadius="lg"
                      p={4}
                      textAlign="center"
                      bg={selectedFile ? 'green.50' : 'gray.50'}
                      transition="all 0.2s"
                    >
                      {selectedFile ? (
                        <VStack spacing={2}>
                          <HStack spacing={2}>
                            <Icon as={FiFile} color="green.500" />
                            <Text fontWeight="medium">{selectedFile.name}</Text>
                            <IconButton
                              aria-label="Remove file"
                              icon={<FiX />}
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedFile(null)}
                            />
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {formatFileSize(selectedFile.size)}
                          </Text>
                        </VStack>
                      ) : (
                        <VStack spacing={2}>
                          <Icon as={FiUpload} color="gray.400" boxSize={8} />
                          <Text>Click to select new PDF file</Text>
                          <Text fontSize="sm" color="gray.500">
                            Current: {ebook.fileName}
                          </Text>
                        </VStack>
                      )}
                      <Input
                        type="file"
                        accept=".pdf,.epub,.txt"
                        onChange={handleFileSelect}
                        style={{ display: 'none' }}
                        id="file-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="file-upload"
                        variant="outline"
                        size="sm"
                        mt={2}
                        cursor="pointer"
                      >
                        Select File
                      </Button>
                    </Box>
                    {fileError && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {fileError}
                      </Text>
                    )}
                  </FormControl>

                  {/* Thumbnail Upload */}
                  <FormControl>
                    <FormLabel>Update Cover Image</FormLabel>
                    <Box
                      border="2px dashed"
                      borderColor={selectedThumbnail ? 'green.300' : 'gray.300'}
                      borderRadius="lg"
                      p={4}
                      textAlign="center"
                      bg={selectedThumbnail ? 'green.50' : 'gray.50'}
                      transition="all 0.2s"
                    >
                      {selectedThumbnail ? (
                        <VStack spacing={2}>
                          <HStack spacing={2}>
                            <Icon as={FiImage} color="green.500" />
                            <Text fontWeight="medium">
                              {selectedThumbnail.name}
                            </Text>
                            <IconButton
                              aria-label="Remove thumbnail"
                              icon={<FiX />}
                              size="sm"
                              variant="ghost"
                              onClick={() => setSelectedThumbnail(null)}
                            />
                          </HStack>
                          <Text fontSize="sm" color="gray.600">
                            {formatFileSize(selectedThumbnail.size)}
                          </Text>
                        </VStack>
                      ) : (
                        <VStack spacing={2}>
                          <Icon as={FiUpload} color="gray.400" boxSize={8} />
                          <Text>Click to select new cover image</Text>
                          <Text fontSize="sm" color="gray.500">
                            {ebook.thumbnailUrl
                              ? 'Current: Available'
                              : 'Current: None'}
                          </Text>
                        </VStack>
                      )}
                      <Input
                        type="file"
                        accept="image/*"
                        onChange={handleThumbnailSelect}
                        style={{ display: 'none' }}
                        id="thumbnail-upload"
                      />
                      <Button
                        as="label"
                        htmlFor="thumbnail-upload"
                        variant="outline"
                        size="sm"
                        mt={2}
                        cursor="pointer"
                      >
                        Select Image
                      </Button>
                    </Box>
                    {thumbnailError && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {thumbnailError}
                      </Text>
                    )}
                  </FormControl>
                </VStack>
              </VStack>
            </form>

            {/* Upload Progress */}
            {uploadProgress > 0 && (
              <VStack spacing={2}>
                <Text fontSize="sm" color="gray.600">
                  Uploading files...
                </Text>
                <Progress
                  value={uploadProgress}
                  width="100%"
                  colorScheme="purple"
                />
              </VStack>
            )}
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Updating..."
            onClick={() => formik.handleSubmit()}
          >
            Update Ebook
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
