import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Progress,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'
import { ref, uploadBytes, getDownloadURL } from 'firebase/storage'
import { portalStorage } from '../../../../portalFirebaseConfig'

interface ImageUploadProps {
  value?: string
  onChange: (url: string) => void
  onError?: (error: string) => void
  isRequired?: boolean
}

export const ImageUpload: React.FC<ImageUploadProps> = ({
  value,
  onChange,
  onError,
  isRequired = false,
}) => {
  const [uploading, setUploading] = useState(false)
  const [uploadProgress, setUploadProgress] = useState(0)
  const [dragOver, setDragOver] = useState(false)
  const [uploadError, setUploadError] = useState('')
  const [lastFile, setLastFile] = useState<File | null>(null)
  const fileInputRef = useRef<HTMLInputElement>(null)

  const validateImage = (file: File): Promise<{ valid: boolean; error?: string; dimensions?: { width: number; height: number } }> => {
    return new Promise((resolve) => {
      // Check file type
      if (!file.type.startsWith('image/')) {
        resolve({ valid: false, error: 'Please select an image file' })
        return
      }

      // Check file size (max 5MB)
      if (file.size > 5 * 1024 * 1024) {
        resolve({ valid: false, error: 'Image size must be less than 5MB' })
        return
      }

      // Check dimensions
      const img = new window.Image()
      img.onload = () => {
        const { width, height } = img
        
        // Recommended dimensions: 431 x 253
        const recommendedWidth = 431
        const recommendedHeight = 253
        const aspectRatio = recommendedWidth / recommendedHeight
        const imageAspectRatio = width / height

        // Allow some tolerance for aspect ratio (±10%)
        const tolerance = 0.1
        const minAspectRatio = aspectRatio * (1 - tolerance)
        const maxAspectRatio = aspectRatio * (1 + tolerance)

        if (imageAspectRatio < minAspectRatio || imageAspectRatio > maxAspectRatio) {
          resolve({
            valid: false,
            error: `Image aspect ratio should be close to ${recommendedWidth}x${recommendedHeight}. Current: ${width}x${height}`,
            dimensions: { width, height }
          })
          return
        }

        // Minimum dimensions check
        if (width < 300 || height < 150) {
          resolve({
            valid: false,
            error: `Image is too small. Minimum: 300x150px. Current: ${width}x${height}`,
            dimensions: { width, height }
          })
          return
        }

        resolve({ valid: true, dimensions: { width, height } })
      }

      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' })
      }

      img.src = URL.createObjectURL(file)
    })
  }

  const uploadImage = async (file: File) => {
    try {
      setUploading(true)
      setUploadProgress(0)
      setUploadError('')
      setLastFile(file)

      // Validate image first
      const validation = await validateImage(file)
      if (!validation.valid) {
        const errorMsg = validation.error || 'Invalid image'
        onError?.(errorMsg)
        setUploadError(errorMsg)
        setUploading(false)
        setUploadProgress(0)
        return
      }

      // Create unique filename
      const timestamp = Date.now()
      const randomId = Math.random().toString(36).substr(2, 9)
      const extension = file.name.split('.').pop()
      const fileName = `video-thumbnails/${timestamp}_${randomId}.${extension}`

      // Upload to Firebase Storage
      const storageRef = ref(portalStorage, fileName)
      
      // Simulate progress with better error handling
      const progressInterval = setInterval(() => {
        setUploadProgress(prev => {
          if (prev >= 90) return 90
          return prev + 10
        })
      }, 200)

      // Add timeout protection
      const uploadTimeout = setTimeout(() => {
        clearInterval(progressInterval)
        setUploading(false)
        setUploadProgress(0)
        const errorMsg = 'Upload timeout. Please try again.'
        onError?.(errorMsg)
        setUploadError(errorMsg)
      }, 30000) // 30 second timeout

      try {
      const snapshot = await uploadBytes(storageRef, file)
        clearTimeout(uploadTimeout)
      clearInterval(progressInterval)
        setUploadProgress(95)

        // Get download URL with timeout
        const downloadURL = await Promise.race([
          getDownloadURL(snapshot.ref),
          new Promise((_, reject) => 
            setTimeout(() => reject(new Error('Download URL timeout')), 10000)
          )
        ]) as string
        
      setUploadProgress(100)

        // Small delay to show 100% completion
        setTimeout(() => {
      onChange(downloadURL)
      setUploading(false)
      setUploadProgress(0)
          setUploadError('')
          setLastFile(null)
        }, 500)

      } catch (uploadError) {
        clearTimeout(uploadTimeout)
        clearInterval(progressInterval)
        console.error('Upload error:', uploadError)
        
        // More specific error messages
        let errorMessage = 'Failed to upload image. Please try again.'
        if (uploadError instanceof Error) {
          if (uploadError.message.includes('storage/unauthorized')) {
            errorMessage = 'Upload unauthorized. Please check your permissions.'
          } else if (uploadError.message.includes('storage/quota-exceeded')) {
            errorMessage = 'Storage quota exceeded. Please contact support.'
          } else if (uploadError.message.includes('storage/network-request-failed')) {
            errorMessage = 'Network error. Please check your connection and try again.'
          } else if (uploadError.message.includes('Download URL timeout')) {
            errorMessage = 'Upload completed but failed to get image URL. Please try again.'
          }
        }
        
        onError?.(errorMessage)
        setUploadError(errorMessage)
        setUploading(false)
        setUploadProgress(0)
      }
    } catch (error) {
      console.error('Upload error:', error)
      const errorMessage = 'Failed to upload image. Please try again.'
      onError?.(errorMessage)
      setUploadError(errorMessage)
      setUploading(false)
      setUploadProgress(0)
    }
  }

  const handleFileSelect = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleDragOver = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(true)
  }

  const handleDragLeave = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
  }

  const handleDrop = (event: React.DragEvent) => {
    event.preventDefault()
    setDragOver(false)
    
    const file = event.dataTransfer.files[0]
    if (file) {
      uploadImage(file)
    }
  }

  const handleRemoveImage = () => {
    onChange('')
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const handleRetry = () => {
    if (lastFile) {
      uploadImage(lastFile)
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  return (
    <VStack spacing={3} align="stretch">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileSelect}
        style={{ display: 'none' }}
      />

      {/* Upload Area */}
      {!value ? (
        <Box
          border="2px dashed"
          borderColor={dragOver ? 'purple.400' : 'gray.300'}
          borderRadius="lg"
          p={6}
          textAlign="center"
          cursor="pointer"
          transition="all 0.2s"
          bg={dragOver ? 'purple.50' : 'gray.50'}
          _hover={{ borderColor: 'purple.400', bg: 'purple.50' }}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
          onDrop={handleDrop}
          onClick={openFileDialog}
        >
          <VStack spacing={3}>
            <FiImage size={32} color="#A0AEC0" />
            <Text fontWeight="medium" color="gray.600">
              Drop image here or click to upload
            </Text>
            <Text fontSize="sm" color="gray.500">
              Recommended: 431 x 253 pixels
            </Text>
            <Text fontSize="xs" color="gray.400">
              JPG, PNG, WebP • Max 5MB
            </Text>
          </VStack>
        </Box>
      ) : (
        /* Image Preview */
        <Box position="relative" borderRadius="lg" overflow="hidden">
          <Image
            src={value}
            alt="Video thumbnail"
            width="100%"
            maxH="200px"
            objectFit="cover"
            bg="gray.100"
          />
          <Box
            position="absolute"
            top={2}
            right={2}
            bg="blackAlpha.600"
            borderRadius="full"
          >
            <Tooltip label="Remove image">
              <IconButton
                aria-label="Remove image"
                icon={<FiX />}
                size="sm"
                variant="ghost"
                color="white"
                _hover={{ bg: 'blackAlpha.800' }}
                onClick={handleRemoveImage}
              />
            </Tooltip>
          </Box>
        </Box>
      )}

      {/* Upload Progress */}
      {uploading && (
        <VStack spacing={2}>
          <Progress
            value={uploadProgress}
            colorScheme="purple"
            size="sm"
            borderRadius="md"
            w="100%"
          />
          <Text fontSize="sm" color="gray.500">
            Uploading... {uploadProgress}%
          </Text>
        </VStack>
      )}

      {/* Error Display */}
      {uploadError && !uploading && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <VStack align="start" spacing={2} w="100%">
            <Text fontSize="sm">{uploadError}</Text>
            <HStack spacing={2}>
              <Button
                size="sm"
                colorScheme="red"
                variant="outline"
                onClick={handleRetry}
                isDisabled={!lastFile}
              >
                Retry Upload
              </Button>
              <Button
                size="sm"
                variant="ghost"
                onClick={() => {
                  setUploadError('')
                  setLastFile(null)
                  onError?.('')
                }}
              >
                Clear Error
              </Button>
            </HStack>
          </VStack>
        </Alert>
      )}

      {/* Upload Button (when no image) */}
      {!value && !uploading && !uploadError && (
        <Button
          leftIcon={<FiUpload />}
          variant="outline"
          onClick={openFileDialog}
          isDisabled={uploading}
        >
          Choose Image
        </Button>
      )}

      {/* Retry Button (when there's an error) */}
      {!value && !uploading && uploadError && (
        <Button
          leftIcon={<FiUpload />}
          colorScheme="red"
          variant="outline"
          onClick={openFileDialog}
        >
          Choose Different Image
        </Button>
      )}

      {/* Requirements */}
      <Alert status="info" borderRadius="md" fontSize="sm">
        <AlertIcon />
        <VStack align="start" spacing={1}>
          <Text fontWeight="medium">Image Requirements:</Text>
          <Text fontSize="xs">• Recommended size: 431 x 253 pixels</Text>
          <Text fontSize="xs">• Aspect ratio: ~1.7:1 (landscape)</Text>
          <Text fontSize="xs">• Minimum: 300 x 150 pixels</Text>
          <Text fontSize="xs">• Maximum file size: 5MB</Text>
        </VStack>
      </Alert>
    </VStack>
  )
} 