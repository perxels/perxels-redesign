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

  const validateFileUrl = (url: string): boolean => {
    try {
      const urlObj = new URL(url)
      return urlObj.protocol === 'https:' || urlObj.protocol === 'http:'
    } catch {
      return false
    }
  }

  const downloadFile = async (url: string, fileName: string): Promise<boolean> => {
    try {
      // Method 1: Try direct download first
      const link = document.createElement('a')
      link.href = url
      link.download = fileName
      link.target = '_blank'
      link.style.display = 'none'
      
      document.body.appendChild(link)
      link.click()
      document.body.removeChild(link)
      
      // Give it a moment to see if it works
      await new Promise(resolve => setTimeout(resolve, 1000))
      
      return true
    } catch (error) {
      console.warn('Direct download failed, trying fetch method:', error)
      
      // Method 2: Fetch and download
      try {
        const response = await fetch(url, {
          method: 'GET',
          mode: 'cors',
        })
        
        if (!response.ok) {
          throw new Error(`HTTP ${response.status}: ${response.statusText}`)
        }
        
        const blob = await response.blob()
        const downloadUrl = window.URL.createObjectURL(blob)
        
        const link = document.createElement('a')
        link.href = downloadUrl
        link.download = fileName
        link.style.display = 'none'
        
        document.body.appendChild(link)
        link.click()
        document.body.removeChild(link)
        
        // Clean up the blob URL
        window.URL.revokeObjectURL(downloadUrl)
        
        return true
      } catch (fetchError) {
        console.error('Fetch download also failed:', fetchError)
        return false
      }
    }
  }

  const handleDownload = async () => {
    if (isDownloading || !userId) {
      toast({
        title: 'Error',
        description: 'Please wait for the current download to complete.',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    // Validate access
    if (!ebook.hasAccess) {
      toast({
        title: 'Access Denied',
        description: 'You need to unlock this ebook first.',
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Validate file URL
    if (!ebook.fileUrl || !validateFileUrl(ebook.fileUrl)) {
      toast({
        title: 'Download Error',
        description: 'Invalid file URL. Please contact support.',
        status: 'error',
        duration: 5000,
      })
      return
    }

    setIsDownloading(true)
    
    try {
      // Show loading state
      toast({
        title: 'Preparing Download',
        description: 'Please wait while we prepare your file...',
        status: 'info',
        duration: 2000,
      })

      // Prepare file name
      const fileName = ebook.fileName || `${ebook.title.replace(/[^a-zA-Z0-9]/g, '_')}.${ebook.fileType.toLowerCase()}`

      // Attempt download
      const downloadSuccess = await downloadFile(ebook.fileUrl, fileName)

      if (downloadSuccess) {
        // Record the download only after successful download
        try {
          const { recordEbookDownload } = await import(
            '../../../../lib/utils/ebook.utils'
          )
          await recordEbookDownload(ebook.id, userId)
          
          toast({
            title: 'Download Successful! 📚',
            description: `${ebook.title} has been downloaded successfully`,
            status: 'success',
            duration: 4000,
          })
        } catch (recordError) {
          console.warn('Failed to record download:', recordError)
          // Still show success message even if recording fails
          toast({
            title: 'Download Successful! 📚',
            description: `${ebook.title} has been downloaded (download count may not be updated)`,
            status: 'success',
            duration: 4000,
          })
        }
      } else {
        throw new Error('Download failed')
      }
    } catch (error) {
      console.error('Download error:', error)
      
      let errorMessage = 'Unable to download the ebook. Please try again.'
      
      if (error instanceof Error) {
        if (error.message.includes('CORS')) {
          errorMessage = 'Download blocked by browser security. Please try opening the link in a new tab.'
        } else if (error.message.includes('HTTP')) {
          errorMessage = 'File not found or access denied. Please contact support.'
        } else if (error.message.includes('network')) {
          errorMessage = 'Network error. Please check your connection and try again.'
        }
      }
      
      toast({
        title: 'Download Failed',
        description: errorMessage,
        status: 'error',
        duration: 5000,
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
