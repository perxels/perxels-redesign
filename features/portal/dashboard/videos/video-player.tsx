import React, { useEffect, useState } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  Box,
  Text,
  VStack,
  HStack,
  Badge,
  Progress,
  useToast,
} from '@chakra-ui/react'
import { FiEye, FiClock } from 'react-icons/fi'
import { PortalVideo } from '../../../../types/video.types'
import { updateVideoProgress } from '../../../../lib/utils/video.utils'

interface VideoPlayerProps {
  isOpen: boolean
  onClose: () => void
  video: PortalVideo
  studentId: string
}

export const VideoPlayer: React.FC<VideoPlayerProps> = ({
  isOpen,
  onClose,
  video,
  studentId,
}) => {
  const [watchTime, setWatchTime] = useState(0)
  const [totalDuration, setTotalDuration] = useState(0)
  const [progressPercentage, setProgressPercentage] = useState(0)
  const toast = useToast()

  // Reset watch time when video changes
  useEffect(() => {
    setWatchTime(0)
    setProgressPercentage(0)
  }, [video.id])

  // Update progress in database periodically
  useEffect(() => {
    if (!isOpen || progressPercentage === 0) return

    const updateInterval = setInterval(() => {
      if (progressPercentage > 0) {
        updateVideoProgress(video.id, studentId, progressPercentage)
          .catch(error => console.error('Error updating progress:', error))
      }
    }, 30000) // Update every 30 seconds

    return () => clearInterval(updateInterval)
  }, [isOpen, progressPercentage, video.id, studentId])

  // Update progress on close
  const handleClose = () => {
    if (progressPercentage > 0) {
      updateVideoProgress(video.id, studentId, progressPercentage)
        .then(() => {
          if (progressPercentage >= 90) {
            toast({
              title: 'Great job! 🎉',
              description: 'You completed the video!',
              status: 'success',
              duration: 3000,
            })
          }
        })
        .catch(error => console.error('Error updating final progress:', error))
    }
    onClose()
  }

  const getEmbedUrl = (url: string) => {
    // YouTube URL conversion
    const youtubeMatch = url.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://www.youtube.com/embed/${youtubeMatch[1]}?autoplay=1&enablejsapi=1`
    }

    // Vimeo URL conversion
    const vimeoMatch = url.match(/vimeo\.com\/(\d+)/)
    if (vimeoMatch) {
      return `https://player.vimeo.com/video/${vimeoMatch[1]}?autoplay=1`
    }

    // Direct video URL
    return url
  }

  const isDirectVideo = (url: string) => {
    return !url.includes('youtube.com') && !url.includes('youtu.be') && !url.includes('vimeo.com')
  }

  const formatDuration = (seconds: number) => {
    const mins = Math.floor(seconds / 60)
    const secs = Math.floor(seconds % 60)
    return `${mins}:${secs.toString().padStart(2, '0')}`
  }

  const embedUrl = getEmbedUrl(video.videoUrl)
  const isDirect = isDirectVideo(video.videoUrl)

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="6xl">
      <ModalOverlay bg="blackAlpha.800" />
      <ModalContent bg="black" color="white" maxW="90vw" maxH="90vh">
        <ModalHeader bg="gray.900" borderTopRadius="md">
          <VStack align="start" spacing={2}>
            <Text fontSize="lg" fontWeight="bold">
              {video.title}
            </Text>
            <HStack spacing={4}>
              {video.category && (
                <Badge colorScheme="purple" variant="subtle">
                  {video.category}
                </Badge>
              )}
              <HStack spacing={1} color="gray.400">
                <FiEye size={14} />
                <Text fontSize="sm">{video.viewCount} views</Text>
              </HStack>
              {totalDuration > 0 && (
                <HStack spacing={1} color="gray.400">
                  <FiClock size={14} />
                  <Text fontSize="sm">{formatDuration(totalDuration)}</Text>
                </HStack>
              )}
            </HStack>
          </VStack>
        </ModalHeader>
        <ModalCloseButton color="white" />
        
        <ModalBody p={0}>
          <VStack spacing={0} align="stretch">
            {/* Video Player */}
            <Box position="relative" bg="black">
              {isDirect ? (
                <video
                  width="100%"
                  height="500px"
                  controls
                  autoPlay
                  onTimeUpdate={(e) => {
                    const currentTime = e.currentTarget.currentTime
                    const duration = e.currentTarget.duration
                    setWatchTime(currentTime)
                    setTotalDuration(duration)
                    if (duration > 0) {
                      setProgressPercentage((currentTime / duration) * 100)
                    }
                  }}
                  onLoadedMetadata={(e) => {
                    setTotalDuration(e.currentTarget.duration)
                  }}
                >
                  <source src={video.videoUrl} type="video/mp4" />
                  Your browser does not support the video tag.
                </video>
              ) : (
                <iframe
                  width="100%"
                  height="500px"
                  src={embedUrl}
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture"
                  allowFullScreen
                  title={video.title}
                />
              )}
            </Box>

            {/* Progress Bar */}
            {progressPercentage > 0 && (
              <Box p={4} bg="gray.900">
                <VStack spacing={2}>
                  <HStack justify="space-between" w="full">
                    <Text fontSize="sm" color="gray.300">
                      Watch Progress
                    </Text>
                    <Text fontSize="sm" color="gray.300">
                      {Math.round(progressPercentage)}%
                    </Text>
                  </HStack>
                  <Progress
                    value={progressPercentage}
                    size="sm"
                    colorScheme="purple"
                    w="full"
                    borderRadius="md"
                  />
                </VStack>
              </Box>
            )}

            {/* Video Session & Author */}
            <Box p={4} bg="gray.900" borderBottomRadius="md">
              <VStack spacing={2} align="start">
                <Text fontSize="sm" color="gray.300" lineHeight="1.6">
                  {video.videoSession}
                </Text>
                <Text fontSize="xs" color="gray.400">
                  By {video.author}
                </Text>
              </VStack>
            </Box>
          </VStack>
        </ModalBody>
      </ModalContent>
    </Modal>
  )
} 