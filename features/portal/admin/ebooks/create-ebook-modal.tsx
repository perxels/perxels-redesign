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
  Progress,
  Text,
  Box,
  Icon,
  IconButton,
  Divider,
} from '@chakra-ui/react'
import { FiUpload, FiFile, FiX } from 'react-icons/fi'
import { useFormik } from 'formik'
import * as Yup from 'yup'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { createEbook } from '../../../../lib/utils/ebook.utils'

const ebookValidationSchema = Yup.object({
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

interface CreateEbookModalProps {
  isOpen: boolean
  onClose: () => void
  onEbookCreated: () => void
}

export const CreateEbookModal: React.FC<CreateEbookModalProps> = ({
  isOpen,
  onClose,
  onEbookCreated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [selectedThumbnail, setSelectedThumbnail] = useState<File | null>(null)
  const [fileError, setFileError] = useState('')
  const [thumbnailError, setThumbnailError] = useState('')

  const toast = useToast()
  const { user } = usePortalAuth()

  const formik = useFormik({
    initialValues: {
      title: '',
      description: '',
      author: '',
      category: '',
      maxAccess: undefined,
      pageCount: undefined,
      language: '',
      isbn: '',
      tags: [],
    },
    validationSchema: ebookValidationSchema,
    onSubmit: async (values) => {
      if (!user?.uid) {
        toast({
          title: 'Error',
          description: 'You must be logged in to create an ebook',
          status: 'error',
          duration: 3000,
        })
        return
      }

      if (!selectedFile) {
        toast({
          title: 'Error',
          description: 'Please select a file to upload',
          status: 'error',
          duration: 3000,
        })
        return
      }

      setIsSubmitting(true)
      setUploadProgress(0)

      try {
        // Upload main file
        setUploadProgress(25)
        const fileUrl = await uploadFile(selectedFile)
        setUploadProgress(75)

        // Upload thumbnail if selected
        let thumbnailUrl = ''
        if (selectedThumbnail) {
          thumbnailUrl = await uploadFile(selectedThumbnail)
        }
        setUploadProgress(90)

        // Create ebook object with only defined values
        const ebookData: any = {
          title: values.title,
          description: values.description,
          author: values.author,
          fileUrl,
          fileName: selectedFile.name,
          fileSize: selectedFile.size,
          fileType: selectedFile.type,
          createdBy: user.uid,
          isActive: true,
        }

        // Add optional fields only if they have values
        if (thumbnailUrl) ebookData.thumbnailUrl = thumbnailUrl

        // Create ebook in database
        setUploadProgress(95)
        const newEbook = await createEbook(ebookData)
        setUploadProgress(100)

        toast({
          title: 'Success! 🎉',
          description: `Ebook created successfully with access code: ${newEbook.accessCode}`,
          status: 'success',
          duration: 5000,
        })

        onEbookCreated()
        handleClose()
      } catch (error) {
        console.error('Error creating ebook:', error)

        let errorMessage = 'Failed to create ebook. Please try again.'
        if (error instanceof Error) {
          if (error.message.includes('Cloudinary')) {
            errorMessage = 'Failed to upload file. Please try again.'
          } else if (error.message.includes('access code')) {
            errorMessage = 'Failed to generate access code. Please try again.'
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
          duration: 5000,
        })
      } finally {
        setIsSubmitting(false)
        setUploadProgress(0)
      }
    },
  })

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

    // Validate image type
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

  const uploadFile = async (file: File): Promise<string> => {
    try {
      // Import Firebase storage utility
      const { uploadFileToFirebase } = await import(
        '../../../../lib/utils/firebase-storage.utils'
      )

      // Determine folder based on file type
      const isImage = file.type.startsWith('image/')
      const folder = isImage ? 'portal/ebooks/thumbnails' : 'portal/ebooks'

      // Upload to Firebase Storage (library storage)
      const downloadURL = await uploadFileToFirebase(file, folder)

      return downloadURL
    } catch (error) {
      console.error('File upload error:', error)
      throw new Error('Failed to upload file. Please try again.')
    }
  }

  const handleClose = () => {
    setFileError('')
    setThumbnailError('')
    setSelectedFile(null)
    setSelectedThumbnail(null)
    setUploadProgress(0)
    formik.resetForm()
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
        <ModalHeader>
          <VStack align="start" spacing={1}>
            <Text>Create New Ebook</Text>
            <Text fontSize="sm" color="gray.600" fontWeight="normal">
              Upload an ebook and generate an access code for students
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <form onSubmit={formik.handleSubmit}>
          <ModalBody>
            <VStack spacing={6} align="stretch">
              {/* Basic Information */}
              <VStack spacing={4} align="stretch">
                <Text fontWeight="semibold" color="purple.600">
                  Basic Information
                </Text>

                <FormControl
                  isInvalid={!!formik.errors.title && formik.touched.title}
                >
                  <FormLabel>Title *</FormLabel>
                  <Input
                    name="title"
                    value={formik.values.title}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ebook title"
                  />
                  {formik.errors.title && formik.touched.title && (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.title}
                    </Text>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={
                    !!formik.errors.description && formik.touched.description
                  }
                >
                  <FormLabel>Description *</FormLabel>
                  <Textarea
                    name="description"
                    value={formik.values.description}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ebook description"
                    rows={3}
                  />
                  {formik.errors.description && formik.touched.description && (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.description}
                    </Text>
                  )}
                </FormControl>

                <FormControl
                  isInvalid={!!formik.errors.author && formik.touched.author}
                >
                  <FormLabel>Author *</FormLabel>
                  <Input
                    name="author"
                    value={formik.values.author}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter author name"
                  />
                  {formik.errors.author && formik.touched.author && (
                    <Text color="red.500" fontSize="sm">
                      {formik.errors.author}
                    </Text>
                  )}
                </FormControl>
              </VStack>

              <Divider />

              {/* File Upload */}
              <VStack spacing={4} align="stretch">
                <Text fontWeight="semibold" color="purple.600">
                  File Upload
                </Text>

                <FormControl isInvalid={!!fileError}>
                  <FormLabel>Ebook File *</FormLabel>
                  <Box
                    border="2px dashed"
                    borderColor={selectedFile ? 'green.300' : 'gray.300'}
                    borderRadius="md"
                    p={6}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: 'purple.300' }}
                    onClick={() =>
                      document.getElementById('file-input')?.click()
                    }
                  >
                    <input
                      id="file-input"
                      type="file"
                      accept=".pdf,.epub,.txt"
                      onChange={handleFileSelect}
                      style={{ display: 'none' }}
                    />
                    <VStack spacing={2}>
                      <Icon as={FiUpload} boxSize={8} color="gray.400" />
                      <Text fontWeight="medium">
                        {selectedFile
                          ? selectedFile.name
                          : 'Click to select file'}
                      </Text>
                      <Text fontSize="sm" color="gray.500">
                        PDF, EPUB, or TXT files up to 50MB
                      </Text>
                    </VStack>
                  </Box>
                  {selectedFile && (
                    <HStack spacing={2} mt={2}>
                      <Icon as={FiFile} />
                      <Text fontSize="sm">
                        {selectedFile.name} ({formatFileSize(selectedFile.size)}
                        )
                      </Text>
                      <IconButton
                        aria-label="Remove file"
                        icon={<FiX />}
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedFile(null)}
                      />
                    </HStack>
                  )}
                  {fileError && (
                    <Text color="red.500" fontSize="sm">
                      {fileError}
                    </Text>
                  )}
                </FormControl>

                <FormControl isInvalid={!!thumbnailError}>
                  <FormLabel>Cover Image (Optional)</FormLabel>
                  <Box
                    border="2px dashed"
                    borderColor={selectedThumbnail ? 'green.300' : 'gray.300'}
                    borderRadius="md"
                    p={4}
                    textAlign="center"
                    cursor="pointer"
                    _hover={{ borderColor: 'purple.300' }}
                    onClick={() =>
                      document.getElementById('thumbnail-input')?.click()
                    }
                  >
                    <input
                      id="thumbnail-input"
                      type="file"
                      accept="image/*"
                      onChange={handleThumbnailSelect}
                      style={{ display: 'none' }}
                    />
                    <VStack spacing={2}>
                      <Icon as={FiUpload} boxSize={6} color="gray.400" />
                      <Text fontSize="sm">
                        {selectedThumbnail
                          ? selectedThumbnail.name
                          : 'Click to select cover image'}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        JPEG, PNG, or WebP up to 5MB
                      </Text>
                    </VStack>
                  </Box>
                  {selectedThumbnail && (
                    <HStack spacing={2} mt={2}>
                      <Icon as={FiFile} />
                      <Text fontSize="sm">
                        {selectedThumbnail.name} (
                        {formatFileSize(selectedThumbnail.size)})
                      </Text>
                      <IconButton
                        aria-label="Remove thumbnail"
                        icon={<FiX />}
                        size="xs"
                        variant="ghost"
                        onClick={() => setSelectedThumbnail(null)}
                      />
                    </HStack>
                  )}
                  {thumbnailError && (
                    <Text color="red.500" fontSize="sm">
                      {thumbnailError}
                    </Text>
                  )}
                </FormControl>
              </VStack>

              {/* Upload Progress */}
              {isSubmitting && (
                <VStack spacing={2}>
                  <Text fontSize="sm" color="gray.600">
                    Uploading files...
                  </Text>
                  <Progress
                    value={uploadProgress}
                    colorScheme="purple"
                    w="full"
                  />
                  <Text fontSize="xs" color="gray.500">
                    {Math.round(uploadProgress)}%
                  </Text>
                </VStack>
              )}
            </VStack>
          </ModalBody>

          <ModalFooter>
            <Button
              variant="ghost"
              mr={3}
              onClick={handleClose}
              isDisabled={isSubmitting}
            >
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              type="submit"
              isLoading={isSubmitting}
              loadingText="Creating..."
              isDisabled={!selectedFile}
            >
              Create Ebook
            </Button>
          </ModalFooter>
        </form>
      </ModalContent>
    </Modal>
  )
}
