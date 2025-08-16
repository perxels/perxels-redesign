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
  Select,
  NumberInput,
  NumberInputField,
  NumberInputStepper,
  NumberIncrementStepper,
  NumberDecrementStepper,
  useToast,
  Text,
  Box,
  Badge,
  Divider,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
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
  maxAccess: Yup.number()
    .min(1, 'Max access must be at least 1')
    .optional(),
  pageCount: Yup.number()
    .min(1, 'Page count must be at least 1')
    .optional(),
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

        await updateEbook(ebook.id, updates)

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
        toast({
          title: 'Error',
          description: 'Failed to update ebook. Please try again.',
          status: 'error',
          duration: 3000,
        })
      } finally {
        setIsSubmitting(false)
      }
    },
  })



  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl">
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
                  <Badge colorScheme="purple" variant="outline" fontFamily="mono">
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
              </VStack>
            </Alert>

            <Divider />

            {/* Edit Form */}
            <form onSubmit={formik.handleSubmit}>
              <VStack spacing={4} align="stretch">
                <FormControl isInvalid={!!formik.errors.title && formik.touched.title}>
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

                <FormControl isInvalid={!!formik.errors.description && formik.touched.description}>
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

                <FormControl isInvalid={!!formik.errors.author && formik.touched.author}>
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

                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Category</FormLabel>
                    <Input
                      name="category"
                      value={formik.values.category}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="e.g., Design, Development"
                    />
                  </FormControl>

                  <FormControl>
                    <FormLabel>Language</FormLabel>
                    <Select 
                      name="language"
                      value={formik.values.language}
                      onChange={formik.handleChange}
                      onBlur={formik.handleBlur}
                      placeholder="Select language"
                    >
                      <option value="English">English</option>
                      <option value="French">French</option>
                      <option value="Spanish">Spanish</option>
                      <option value="German">German</option>
                      <option value="Chinese">Chinese</option>
                      <option value="Japanese">Japanese</option>
                    </Select>
                  </FormControl>
                </HStack>

                <HStack spacing={4}>
                  <FormControl>
                    <FormLabel>Page Count</FormLabel>
                    <NumberInput min={1}>
                      <NumberInputField
                        name="pageCount"
                        value={formik.values.pageCount || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="Number of pages"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>

                  <FormControl>
                    <FormLabel>Max Access Limit</FormLabel>
                    <NumberInput min={1}>
                      <NumberInputField
                        name="maxAccess"
                        value={formik.values.maxAccess || ''}
                        onChange={formik.handleChange}
                        onBlur={formik.handleBlur}
                        placeholder="No limit"
                      />
                      <NumberInputStepper>
                        <NumberIncrementStepper />
                        <NumberDecrementStepper />
                      </NumberInputStepper>
                    </NumberInput>
                  </FormControl>
                </HStack>

                <FormControl>
                  <FormLabel>ISBN</FormLabel>
                  <Input
                    name="isbn"
                    value={formik.values.isbn}
                    onChange={formik.handleChange}
                    onBlur={formik.handleBlur}
                    placeholder="Enter ISBN (optional)"
                  />
                </FormControl>
              </VStack>
            </form>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="ghost" mr={3} onClick={onClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            type="submit"
            isLoading={isSubmitting}
            loadingText="Updating..."
          >
            Update Ebook
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
