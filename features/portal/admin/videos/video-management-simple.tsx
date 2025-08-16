import React, { useEffect, useState } from 'react'
import {
  Box,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Text,
  Badge,
  HStack,
  VStack,
  Spinner,
  useDisclosure,
  IconButton,
  Tooltip,
  useToast,
  Alert,
  AlertIcon,
  Input,
  Select,
  Flex,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { FiPlus, FiEdit, FiEye, FiTrash2, FiUsers, FiPlay } from 'react-icons/fi'
import { PortalVideo } from '../../../../types/video.types'
import { getAllVideos, updateVideo, toggleVideoStatus } from '../../../../lib/utils/video.utils'
import { CreateVideoModal } from './create-video-modal'
import { VideoAccessModal } from './video-access-modal'
import { EditVideoModal } from './edit-video-modal'

export const VideoManagementSimple = () => {
  const [videos, setVideos] = useState<PortalVideo[]>([])
  const [filteredVideos, setFilteredVideos] = useState<PortalVideo[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<'all' | 'active' | 'inactive'>('all')
  const [selectedVideo, setSelectedVideo] = useState<PortalVideo | null>(null)
  const [videoToToggle, setVideoToToggle] = useState<PortalVideo | null>(null)
  
  const { isOpen: isCreateOpen, onOpen: onCreateOpen, onClose: onCreateClose } = useDisclosure()
  const { isOpen: isAccessOpen, onOpen: onAccessOpen, onClose: onAccessClose } = useDisclosure()
  const { isOpen: isEditOpen, onOpen: onEditOpen, onClose: onEditClose } = useDisclosure()
  const { isOpen: isConfirmOpen, onOpen: onConfirmOpen, onClose: onConfirmClose } = useDisclosure()
  
  const toast = useToast()

  const fetchVideos = async () => {
    try {
      setLoading(true)
      const videoData = await getAllVideos()
      setVideos(videoData)
      setFilteredVideos(videoData)
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
  }, [])

  // Filter videos based on search and status
  useEffect(() => {
    let filtered = videos

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(video =>
        video.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.videoSession.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
        video.accessCode.toLowerCase().includes(searchTerm.toLowerCase())
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter(video => 
        statusFilter === 'active' ? video.isActive : !video.isActive
      )
    }

    setFilteredVideos(filtered)
  }, [videos, searchTerm, statusFilter])

  const handleToggleStatus = async (video: PortalVideo) => {
    try {
      await toggleVideoStatus(video.id, !video.isActive)
      toast({
        title: 'Status Updated',
        description: `Video ${video.isActive ? 'deactivated' : 'activated'} successfully`,
        status: 'success',
        duration: 3000,
      })
      fetchVideos()
    } catch (error) {
      console.error('Error toggling video status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update video status',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteVideo = async () => {
    if (!videoToToggle) return

    try {
      await updateVideo(videoToToggle.id, { isActive: false })
      toast({
        title: 'Video Deleted',
        description: 'Video has been deleted successfully',
        status: 'success',
        duration: 3000,
      })
      fetchVideos()
      onConfirmClose()
    } catch (error) {
      console.error('Error deleting video:', error)
      toast({
        title: 'Error',
        description: 'Failed to delete video',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const getVideoThumbnail = (video: PortalVideo) => {
    // Use custom video image if provided
    if (video.videoImage) {
      return video.videoImage
    }
    
    // Extract YouTube thumbnail if it's a YouTube URL
    const youtubeMatch = video.videoUrl.match(/(?:youtube\.com\/watch\?v=|youtu\.be\/)([^&\n?#]+)/)
    if (youtubeMatch) {
      return `https://img.youtube.com/vi/${youtubeMatch[1]}/mqdefault.jpg`
    }
    return '/assets/images/video-placeholder.png' // Default placeholder
  }

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" color="purple.500" />
        <Text>Loading videos...</Text>
      </VStack>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header with Create Button */}
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Video Management
          </Text>
          <Text color="gray.600" fontSize="sm">
            Manage portal videos and access codes
          </Text>
        </VStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="purple"
          onClick={onCreateOpen}
        >
          Create Video
        </Button>
      </Flex>

      {/* Stats */}
      <HStack spacing={6}>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
          <Text fontSize="sm" color="gray.500">Total Videos</Text>
          <Text fontSize="2xl" fontWeight="bold" color="purple.600">
            {videos.length}
          </Text>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
          <Text fontSize="sm" color="gray.500">Active Videos</Text>
          <Text fontSize="2xl" fontWeight="bold" color="green.600">
            {videos.filter(v => v.isActive).length}
          </Text>
        </Box>
        <Box bg="white" p={4} borderRadius="lg" shadow="sm" minW="150px">
          <Text fontSize="sm" color="gray.500">Total Views</Text>
          <Text fontSize="2xl" fontWeight="bold" color="blue.600">
            {videos.reduce((total, video) => total + video.viewCount, 0)}
          </Text>
        </Box>
      </HStack>

      {/* Filters */}
      <HStack spacing={4} bg="white" p={4} borderRadius="lg" shadow="sm">
        <Input
          placeholder="Search videos..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
        <Select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value as any)}
          maxW="150px"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </HStack>

      {/* Videos Table */}
      <Box bg="white" borderRadius="lg" shadow="sm" overflow="hidden">
        {filteredVideos.length === 0 ? (
          <Box p={8} textAlign="center">
            <Text color="gray.500" fontSize="lg">
              {videos.length === 0 ? 'No videos created yet' : 'No videos match your filters'}
            </Text>
            {videos.length === 0 && (
              <Button
                mt={4}
                colorScheme="purple"
                leftIcon={<FiPlus />}
                onClick={onCreateOpen}
              >
                Create Your First Video
              </Button>
            )}
          </Box>
        ) : (
          <Table variant="simple">
            <Thead bg="gray.50">
              <Tr>
                <Th>Video</Th>
                <Th>Session</Th>
                <Th>Access Code</Th>
                <Th>Views</Th>
                <Th>Status</Th>
                <Th>Actions</Th>
              </Tr>
            </Thead>
            <Tbody>
              {filteredVideos.map((video) => (
                <Tr key={video.id} _hover={{ bg: 'gray.50' }}>
                  <Td>
                    <HStack spacing={3}>
                      <Box
                        w="60px"
                        h="40px"
                        borderRadius="md"
                        overflow="hidden"
                        bg="gray.200"
                        position="relative"
                      >
                        <img
                          src={getVideoThumbnail(video)}
                          alt={video.title}
                          style={{
                            width: '100%',
                            height: '100%',
                            objectFit: 'cover',
                          }}
                        />
                        <Box
                          position="absolute"
                          top="50%"
                          left="50%"
                          transform="translate(-50%, -50%)"
                          bg="rgba(0,0,0,0.7)"
                          borderRadius="full"
                          p={1}
                        >
                          <FiPlay size={12} color="white" />
                        </Box>
                      </Box>
                      <VStack align="start" spacing={1}>
                        <Text fontWeight="medium" fontSize="sm">
                          {video.title}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {video.author}
                        </Text>
                      </VStack>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme="blue" variant="subtle">
                      {video.videoSession}
                    </Badge>
                  </Td>
                  <Td>
                    <Badge colorScheme="purple" variant="outline" fontFamily="mono">
                      {video.accessCode}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={1}>
                      <FiPlay />
                      <Text>{video.viewCount}</Text>
                    </HStack>
                  </Td>
                  <Td>
                    <Badge colorScheme={video.isActive ? 'green' : 'red'} variant="subtle">
                      {video.isActive ? 'Active' : 'Inactive'}
                    </Badge>
                  </Td>
                  <Td>
                    <HStack spacing={2}>
                      <Tooltip label="View Access">
                        <IconButton
                          aria-label="View access"
                          icon={<FiUsers />}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVideo(video)
                            onAccessOpen()
                          }}
                        />
                      </Tooltip>
                      <Tooltip label="Edit Video">
                        <IconButton
                          aria-label="Edit video"
                          icon={<FiEdit />}
                          size="sm"
                          variant="outline"
                          onClick={() => {
                            setSelectedVideo(video)
                            onEditOpen()
                          }}
                        />
                      </Tooltip>
                      <Tooltip label={video.isActive ? 'Deactivate' : 'Activate'}>
                        <IconButton
                          aria-label="Toggle status"
                          icon={<FiEye />}
                          size="sm"
                          variant="ghost"
                          colorScheme={video.isActive ? 'orange' : 'green'}
                          onClick={() => handleToggleStatus(video)}
                        />
                      </Tooltip>
                      <Tooltip label="Delete Video">
                        <IconButton
                          aria-label="Delete video"
                          icon={<FiTrash2 />}
                          size="sm"
                          variant="ghost"
                          colorScheme="red"
                          onClick={() => {
                            setVideoToToggle(video)
                            onConfirmOpen()
                          }}
                        />
                      </Tooltip>
                    </HStack>
                  </Td>
                </Tr>
              ))}
            </Tbody>
          </Table>
        )}
      </Box>

      {/* Modals */}
      <CreateVideoModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onVideoCreated={fetchVideos}
      />

      {selectedVideo && (
        <>
          <VideoAccessModal
            isOpen={isAccessOpen}
            onClose={onAccessClose}
            video={selectedVideo}
          />
          <EditVideoModal
            isOpen={isEditOpen}
            onClose={onEditClose}
            video={selectedVideo}
            onVideoUpdated={fetchVideos}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Video</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete &quot;{videoToToggle?.title}&quot;? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteVideo}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
