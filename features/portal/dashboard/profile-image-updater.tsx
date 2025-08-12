import React, { useState } from 'react'
import {
  Box,
  Avatar,
  IconButton,
  Input,
  VStack,
  HStack,
  Button,
  Text,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Image,
  Spinner,
} from '@chakra-ui/react'
import { FiEdit2, FiCamera } from 'react-icons/fi'
import { portalAuth } from '../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { EnhancedImageUpload } from '../../../components/EnhancedImageUpload'

interface ProfileImageUpdaterProps {
  size?:
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
    | '3xl'
    | '4xl'
    | '5xl'
    | '6xl'
    | '7xl'
    | '8xl'
    | '9xl'
    | '10xl'
  showEditButton?: boolean
}

export const ProfileImageUpdater: React.FC<ProfileImageUpdaterProps> = ({
  size = 'xl',
  showEditButton = true,
}) => {
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [previewUrl, setPreviewUrl] = useState<string | null>(null)
  const [isUploading, setIsUploading] = useState(false)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()
  const { user, portalUser } = usePortalAuth()

  // Get current profile image URL
  const currentImageUrl = portalUser?.growthInfo?.pictureUrl || ''

  // Handle file selection
  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (!file) return

    // Validate file size (5MB max)
    if (file.size > 5000000) {
      toast({
        title: 'File too large',
        description: 'Please select an image smaller than 5MB',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    // Validate file type
    if (!['image/jpeg', 'image/png', 'image/jpg'].includes(file.type)) {
      toast({
        title: 'Invalid file type',
        description: 'Please select a JPEG or PNG image',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setSelectedFile(file)

    // Create preview URL
    const reader = new FileReader()
    reader.onloadend = () => {
      setPreviewUrl(reader.result as string)
    }
    reader.readAsDataURL(file)

    // Open modal for preview
    onOpen()
  }

  // Handle image upload
  const handleUpload = async () => {
    if (!selectedFile || !user?.uid) {
      toast({
        title: 'Error',
        description: 'Please select an image and ensure you are logged in',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setIsUploading(true)

    try {
      // Verify user authentication
      const currentUser = portalAuth.currentUser
      if (!currentUser) {
        throw new Error('User not authenticated. Please log in again.')
      }

      await currentUser.reload()
      const uid = currentUser.uid

      // Create FormData for Cloudinary upload
      const formData = new FormData()
      formData.append('file', selectedFile)
      formData.append(
        'upload_preset',
        process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET || '',
      )
      formData.append('folder', 'portal/profile-pictures')
      formData.append('public_id', `${uid}_${Date.now()}_profile_picture`)
      formData.append('context', `user_id=${uid}|upload_type=profile_picture`)

      // Upload to Cloudinary
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

      const newImageUrl = cloudinaryResult.secure_url

      // Update user profile in Firestore
      const response = await fetch('/api/update-profile-image', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          uid,
          imageUrl: newImageUrl,
        }),
      })

      const result = await response.json()

      if (!response.ok || !result.success) {
        throw new Error(result.error || 'Failed to update profile image')
      }

      toast({
        title: 'Profile Updated! 🎉',
        description: 'Your profile picture has been updated successfully.',
        status: 'success',
        duration: 5000,
        isClosable: true,
        position: 'top',
      })

      // Close modal and reset state
      onClose()
      setSelectedFile(null)
      setPreviewUrl(null)

      // Refresh page or trigger re-fetch of user data
      window.location.reload()
    } catch (error: any) {
      console.error('Profile image update error:', error)

      let errorMessage = 'Failed to update profile picture. Please try again.'
      if (error.message?.includes('upload_preset')) {
        errorMessage = 'Upload configuration error. Please contact support.'
      } else if (error.message?.includes('Network')) {
        errorMessage =
          'Upload failed: Network error. Please check your connection.'
      } else if (
        error.message?.includes('401') ||
        error.message?.includes('unauthorized')
      ) {
        errorMessage =
          'Upload failed: Invalid configuration. Please contact support.'
      }

      toast({
        title: 'Update Failed',
        description: errorMessage,
        status: 'error',
        duration: 8000,
        isClosable: true,
        position: 'top',
      })
    } finally {
      setIsUploading(false)
    }
  }

  // Handle modal close
  const handleModalClose = () => {
    if (!isUploading) {
      onClose()
      setSelectedFile(null)
      setPreviewUrl(null)
    }
  }

  return (
    <>
      <Box position="relative" display="inline-block">
        <Avatar
          size={size}
          w={size}
          h={size}
          src={currentImageUrl}
          name={portalUser?.fullName || 'User'}
          bg="gray.300"
          color="white"
          cursor={showEditButton ? 'pointer' : 'default'}
          onClick={showEditButton ? onOpen : undefined}
        />

        {showEditButton && (
          <IconButton
            aria-label="Edit profile picture"
            icon={<FiEdit2 />}
            size={['sm', 'lg']}
            colorScheme="brand.purple"
            bg="brand.purple.500"
            color="white"
            borderRadius="full"
            position="absolute"
            bottom="0"
            right="0"
            transform="translate(-40%, -40%)"
            border="4px solid white"
            boxShadow="md"
            transition="all 0.2s"
            onClick={onOpen}
            cursor="pointer"
            _hover={{
              borderRadius: 'full',
            }}
          />
        )}
      </Box>

      {/* Preview and Upload Modal */}
      <Modal isOpen={isOpen} onClose={handleModalClose} isCentered>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Upload Profile Picture</ModalHeader>
          {!isUploading && <ModalCloseButton />}

          <ModalBody>
            <VStack spacing={6}>
              {/* Simple Image Upload */}
              <Box w="full" textAlign="center">
                <Box w="200px" h="200px" mx="auto">
                  <EnhancedImageUpload
                    onChange={(file) => {
                      setSelectedFile(file)
                      if (file) {
                        const reader = new FileReader()
                        reader.onloadend = () => {
                          setPreviewUrl(reader.result as string)
                        }
                        reader.readAsDataURL(file)
                      } else {
                        setPreviewUrl(null)
                      }
                    }}
                    maxSize={5}
                    acceptedTypes={['image/jpeg', 'image/png', 'image/jpg']}
                    showPreviewModal={false}
                    uploadText="Choose Profile Picture"
                    previewText="PREVIEW"
                  />
                </Box>
              </Box>
            </VStack>
          </ModalBody>

          <ModalFooter mt={8}>
            <HStack spacing={3}>
              <Button
                colorScheme="yellow"
                onClick={handleUpload}
                isDisabled={!selectedFile || isUploading}
                isLoading={isUploading}
                loadingText="Uploading..."
                leftIcon={isUploading ? <Spinner size="sm" /> : undefined}
              >
                {isUploading ? 'Uploading...' : 'Update Picture'}
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
}
