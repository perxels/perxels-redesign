import React from 'react'
import {
  Box,
  Text,
  Badge,
  HStack,
  VStack,
  IconButton,
  Tooltip,
  Image,
} from '@chakra-ui/react'
import { FiPlay, FiClock, FiEye, FiLock } from 'react-icons/fi'
import { PortalVideo } from '../../../../types/video.types'

interface VideoCardProps {
  video: PortalVideo & { hasAccess?: boolean }
  onPlay: () => void
  onUnlock?: () => void
}

export const VideoCard: React.FC<VideoCardProps> = ({ video, onPlay, onUnlock }) => {
  const hasAccess = video.hasAccess !== false // Default to true if not specified
  
  const getVideoThumbnail = (video: PortalVideo) => {
    // Use custom video image if provided
    if (video.videoImage) {
      return video.videoImage
    }
    
    // Extract YouTube thumbnail if it's a YouTube URL
    const youtubeMatch = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/hqdefault.jpg`
    }
    
    // For Vimeo or other videos, use a placeholder
    return '/assets/images/video-placeholder.png'
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return null
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  const formatVideoDate = (datePosted: any) => {
    try {
      // Handle Firestore Timestamp
      if (datePosted && typeof datePosted === 'object' && datePosted.toDate) {
        return datePosted.toDate().toLocaleDateString()
      }
      
      // Handle Date object
      if (datePosted instanceof Date) {
        return datePosted.toLocaleDateString()
      }
      
      // Handle string or number
      if (datePosted) {
        const date = new Date(datePosted)
        if (!isNaN(date.getTime())) {
          return date.toLocaleDateString()
        }
      }
      
      return 'Date unavailable'
    } catch (error) {
      console.error('Error formatting video date:', error)
      return 'Date unavailable'
    }
  }

  const handleClick = () => {
    if (hasAccess) {
      onPlay()
    } else if (onUnlock) {
      onUnlock()
    }
  }

  return (
    <Box
      bg="white"
      borderRadius="xl"
      overflow="hidden"
      shadow="sm"
      border="1px"
      borderColor={hasAccess ? "gray.200" : "gray.300"}
      transition="all 0.2s"
      _hover={{
        shadow: 'md',
        transform: 'translateY(-2px)',
      }}
      cursor="pointer"
      onClick={handleClick}
      opacity={hasAccess ? 1 : 0.8}
      position="relative"
    >
      {/* Thumbnail */}
      <Box position="relative" bg="gray.100">
        <Image
          src={getVideoThumbnail(video)}
          alt={video.title}
          width="100%"
          height="200px"
          objectFit="cover"
          fallbackSrc="/assets/images/video-placeholder.png"
          filter={hasAccess ? "none" : "grayscale(30%)"}
        />
        
        {/* Lock Overlay for locked videos */}
        {!hasAccess && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            bg="rgba(0, 0, 0, 0.7)"
            borderRadius="full"
            p={3}
          >
            <FiLock size={32} color="white" />
          </Box>
        )}
        
        {/* Play Button Overlay for unlocked videos */}
        {hasAccess && (
          <Box
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
          >
            <IconButton
              aria-label="Play video"
              icon={<FiPlay />}
              colorScheme="purple"
              borderRadius="full"
              size="lg"
              _hover={{ transform: 'scale(1.1)' }}
              transition="transform 0.2s"
            />
          </Box>
        )}

        {/* Duration Badge */}
        {video.duration && (
          <Badge
            position="absolute"
            bottom={2}
            right={2}
            colorScheme="blackAlpha"
            variant="solid"
            borderRadius="md"
            fontSize="xs"
          >
            <HStack spacing={1}>
              <FiClock size={12} />
              <Text>{formatDuration(video.duration)}</Text>
            </HStack>
          </Badge>
        )}

        {/* Lock Badge for locked videos */}
        {!hasAccess && (
          <Badge
            position="absolute"
            top={2}
            left={2}
            colorScheme="orange"
            variant="solid"
            borderRadius="md"
            fontSize="xs"
          >
            <HStack spacing={1}>
              <FiLock size={12} />
              <Text>LOCKED</Text>
            </HStack>
          </Badge>
        )}
      </Box>

      {/* Content */}
      <Box p={4}>
        <VStack align="start" spacing={3}>
          {/* Title and Category */}
          <Box>
            <Text
              fontWeight="bold"
              fontSize="lg"
              color={hasAccess ? "gray.800" : "gray.600"}
              lineHeight="1.3"
              noOfLines={2}
              mb={1}
            >
              {video.title}
            </Text>
            {video.category && (
              <Badge 
                colorScheme={hasAccess ? "purple" : "gray"} 
                variant="subtle" 
                size="sm"
              >
                {video.category}
              </Badge>
            )}
          </Box>

          {/* Video Session */}
          <Text
            fontSize="sm"
            color={hasAccess ? "gray.600" : "gray.500"}
            noOfLines={3}
            lineHeight="1.4"
          >
            {video.videoSession}
          </Text>

          {/* Access Code hint for locked videos */}
          {!hasAccess && (
            <Text
              fontSize="xs"
              color="orange.500"
              fontWeight="medium"
            >
              Enter access code to unlock
            </Text>
          )}

          {/* Stats */}
          <HStack spacing={4} pt={2}>
            <HStack spacing={1} color="gray.500">
              <FiEye size={14} />
              <Text fontSize="xs">
                {video.viewCount} view{video.viewCount !== 1 ? 's' : ''}
              </Text>
            </HStack>
            
            <Text fontSize="xs" color="gray.400">
              {formatVideoDate(video.datePosted)}
            </Text>
          </HStack>
        </VStack>
      </Box>
    </Box>
  )
} 