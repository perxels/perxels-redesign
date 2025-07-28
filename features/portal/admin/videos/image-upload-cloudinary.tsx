import React, { useState, useRef } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  Image,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
} from '@chakra-ui/react'
import { FiUpload, FiX, FiImage } from 'react-icons/fi'

interface ImageUploadCloudinaryProps {
  value?: string
  onChange: (file: File | null) => void
  onError?: (error: string) => void
  isRequired?: boolean
}

export const ImageUploadCloudinary: React.FC<ImageUploadCloudinaryProps> = ({
  value,
  onChange,
  onError,
  isRequired = false,
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState('')
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

  const handleFileSelect = async (file: File) => {
    try {
      setValidationError('')

      // Validate image first
      const validation = await validateImage(file)
      if (!validation.valid) {
        const errorMsg = validation.error || 'Invalid image'
        onError?.(errorMsg)
        setValidationError(errorMsg)
        return
      }

      // Create preview URL
      const preview = URL.createObjectURL(file)
      setPreviewUrl(preview)
      setSelectedFile(file)
      onChange(file)
      onError?.('') // Clear any previous errors

    } catch (error) {
      console.error('File validation error:', error)
      const errorMessage = 'Failed to process image. Please try again.'
      onError?.(errorMessage)
      setValidationError(errorMessage)
    }
  }

  const handleFileInputChange = (event: React.ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0]
    if (file) {
      handleFileSelect(file)
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
      handleFileSelect(file)
    }
  }

  const handleRemoveImage = () => {
    // Clean up preview URL
    if (previewUrl) {
      URL.revokeObjectURL(previewUrl)
    }
    
    setPreviewUrl('')
    setSelectedFile(null)
    setValidationError('')
    onChange(null)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  // Display either the preview URL or the existing value (for editing)
  const displayUrl = previewUrl || value

  return (
    <VStack spacing={3} align="stretch">
      <input
        ref={fileInputRef}
        type="file"
        accept="image/*"
        onChange={handleFileInputChange}
        style={{ display: 'none' }}
      />

      {/* Upload Area */}
      {!displayUrl ? (
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
            src={displayUrl}
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
          {previewUrl && (
            <Box
              position="absolute"
              top={2}
              left={2}
              bg="blue.500"
              color="white"
              px={2}
              py={1}
              borderRadius="md"
              fontSize="xs"
              fontWeight="medium"
            >
              PREVIEW
            </Box>
          )}
        </Box>
      )}

      {/* Error Display */}
      {validationError && (
        <Alert status="error" borderRadius="md">
          <AlertIcon />
          <Text fontSize="sm">{validationError}</Text>
        </Alert>
      )}

      {/* Upload Button (when no image) */}
      {!displayUrl && !validationError && (
        <Button
          leftIcon={<FiUpload />}
          variant="outline"
          onClick={openFileDialog}
        >
          Choose Image
        </Button>
      )}
    </VStack>
  )
} 