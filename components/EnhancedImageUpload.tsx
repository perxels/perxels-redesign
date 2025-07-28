import React, { useState, useRef, useCallback } from 'react'
import {
  Box,
  Button,
  Text,
  VStack,
  HStack,
  Image,
  Alert,
  AlertIcon,
  IconButton,
  Tooltip,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useDisclosure,
  Badge,
  Progress,
  Spinner,
  Flex,
  Divider,
} from '@chakra-ui/react'
import { FiUpload, FiX, FiImage, FiZoomIn, FiRotateCw, FiDownload } from 'react-icons/fi'

interface EnhancedImageUploadProps {
  value?: string
  onChange: (file: File | null) => void
  onError?: (error: string) => void
  isRequired?: boolean
  maxSize?: number // in MB
  acceptedTypes?: string[]
  aspectRatio?: { width: number; height: number }
  minDimensions?: { width: number; height: number }
  maxDimensions?: { width: number; height: number }
  showPreviewModal?: boolean
  uploadText?: string
  previewText?: string
}

export const EnhancedImageUpload: React.FC<EnhancedImageUploadProps> = ({
  value,
  onChange,
  onError,
  isRequired = false,
  maxSize = 5,
  acceptedTypes = ['image/jpeg', 'image/png', 'image/jpg', 'image/webp'],
  aspectRatio,
  minDimensions = { width: 300, height: 150 },
  maxDimensions,
  showPreviewModal = true,
  uploadText = "Drop image here or click to upload",
  previewText = "PREVIEW"
}) => {
  const [dragOver, setDragOver] = useState(false)
  const [previewUrl, setPreviewUrl] = useState<string>('')
  const [selectedFile, setSelectedFile] = useState<File | null>(null)
  const [validationError, setValidationError] = useState('')
  const [imageInfo, setImageInfo] = useState<{
    width: number
    height: number
    size: string
    type: string
  } | null>(null)
  const [isProcessing, setIsProcessing] = useState(false)
  const fileInputRef = useRef<HTMLInputElement>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const validateImage = useCallback(async (file: File): Promise<{ 
    valid: boolean
    error?: string
    dimensions?: { width: number; height: number }
  }> => {
    return new Promise((resolve) => {
      // Check file type
      if (!acceptedTypes.includes(file.type)) {
        resolve({ 
          valid: false, 
          error: `Please select a valid image file (${acceptedTypes.map(t => t.split('/')[1]).join(', ')})` 
        })
        return
      }

      // Check file size
      if (file.size > maxSize * 1024 * 1024) {
        resolve({ 
          valid: false, 
          error: `Image size must be less than ${maxSize}MB` 
        })
        return
      }

      // Check dimensions
      const img = new window.Image()
      img.onload = () => {
        const { width, height } = img
        
        // Minimum dimensions check
        if (width < minDimensions.width || height < minDimensions.height) {
          resolve({
            valid: false,
            error: `Image is too small. Minimum: ${minDimensions.width}x${minDimensions.height}px. Current: ${width}x${height}`,
            dimensions: { width, height }
          })
          return
        }

        // Maximum dimensions check
        if (maxDimensions && (width > maxDimensions.width || height > maxDimensions.height)) {
          resolve({
            valid: false,
            error: `Image is too large. Maximum: ${maxDimensions.width}x${maxDimensions.height}px. Current: ${width}x${height}`,
            dimensions: { width, height }
          })
          return
        }

        // Aspect ratio check
        if (aspectRatio) {
          const targetAspectRatio = aspectRatio.width / aspectRatio.height
          const imageAspectRatio = width / height
          const tolerance = 0.1
          const minAspectRatio = targetAspectRatio * (1 - tolerance)
          const maxAspectRatio = targetAspectRatio * (1 + tolerance)

          if (imageAspectRatio < minAspectRatio || imageAspectRatio > maxAspectRatio) {
            resolve({
              valid: false,
              error: `Image aspect ratio should be close to ${aspectRatio.width}x${aspectRatio.height}. Current: ${width}x${height}`,
              dimensions: { width, height }
            })
            return
          }
        }

        resolve({ valid: true, dimensions: { width, height } })
      }

      img.onerror = () => {
        resolve({ valid: false, error: 'Invalid image file' })
      }

      img.src = URL.createObjectURL(file)
    })
  }, [acceptedTypes, maxSize, minDimensions, maxDimensions, aspectRatio])

  const handleFileSelect = async (file: File) => {
    try {
      setIsProcessing(true)
      setValidationError('')

      // Validate image first
      const validation = await validateImage(file)
      console.log('🔍 Image validation result:', validation)
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
      
      // Set image info
      if (validation.dimensions) {
        setImageInfo({
          width: validation.dimensions.width,
          height: validation.dimensions.height,
          size: formatFileSize(file.size),
          type: file.type
        })
      }
      
      console.log('📤 Calling onChange with file:', file)
      onChange(file)
      onError?.('') // Clear any previous errors

    } catch (error) {
      console.error('File validation error:', error)
      const errorMessage = 'Failed to process image. Please try again.'
      onError?.(errorMessage)
      setValidationError(errorMessage)
    } finally {
      setIsProcessing(false)
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
    setImageInfo(null)
    onChange(null)
    
    if (fileInputRef.current) {
      fileInputRef.current.value = ''
    }
  }

  const openFileDialog = () => {
    fileInputRef.current?.click()
  }

  const openPreviewModal = () => {
    if (showPreviewModal && (previewUrl || value)) {
      onOpen()
    }
  }

  // Display either the preview URL or the existing value (for editing)
  const displayUrl = previewUrl || value

  return (
    <>
      <VStack spacing={3} align="stretch">
        <input
          ref={fileInputRef}
          type="file"
          accept={acceptedTypes.join(',')}
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
            position="relative"
          >
            {isProcessing && (
              <Box
                position="absolute"
                top={0}
                left={0}
                right={0}
                bottom={0}
                bg="whiteAlpha.800"
                display="flex"
                alignItems="center"
                justifyContent="center"
                borderRadius="lg"
                zIndex={1}
              >
                <VStack spacing={2}>
                  <Spinner size="lg" color="purple.500" />
                  <Text fontSize="sm" color="gray.600">Processing image...</Text>
                </VStack>
              </Box>
            )}
            
            <VStack spacing={3}>
              <FiImage size={32} color="#A0AEC0" />
              <Text fontWeight="medium" color="gray.600">
                {uploadText}
              </Text>
              {aspectRatio && (
                <Text fontSize="sm" color="gray.500">
                  Recommended: {aspectRatio.width} x {aspectRatio.height} pixels
                </Text>
              )}
              <Text fontSize="xs" color="gray.400">
                {acceptedTypes.map(t => t.split('/')[1]).join(', ').toUpperCase()} • Max {maxSize}MB
              </Text>
            </VStack>
          </Box>
        ) : (
          /* Enhanced Image Preview */
          <Box position="relative" borderRadius="lg" overflow="hidden" bg="gray.100">
            <Image
              src={displayUrl}
              alt="Image preview"
              width="100%"
              maxH="200px"
              objectFit="cover"
              cursor={showPreviewModal ? 'pointer' : 'default'}
              onClick={openPreviewModal}
              transition="transform 0.2s"
              _hover={showPreviewModal ? { transform: 'scale(1.02)' } : {}}
            />
            
            {/* Overlay with actions */}
            <Box
              position="absolute"
              top={0}
              left={0}
              right={0}
              bottom={0}
              bg="blackAlpha.600"
              opacity={0}
              _hover={{ opacity: 1 }}
              transition="opacity 0.2s"
              display="flex"
              alignItems="center"
              justifyContent="center"
            >
              <HStack spacing={2}>
                {showPreviewModal && (
                  <Tooltip label="View full size">
                    <IconButton
                      aria-label="View full size"
                      icon={<FiZoomIn />}
                      size="sm"
                      variant="ghost"
                      color="white"
                      _hover={{ bg: 'whiteAlpha.200' }}
                      onClick={openPreviewModal}
                    />
                  </Tooltip>
                )}
                <Tooltip label="Remove image">
                  <IconButton
                    aria-label="Remove image"
                    icon={<FiX />}
                    size="sm"
                    variant="ghost"
                    color="white"
                    _hover={{ bg: 'whiteAlpha.200' }}
                    onClick={handleRemoveImage}
                  />
                </Tooltip>
              </HStack>
            </Box>

            {/* Preview badge */}
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
                {previewText}
              </Box>
            )}

            {/* Image info */}
            {imageInfo && (
              <Box
                position="absolute"
                bottom={2}
                left={2}
                right={2}
                bg="blackAlpha.700"
                color="white"
                px={2}
                py={1}
                borderRadius="md"
                fontSize="xs"
              >
                <HStack justify="space-between">
                  <Text>{imageInfo.width} × {imageInfo.height}</Text>
                  <Text>{imageInfo.size}</Text>
                </HStack>
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

        {/* Action Buttons */}
        <HStack spacing={2}>
          {!displayUrl && !validationError && (
            <Button
              leftIcon={<FiUpload />}
              variant="outline"
              onClick={openFileDialog}
              flex={1}
            >
              Choose Image
            </Button>
          )}
          
          {displayUrl && (
            <>
              <Button
                leftIcon={<FiRotateCw />}
                variant="outline"
                onClick={openFileDialog}
                flex={1}
              >
                Change Image
              </Button>
              {showPreviewModal && (
                <Button
                  leftIcon={<FiZoomIn />}
                  variant="outline"
                  onClick={openPreviewModal}
                >
                  Preview
                </Button>
              )}
            </>
          )}
        </HStack>
      </VStack>

      {/* Full Size Preview Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
        <ModalOverlay />
        <ModalContent maxW="90vw" maxH="90vh">
          <ModalHeader>Image Preview</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            <VStack spacing={4}>
              <Box position="relative" display="flex" justifyContent="center" alignItems="center">
                <Image
                  src={displayUrl}
                  alt="Full size preview"
                  maxW="100%"
                  maxH="70vh"
                  objectFit="contain"
                  borderRadius="md"
                />
              </Box>
              
              {imageInfo && (
                <Box w="full" p={4} bg="gray.50" borderRadius="md">
                  <VStack spacing={2} align="stretch">
                    <Text fontWeight="medium" fontSize="sm">Image Details</Text>
                    <Divider />
                    <HStack justify="space-between">
                      <Text fontSize="sm">Dimensions:</Text>
                      <Text fontSize="sm" fontWeight="medium">
                        {imageInfo.width} × {imageInfo.height} pixels
                      </Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">File Size:</Text>
                      <Text fontSize="sm" fontWeight="medium">{imageInfo.size}</Text>
                    </HStack>
                    <HStack justify="space-between">
                      <Text fontSize="sm">Type:</Text>
                      <Text fontSize="sm" fontWeight="medium">{imageInfo.type}</Text>
                    </HStack>
                    {aspectRatio && (
                      <HStack justify="space-between">
                        <Text fontSize="sm">Aspect Ratio:</Text>
                        <Text fontSize="sm" fontWeight="medium">
                          {aspectRatio.width}:{aspectRatio.height}
                        </Text>
                      </HStack>
                    )}
                  </VStack>
                </Box>
              )}
            </VStack>
          </ModalBody>
          <ModalFooter>
            <HStack spacing={3}>
              <Button variant="outline" onClick={openFileDialog}>
                Change Image
              </Button>
              <Button onClick={onClose}>
                Close
              </Button>
            </HStack>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </>
  )
} 