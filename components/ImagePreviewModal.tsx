import React from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Image,
  Box,
  Spinner,
  Text,
  useDisclosure,
} from '@chakra-ui/react'

interface ImagePreviewModalProps {
  isOpen: boolean
  onClose: () => void
  imageUrl: string
  title?: string
}

export function ImagePreviewModal({
  isOpen,
  onClose,
  imageUrl,
  title = 'Image Preview',
}: ImagePreviewModalProps) {
  const [imageLoading, setImageLoading] = React.useState(true)
  const [imageError, setImageError] = React.useState(false)

  React.useEffect(() => {
    if (isOpen) {
      setImageLoading(true)
      setImageError(false)
    }
  }, [isOpen, imageUrl])

  const handleImageLoad = () => {
    setImageLoading(false)
  }

  const handleImageError = () => {
    setImageLoading(false)
    setImageError(true)
  }

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="xl" isCentered>
      <ModalOverlay />
      <ModalContent maxW="90vw" maxH="90vh">
        <ModalHeader>{title}</ModalHeader>
        <ModalCloseButton />
        <ModalBody pb={6}>
          <Box
            position="relative"
            display="flex"
            justifyContent="center"
            alignItems="center"
            minH="400px"
            bg="gray.50"
            borderRadius="md"
            overflow="hidden"
          >
            {imageLoading && (
              <Box
                position="absolute"
                top="50%"
                left="50%"
                transform="translate(-50%, -50%)"
                zIndex={1}
              >
                <Spinner size="lg" color="purple.500" />
              </Box>
            )}
            
            {imageError ? (
              <Box textAlign="center" p={8}>
                <Text color="gray.500" fontSize="lg">
                  Failed to load image
                </Text>
                <Text color="gray.400" fontSize="sm" mt={2}>
                  The image URL may be invalid or the image may have been removed.
                </Text>
              </Box>
            ) : (
              <Image
                src={imageUrl}
                alt={title}
                maxW="100%"
                maxH="70vh"
                objectFit="contain"
                onLoad={handleImageLoad}
                onError={handleImageError}
                style={{ opacity: imageLoading ? 0 : 1 }}
                transition="opacity 0.3s ease"
              />
            )}
          </Box>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
}

// Hook for easy usage
export function useImagePreview() {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const [imageUrl, setImageUrl] = React.useState('')
  const [title, setTitle] = React.useState('')

  const openImagePreview = (url: string, imageTitle?: string) => {
    setImageUrl(url)
    setTitle(imageTitle || 'Image Preview')
    onOpen()
  }

  return {
    isOpen,
    onClose,
    imageUrl,
    title,
    openImagePreview,
  }
} 