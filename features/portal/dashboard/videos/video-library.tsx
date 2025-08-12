import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  Button,
  Input,
  Text,
  VStack,
  HStack,
  SimpleGrid,
  useToast,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Spinner,
  FormControl,
  FormLabel,
} from '@chakra-ui/react'
import { FiLock } from 'react-icons/fi'
import { MdSchool } from 'react-icons/md'
import { PortalVideo } from '../../../../types/video.types'
import {
  getAllVideosWithAccessStatus,
  grantVideoAccess,
} from '../../../../lib/utils/video.utils'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { VideoCard } from './video-card'

export const VideoLibrary = () => {
  const router = useRouter()
  const [videos, setVideos] = useState<
    Array<PortalVideo & { hasAccess: boolean }>
  >([])
  const [loading, setLoading] = useState(true)
  const [accessCode, setAccessCode] = useState('')
  const [grantingAccess, setGrantingAccess] = useState(false)
  const [videoToUnlock, setVideoToUnlock] = useState<PortalVideo | null>(null)

  const {
    isOpen: isCodeModalOpen,
    onOpen: onCodeModalOpen,
    onClose: onCodeModalClose,
  } = useDisclosure()

  const { user } = usePortalAuth()
  const toast = useToast()

  const fetchVideos = async () => {
    if (!user?.uid) return

    try {
      setLoading(true)
      const videoData = await getAllVideosWithAccessStatus(user.uid)
      setVideos(videoData)
    } catch (error) {
      console.error('Error fetching videos:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch videos',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchVideos()
  }, [user?.uid])

  const handleGrantAccess = async () => {
    if (!user?.uid || !accessCode.trim()) {
      toast({
        title: 'Error',
        description: 'Please enter an access code',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setGrantingAccess(true)
    try {
      const result = await grantVideoAccess({
        videoId: '', // Will be determined by access code
        studentId: user.uid,
        accessCode: accessCode.trim().toUpperCase(),
      })

      if (result.success) {
        toast({
          title: 'Success! 🎉',
          description: result.message,
          status: 'success',
          duration: 5000,
        })
        setAccessCode('')
        onCodeModalClose()
        fetchVideos() // Refresh the video list
      } else {
        toast({
          title: 'Access Denied',
          description: result.error,
          status: 'error',
          duration: 5000,
        })
      }
    } catch (error) {
      console.error('Error granting access:', error)
      toast({
        title: 'Error',
        description: 'An error occurred. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setGrantingAccess(false)
    }
  }

  const handleVideoSelect = (video: PortalVideo) => {
    router.push(`/portal/dashboard/videos/${video.id}`)
  }

  const handleUnlockVideo = (video: PortalVideo) => {
    setVideoToUnlock(video)
    onCodeModalOpen()
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (e.key === 'Enter') {
      handleGrantAccess()
    }
  }

  const getStats = () => {
    const totalVideos = videos.length
    const unlockedVideos = videos.filter((v) => v.hasAccess).length
    const lockedVideos = totalVideos - unlockedVideos
    const categories = new Set(videos.map((v) => v.category).filter(Boolean))
      .size

    return { totalVideos, unlockedVideos, lockedVideos, categories }
  }

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" color="purple.500" />
        <Text color="gray.500">Loading video library...</Text>
      </VStack>
    )
  }

  const stats = getStats()

  return (
    <Box>
      <VStack spacing={6} align="stretch">
        {/* Stats */}
        {videos.length > 0 && (
          <VStack spacing={4} align="stretch">
            <HStack spacing={6} flexWrap="wrap">
              <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
                <Text fontSize="sm" color="gray.500">
                  Total Videos
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="purple.600">
                  {stats.totalVideos}
                </Text>
              </Box>
              <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
                <Text fontSize="sm" color="gray.500">
                  Unlocked
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="green.600">
                  {stats.unlockedVideos}
                </Text>
              </Box>
              <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
                <Text fontSize="sm" color="gray.500">
                  Locked
                </Text>
                <Text fontSize="2xl" fontWeight="bold" color="orange.600">
                  {stats.lockedVideos}
                </Text>
              </Box>

              <Button
                colorScheme="purple"
                size="lg"
                onClick={() => router.push('/portal/dashboard/syllabus')}
                leftIcon={<MdSchool />}
                ml={{ base: 0, md: 8 }}
              >
                View Syllabus
              </Button>
            </HStack>
          </VStack>
        )}

        {/* Video Grid */}
        {videos.length === 0 ? (
          <Box textAlign="center" py={12}>
            <FiLock size={48} color="#E2E8F0" />
            <Text fontSize="xl" color="gray.500" mt={4} mb={2}>
              No videos available yet
            </Text>
            <Text color="gray.400" mb={6}>
              Videos will appear here once they are added by your instructors
            </Text>
          </Box>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={6}>
            {videos.map((video) => (
              <VideoCard
                key={video.id}
                video={video}
                onPlay={() => handleVideoSelect(video)}
                onUnlock={() => handleUnlockVideo(video)}
              />
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* Access Code Modal */}
      <Modal isOpen={isCodeModalOpen} onClose={onCodeModalClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {videoToUnlock
              ? `Unlock: ${videoToUnlock.title}`
              : 'Enter Access Code'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4}>
              <FormControl>
                <FormLabel>Access Code</FormLabel>
                <Input
                  placeholder="Enter code (e.g., ABC123)"
                  value={accessCode}
                  onChange={(e) => setAccessCode(e.target.value.toUpperCase())}
                  onKeyPress={handleKeyPress}
                  textAlign="center"
                  fontSize="lg"
                  letterSpacing="0.1em"
                  fontFamily="mono"
                  maxLength={6}
                />
                <Text fontSize="xs" color="gray.500" mt={1}>
                  Code should be 6 characters (letters and numbers)
                </Text>
              </FormControl>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onCodeModalClose}>
              Cancel
            </Button>
            <Button
              colorScheme="purple"
              onClick={handleGrantAccess}
              isLoading={grantingAccess}
              loadingText="Checking code..."
              isDisabled={accessCode.length < 3}
            >
              {videoToUnlock ? 'Unlock Video' : 'Access Video'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
