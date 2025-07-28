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
  VStack,
  HStack,
  Text,
  useToast,
  Alert,
  AlertIcon,
  Switch,
  Progress,
} from '@chakra-ui/react'
import { Formik, Form } from 'formik'
import * as Yup from 'yup'
import { updateVideo } from '../../../../lib/utils/video.utils'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { EnhancedImageUpload } from '../../../../components/EnhancedImageUpload'
import { PortalVideo } from '../../../../types/video.types'

interface EditVideoModalProps {
  isOpen: boolean
  onClose: () => void
  video: PortalVideo
  onVideoUpdated: () => void
}

interface VideoFormValues {
  title: string
  videoSession: string
  videoUrl: string
  videoImage: string
  author: string
  isActive: boolean
}

const validationSchema = Yup.object().shape({
  title: Yup.string()
    .required('Title is required')
    .min(3, 'Title must be at least 3 characters')
    .max(100, 'Title must not exceed 100 characters'),
  videoSession: Yup.string()
    .required('Video session is required')
    .min(5, 'Video session must be at least 5 characters')
    .max(200, 'Video session must not exceed 200 characters'),
  videoUrl: Yup.string()
    .required('Video URL is required')
    .url('Please enter a valid URL'),
  videoImage: Yup.string().optional(),
  author: Yup.string()
    .required('Author is required')
    .min(2, 'Author must be at least 2 characters')
    .max(50, 'Author must not exceed 50 characters'),
})

export const EditVideoModal: React.FC<EditVideoModalProps> = ({
  isOpen,
  onClose,
  video,
  onVideoUpdated,
}) => {
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [imageError, setImageError] = useState('')
  const [selectedImageFile, setSelectedImageFile] = useState<File | null>(null)
  const [uploadProgress, setUploadProgress] = useState(0)
  const { user } = usePortalAuth()
  const toast = useToast()

  const initialValues: VideoFormValues = {
    title: video.title,
    videoSession: video.videoSession,
    videoUrl: video.videoUrl,
    videoImage: video.videoImage || '',
    author: video.author,
    isActive: video.isActive,
  }

  const uploadImageToCloudinary = async (file: File): Promise<string> => {
    const formData = new FormData()
    formData.append('file', file)
    formData.append(
      'upload_preset',
      process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
    )
    formData.append('folder', 'portal/video-thumbnails')
    formData.append(
      'public_id',
      `video_thumbnail_${Date.now()}_${Math.random()
        .toString(36)
        .substr(2, 9)}`,
    )
    formData.append(
      'context',
      `upload_type=video_thumbnail|timestamp=${Date.now()}`,
    )

    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!cloudinaryResponse.ok) {
      throw new Error(
        `Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`,
      )
    }

    const cloudinaryResult = await cloudinaryResponse.json()

    if (cloudinaryResult.error) {
      throw new Error(`Cloudinary error: ${cloudinaryResult.error.message}`)
    }

    return cloudinaryResult.secure_url
  }

  const handleSubmit = async (values: VideoFormValues) => {
    if (!user?.uid) {
      toast({
        title: 'Error',
        description: 'You must be logged in to edit videos',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setIsSubmitting(true)
    setUploadProgress(0)

    try {
      let finalImageUrl = values.videoImage

      // Upload new image if selected
      if (selectedImageFile) {
        setUploadProgress(10)
        
        // Simulate progress for upload
        const progressInterval = setInterval(() => {
          setUploadProgress((prev) => {
            if (prev >= 90) return 90
            return prev + 10
          })
        }, 200)

        try {
          finalImageUrl = await uploadImageToCloudinary(selectedImageFile)
          clearInterval(progressInterval)
          setUploadProgress(100)
        } catch (uploadError) {
          clearInterval(progressInterval)
          throw uploadError
        }
      }

      // Small delay to show 100% completion
      if (selectedImageFile) {
        await new Promise((resolve) => setTimeout(resolve, 500))
      }

      const updates = {
        title: values.title.trim(),
        videoSession: values.videoSession.trim(),
        videoUrl: values.videoUrl.trim(),
        videoImage: finalImageUrl,
        author: values.author.trim(),
        isActive: values.isActive,
      }

      await updateVideo(video.id, updates)

      toast({
        title: 'Success! 🎉',
        description: 'Video updated successfully',
        status: 'success',
        duration: 5000,
      })

      onVideoUpdated()
      onClose()
    } catch (error) {
      console.error('Error updating video:', error)
      
      let errorMessage = 'Failed to update video. Please try again.'
      if (error instanceof Error) {
        if (error.message.includes('Cloudinary')) {
          errorMessage = 'Failed to upload image. Please try again.'
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
  }

  const handleClose = () => {
    setImageError('')
    setSelectedImageFile(null)
    setUploadProgress(0)
    onClose()
  }

  const isYouTubeUrl = (url: string) => {
    return url.includes('youtube.com') || url.includes('youtu.be')
  }

  const isVimeoUrl = (url: string) => {
    return url.includes('vimeo.com')
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Edit Video</ModalHeader>
        <ModalCloseButton />
        
        <Formik
          initialValues={initialValues}
          validationSchema={validationSchema}
          onSubmit={handleSubmit}
        >
          {({
            values,
            errors,
            touched,
            handleChange,
            handleBlur,
            setFieldValue,
          }) => (
            <Form>
              <ModalBody>
                <VStack spacing={4}>
                  <Alert status="info" borderRadius="md">
                    <AlertIcon />
                    Editing video: {video.title}
                  </Alert>

                  <FormControl
                    isInvalid={!!(errors.title && touched.title)}
                    isRequired
                  >
                    <FormLabel>Video Title</FormLabel>
                    <Input
                      name="title"
                      value={values.title}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter video title"
                    />
                    {errors.title && touched.title && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.title}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!(errors.videoSession && touched.videoSession)}
                    isRequired
                  >
                    <FormLabel>Video Session</FormLabel>
                    <Input
                      name="videoSession"
                      value={values.videoSession}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter the video session topic"
                    />
                    {errors.videoSession && touched.videoSession && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.videoSession}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!(errors.author && touched.author)}
                    isRequired
                  >
                    <FormLabel>Author</FormLabel>
                    <Input
                      name="author"
                      value={values.author}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="Enter author name"
                    />
                    {errors.author && touched.author && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.author}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl
                    isInvalid={!!(errors.videoUrl && touched.videoUrl)}
                    isRequired
                  >
                    <FormLabel>Video URL</FormLabel>
                    <Input
                      name="videoUrl"
                      value={values.videoUrl}
                      onChange={handleChange}
                      onBlur={handleBlur}
                      placeholder="https://youtube.com/watch?v=... or https://vimeo.com/..."
                    />
                    {values.videoUrl && (
                      <Text fontSize="xs" color="gray.600" mt={1}>
                        {isYouTubeUrl(values.videoUrl) &&
                          '✅ YouTube URL detected'}
                        {isVimeoUrl(values.videoUrl) && '✅ Vimeo URL detected'}
                        {!isYouTubeUrl(values.videoUrl) &&
                          !isVimeoUrl(values.videoUrl) &&
                          values.videoUrl.startsWith('http') &&
                          '📹 Custom video URL'}
                      </Text>
                    )}
                    {errors.videoUrl && touched.videoUrl && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {errors.videoUrl}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl isInvalid={!!imageError}>
                    <FormLabel>Video Image</FormLabel>
                    <EnhancedImageUpload
                      value={values.videoImage}
                      onChange={(file) => {
                        setSelectedImageFile(file)
                        setImageError('')
                      }}
                      onError={(error) => setImageError(error)}
                      maxSize={5}
                      acceptedTypes={['image/jpeg', 'image/png', 'image/jpg', 'image/webp']}
                      aspectRatio={{ width: 431, height: 253 }}
                      minDimensions={{ width: 300, height: 150 }}
                      uploadText="Drop video thumbnail here or click to upload"
                      previewText="THUMBNAIL"
                    />
                    {imageError && (
                      <Text color="red.500" fontSize="sm" mt={1}>
                        {imageError}
                      </Text>
                    )}
                  </FormControl>

                  <FormControl>
                    <HStack justify="space-between">
                      <FormLabel mb={0}>Active Status</FormLabel>
                      <Switch
                        name="isActive"
                        isChecked={values.isActive}
                        onChange={(e) =>
                          setFieldValue('isActive', e.target.checked)
                        }
                        colorScheme="purple"
                      />
                    </HStack>
                    <Text fontSize="xs" color="gray.600" mt={1}>
                      Only active videos can be accessed by students
                    </Text>
                  </FormControl>

                  {/* Upload Progress */}
                  {isSubmitting && uploadProgress > 0 && (
                    <VStack spacing={2} w="100%">
                      <Progress
                        value={uploadProgress}
                        colorScheme="purple"
                        size="sm"
                        borderRadius="md"
                        w="100%"
                      />
                      <Text fontSize="sm" color="gray.500">
                        {selectedImageFile
                          ? 'Uploading image to Cloudinary...'
                          : 'Updating video...'}{' '}
                        {uploadProgress}%
                      </Text>
                    </VStack>
                  )}
                </VStack>
              </ModalBody>

              <ModalFooter>
                <Button variant="outline" mr={3} onClick={handleClose}>
                  Cancel
                </Button>
                <Button
                  type="submit"
                  colorScheme="purple"
                  isLoading={isSubmitting}
                  loadingText={
                    selectedImageFile
                      ? 'Uploading & Updating...'
                      : 'Updating Video...'
                  }
                >
                  Update Video
                </Button>
              </ModalFooter>
            </Form>
          )}
        </Formik>
      </ModalContent>
    </Modal>
  )
} 