import React, { useState } from 'react'
import {
  Box,
  Text,
  VStack,
  HStack,
  Button,
  Badge,
  Image,
  useToast,
} from '@chakra-ui/react'
import { FiDownload, FiLock, FiBook, FiEye } from 'react-icons/fi'
import { PortalEbook } from '../../../../types/ebook.types'

interface EbookCardProps {
  ebook: PortalEbook & { hasAccess: boolean }
  onDownload: () => void
  onUnlock: () => void
  userId?: string
}

export const EbookCard = ({
  ebook,
  onDownload,
  onUnlock,
  userId,
}: EbookCardProps) => {
  const toast = useToast()
  const [isDownloading, setIsDownloading] = useState(false)

  const formatFileSize = (bytes: number) => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const handleDownload = async () => {
    if (isDownloading || !userId) return // Prevent multiple downloads

    setIsDownloading(true)
    try {
      // Show loading state
      toast({
        title: 'Preparing Download',
        description: 'Please wait while we prepare your file...',
        status: 'info',
        duration: 2000,
      })

      // Handle all Firebase operations on client side first
      if (userId && ebook.id) {
        try {
          // Record the download using client-side Firebase
          const { recordEbookDownload } = await import(
            '../../../../lib/utils/ebook.utils'
          )
          await recordEbookDownload(ebook.id, userId)
        } catch (error) {
          console.warn('Failed to record download:', error)
          // Continue with download even if recording fails
        }
      }

      // Simple direct download approach
      const fileName =
        ebook.fileName || `${ebook.title}.${ebook.fileType.toLowerCase()}`

      // Create a temporary link element to trigger download
      const link = document.createElement('a')
      link.href = ebook.fileUrl
      link.download = fileName
      link.target = '_blank'
      link.style.display = 'none'

      // Append to body, click, and cleanup
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)

      toast({
        title: 'Download Started! 📚',
        description: `${ebook.title} is being downloaded`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Download error:', error)
      toast({
        title: 'Download Failed',
        description: 'Unable to download the ebook. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setIsDownloading(false)
    }
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      p={6}
      shadow="md"
      transition="all 0.2s ease-in-out"
      _hover={{
        shadow: 'lg',
        transform: 'translateY(-2px)',
      }}
      position="relative"
      overflow="hidden"
    >
      {/* Thumbnail */}
      <Box
        position="relative"
        mb={4}
        borderRadius="lg"
        overflow="hidden"
        bg="gray.100"
        h="200px"
        display="flex"
        alignItems="center"
        justifyContent="center"
      >
        {ebook.thumbnailUrl ? (
          <Image
            src={ebook.thumbnailUrl}
            alt={ebook.title}
            objectFit="cover"
            w="full"
            h="full"
          />
        ) : (
          <FiBook size={64} color="#A0AEC0" />
        )}

        {/* File type badge */}
        <Badge
          position="absolute"
          top={2}
          right={2}
          colorScheme="purple"
          variant="solid"
          fontSize="xs"
        >
          {ebook.fileType.toUpperCase()}
        </Badge>

        {/* Lock overlay for locked ebooks */}
        {!ebook.hasAccess && (
          <Box
            position="absolute"
            top={0}
            left={0}
            right={0}
            bottom={0}
            bg="rgba(0, 0, 0, 0.6)"
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="lg"
          >
            <FiLock size={48} color="white" />
          </Box>
        )}
      </Box>

      {/* Content */}
      <VStack spacing={3} align="stretch">
        <Text
          fontSize="lg"
          fontWeight="bold"
          color="gray.800"
          noOfLines={2}
          lineHeight="1.4"
        >
          {ebook.title}
        </Text>

        <Text fontSize="sm" color="gray.600" noOfLines={2} lineHeight="1.4">
          {ebook.description}
        </Text>

        {/* Author */}
        <Text fontSize="sm" color="purple.600" fontWeight="medium">
          by {ebook.author}
        </Text>

        {/* Metadata */}
        <HStack spacing={4} fontSize="xs" color="gray.500">
          <Text>{formatFileSize(ebook.fileSize)}</Text>
          {ebook.pageCount && <Text>{ebook.pageCount} pages</Text>}
          {ebook.language && <Text>{ebook.language}</Text>}
        </HStack>

        {/* Category */}
        {ebook.category && (
          <Badge
            colorScheme="blue"
            variant="subtle"
            alignSelf="flex-start"
            fontSize="xs"
          >
            {ebook.category}
          </Badge>
        )}

        {/* Tags */}
        {ebook.tags && ebook.tags.length > 0 && (
          <HStack spacing={1} flexWrap="wrap">
            {ebook.tags.slice(0, 3).map((tag, index) => (
              <Badge
                key={index}
                colorScheme="gray"
                variant="outline"
                fontSize="xs"
              >
                {tag}
              </Badge>
            ))}
            {ebook.tags.length > 3 && (
              <Badge colorScheme="gray" variant="outline" fontSize="xs">
                +{ebook.tags.length - 3}
              </Badge>
            )}
          </HStack>
        )}

        {/* Action Buttons */}
        <HStack spacing={2} mt={2}>
          {ebook.hasAccess ? (
            <Button
              leftIcon={<FiDownload />}
              colorScheme="purple"
              size="sm"
              flex={1}
              onClick={handleDownload}
              isLoading={isDownloading}
              loadingText="Downloading..."
              isDisabled={isDownloading}
            >
              Download
            </Button>
          ) : (
            <Button
              leftIcon={<FiLock />}
              colorScheme="orange"
              size="sm"
              flex={1}
              onClick={onUnlock}
            >
              Unlock with Code
            </Button>
          )}
        </HStack>

        {/* Date Posted */}
        <Text fontSize="xs" color="gray.400" textAlign="center">
          Added{' '}
          {ebook.datePosted instanceof Date
            ? ebook.datePosted.toLocaleDateString()
            : 'Unknown date'}
        </Text>
      </VStack>
    </Box>
  )
}
