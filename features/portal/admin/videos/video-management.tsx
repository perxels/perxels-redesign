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

export const VideoManagement = () => {
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

  const handleViewAccess = (video: PortalVideo) => {
    setSelectedVideo(video)
    onAccessOpen()
  }

  const handleEditVideo = (video: PortalVideo) => {
    setSelectedVideo(video)
    onEditOpen()
  }

  const handleToggleStatus = (video: PortalVideo) => {
    setVideoToToggle(video)
    onConfirmOpen()
  }

  const confirmToggleStatus = async () => {
    if (!videoToToggle) return

    try {
      await toggleVideoStatus(videoToToggle.id, !videoToToggle.isActive)
      toast({
        title: 'Status Changed',
        description: `Video "${videoToToggle.title}" is now ${videoToToggle.isActive ? 'inactive' : 'active'}.`,
        status: 'success',
        duration: 3000,
      })
      fetchVideos()
    } catch (error) {
      console.error('Error toggling status:', error)
      toast({
        title: 'Error',
        description: 'Failed to toggle video status',
        status: 'error',
        duration: 3000,
      })
    } finally {
      onConfirmClose()
      setVideoToToggle(null)
    }
  }

  const formatDate = (date: any) => {
    if (!date) return 'Unknown'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
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
    <Box p={6}>
      <VStack spacing={6} align="stretch">
        {/* Header */}
        <Flex justify="space-between" align="center">
          <Box>
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              Video Management
            </Text>
            <Text color="gray.600">
              Manage portal videos and access codes
            </Text>
          </Box>
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
                  <Th>Access Code</Th>
                  <Th>Status</Th>
                  <Th>Views</Th>
                  <Th>Created</Th>
                  <Th>Actions</Th>
                </Tr>
              </Thead>
              <Tbody>
                {filteredVideos.map((video) => (
                  <Tr key={video.id}>
                    <Td>
                      <HStack spacing={3}>
                        <Box
                          w="60px"
                          h="40px"
                          bg="gray.100"
                          borderRadius="md"
                          backgroundImage={`url(${getVideoThumbnail(video)})`}
                          backgroundSize="cover"
                          backgroundPosition="center"
                        />
                        <Box>
                          <Text fontWeight="medium" fontSize="sm">
                            {video.title}
                          </Text>
                          <Text fontSize="xs" color="gray.500" noOfLines={1}>
                            By {video.author}
                          </Text>
                        </Box>
                      </HStack>
                    </Td>
                    <Td>
                      <Text
                        fontFamily="mono"
                        fontWeight="bold"
                        bg="gray.100"
                        px={2}
                        py={1}
                        borderRadius="md"
                        display="inline-block"
                      >
                        {video.accessCode}
                      </Text>
                    </Td>
                    <Td>
                      <Badge
                        colorScheme={video.isActive ? 'green' : 'red'}
                        variant="subtle"
                      >
                        {video.isActive ? 'Active' : 'Inactive'}
                      </Badge>
                    </Td>
                    <Td>
                      <Text fontWeight="medium">{video.viewCount}</Text>
                    </Td>
                    <Td>
                      <Text fontSize="sm" color="gray.600">
                        {formatDate(video.datePosted)}
                      </Text>
                    </Td>
                    <Td>
                      <HStack spacing={1}>
                        <Tooltip label="View Access List">
                          <IconButton
                            aria-label="View access"
                            icon={<FiUsers />}
                            size="sm"
                            variant="outline"
                            onClick={() => handleViewAccess(video)}
                          />
                        </Tooltip>
                        <Tooltip label="Edit Video">
                          <IconButton
                            aria-label="Edit video"
                            icon={<FiEdit />}
                            size="sm"
                            onClick={() => handleEditVideo(video)}
                          />
                        </Tooltip>
                        <Tooltip label={video.isActive ? 'Deactivate' : 'Activate'}>
                          <IconButton
                            aria-label="Toggle status"
                            icon={<FiEye />}
                            size="sm"
                            variant="ghost"
                            colorScheme={video.isActive ? 'red' : 'green'}
                            onClick={() => handleToggleStatus(video)}
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
      </VStack>

      {/* Modals */}
      <CreateVideoModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onVideoCreated={fetchVideos}
      />

      {selectedVideo && (
        <VideoAccessModal
          isOpen={isAccessOpen}
          onClose={onAccessClose}
          video={selectedVideo}
        />
      )}

      {selectedVideo && (
        <EditVideoModal
          isOpen={isEditOpen}
          onClose={onEditClose}
          video={selectedVideo}
          onVideoUpdated={fetchVideos}
        />
      )}

      {/* Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Confirm Status Change</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to {videoToToggle?.isActive ? 'deactivate' : 'activate'} the video &ldquo;{videoToToggle?.title}&rdquo;?
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button
              colorScheme={videoToToggle?.isActive ? 'red' : 'green'}
              onClick={confirmToggleStatus}
            >
              {videoToToggle?.isActive ? 'Deactivate' : 'Activate'}
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
} 