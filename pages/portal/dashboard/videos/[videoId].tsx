import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import {
  Box,
  VStack,
  HStack,
  Text,
  Badge,
  Button,
  Spinner,
  Alert,
  AlertIcon,
  useToast,
  Divider,
  Avatar,
  Textarea,
} from '@chakra-ui/react'
import {
  FiArrowLeft,
  FiEye,
  FiMessageCircle,
  FiClock,
  FiUser,
  FiCalendar,
} from 'react-icons/fi'
import { PortalVideo } from '../../../../types/video.types'
import {
  getVideoById,
  incrementVideoView,
  getVideoComments,
  addComment,
} from '../../../../lib/utils/video.utils'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { VideoPlayerFull } from '../../../../features/portal/dashboard/videos/video-player-full'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { HeaderInfo } from '../../../../features/portal/dashboard/messages/header-info'

interface Comment {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  content: string
  createdAt: Date
}

function VideoWatchPageContent() {
  const router = useRouter()
  const { videoId } = router.query
  const { user, portalUser } = usePortalAuth()
  const toast = useToast()

  const [video, setVideo] = useState<PortalVideo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [submittingComment, setSubmittingComment] = useState(false)
  const [loadingComments, setLoadingComments] = useState(false)

  useEffect(() => {
    if (videoId && typeof videoId === 'string') {
      fetchVideo()
      fetchComments()
    }
  }, [videoId])

  // Track video view after a delay to ensure actual viewing
  useEffect(() => {
    if (!video || !user?.uid) return

    const timer = setTimeout(async () => {
      try {
        await incrementVideoView(video.id, user.uid)
        // Update local state to reflect the view
        setVideo((prev) =>
          prev ? { ...prev, viewCount: (prev.viewCount || 0) + 1 } : null,
        )
      } catch (error) {
        console.error('Error tracking video view:', error)
      }
    }, 10000) // Wait 10 seconds before counting as a view

    return () => clearTimeout(timer)
  }, [video?.id, user?.uid])

  const fetchVideo = async () => {
    if (!videoId || typeof videoId !== 'string') return

    try {
      setLoading(true)
      const videoData = await getVideoById(videoId)
      if (videoData) {
        setVideo(videoData)
      } else {
        setError('Video not found')
      }
    } catch (error) {
      console.error('Error fetching video:', error)
      setError('Failed to load video')
    } finally {
      setLoading(false)
    }
  }

  const fetchComments = async () => {
    if (!videoId || typeof videoId !== 'string') return

    try {
      setLoadingComments(true)
      const commentsData = await getVideoComments(videoId)
      setComments(commentsData)
    } catch (error) {
      console.error('Error fetching comments:', error)
    } finally {
      setLoadingComments(false)
    }
  }

  const handleSubmitComment = async () => {
    if (!user?.uid || !videoId || !newComment.trim()) return

    try {
      setSubmittingComment(true)
      await addComment({
        videoId: videoId as string,
        studentId: user.uid,
        studentName: portalUser?.fullName || 'Anonymous',
        studentEmail: user.email || '',
        content: newComment.trim(),
      })

      setNewComment('')
      toast({
        title: 'Comment posted',
        description: 'Your comment has been added successfully',
        status: 'success',
        duration: 3000,
      })

      // Refresh comments
      fetchComments()
    } catch (error) {
      console.error('Error posting comment:', error)
      toast({
        title: 'Error',
        description: 'Failed to post comment. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSubmittingComment(false)
    }
  }

  const formatDate = (date: any) => {
    try {
      if (date && typeof date === 'object' && date.toDate) {
        return date.toDate().toLocaleDateString()
      }
      if (date instanceof Date) {
        return date.toLocaleDateString()
      }
      if (date) {
        const dateObj = new Date(date)
        if (!isNaN(dateObj.getTime())) {
          return dateObj.toLocaleDateString()
        }
      }
      return 'Date unavailable'
    } catch (error) {
      return 'Date unavailable'
    }
  }

  const formatDuration = (duration?: number) => {
    if (!duration) return '0:00'
    const minutes = Math.floor(duration / 60)
    const seconds = duration % 60
    return `${minutes}:${seconds.toString().padStart(2, '0')}`
  }

  if (loading) {
    return (
      <VStack spacing={4} py={8}>
        <Spinner size="xl" color="purple.500" />
        <Text color="gray.500">Loading video...</Text>
      </VStack>
    )
  }

  if (error || !video) {
    return (
      <VStack spacing={4}>
        <Alert status="error">
          <AlertIcon />
          {error || 'Video not found'}
        </Alert>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="outline"
          onClick={() => router.push('/portal/dashboard/library')}
        >
          Back to Video Library
        </Button>
      </VStack>
    )
  }

  return (
    <VStack spacing={3} align="stretch">
      <Box>
        <Button
          leftIcon={<FiArrowLeft />}
          variant="outline"
          size="md"
          onClick={() => router.push('/portal/dashboard/library')}
        >
          Back
        </Button>
      </Box>
      {/* Video Player */}
      <VideoPlayerFull video={video} studentId={user?.uid || ''} />

      {/* Video Details */}
      <Box bg="white" p={6} borderRadius="lg" w="full">
        <VStack align="start" spacing={4}>
          <HStack justify="space-between" w="full">
            <Text fontSize="2xl" fontWeight="bold" color="gray.800">
              {video.title}
            </Text>
            <VStack align="end" spacing={2}>
              {video.category && (
                <Badge colorScheme="purple" variant="subtle" size="lg">
                  {video.category}
                </Badge>
              )}
              <HStack spacing={4} color="gray.500" fontSize="sm">
                <HStack spacing={1}>
                  <FiEye />
                  <Text>{video.viewCount} views</Text>
                </HStack>
                {video.duration && (
                  <HStack spacing={1}>
                    <FiClock />
                    <Text>{formatDuration(video.duration)}</Text>
                  </HStack>
                )}
              </HStack>
            </VStack>
          </HStack>

          <Text color="gray.600" lineHeight="1.6">
            {video.videoSession}
          </Text>

          <HStack spacing={6} wrap="wrap">
            <HStack spacing={2} color="gray.500">
              <FiUser />
              <Text fontSize="sm">By {video.author}</Text>
            </HStack>
            <HStack spacing={2} color="gray.500">
              <FiCalendar />
              <Text fontSize="sm">Posted {formatDate(video.datePosted)}</Text>
            </HStack>
          </HStack>
        </VStack>
      </Box>

      {/* Comments Section */}
      <Box bg="white" p={6} borderRadius="lg" shadow="sm">
        <VStack align="start" spacing={4}>
          <HStack spacing={2}>
            <FiMessageCircle />
            <Text fontSize="lg" fontWeight="semibold" color="gray.800">
              Comments ({comments.length})
            </Text>
          </HStack>

          {/* Add Comment */}
          <Box w="full">
            <Textarea
              placeholder="Share your thoughts about this video..."
              value={newComment}
              onChange={(e) => setNewComment(e.target.value)}
              rows={3}
              resize="vertical"
            />
            <HStack justify="end" mt={2}>
              <Button
                colorScheme="purple"
                size="sm"
                onClick={handleSubmitComment}
                isLoading={submittingComment}
                loadingText="Posting..."
                isDisabled={!newComment.trim()}
              >
                Post Comment
              </Button>
            </HStack>
          </Box>

          <Divider />

          {/* Comments List */}
          {loadingComments ? (
            <VStack spacing={4} py={8}>
              <Spinner size="md" color="purple.500" />
              <Text color="gray.500">Loading comments...</Text>
            </VStack>
          ) : comments.length === 0 ? (
            <Box textAlign="center" py={8}>
              <Text color="gray.500">
                No comments yet. Be the first to comment!
              </Text>
            </Box>
          ) : (
            <VStack align="start" spacing={4} w="full">
              {comments.map((comment) => (
                <Box
                  key={comment.id}
                  w="full"
                  p={4}
                  bg="gray.50"
                  borderRadius="md"
                >
                  <HStack justify="space-between" mb={2}>
                    <HStack spacing={2}>
                      <Avatar size="sm" name={comment.studentName} />
                      <VStack align="start" spacing={0}>
                        <Text fontSize="sm" fontWeight="medium">
                          {comment.studentName}
                        </Text>
                        <Text fontSize="xs" color="gray.500">
                          {formatDate(comment.createdAt)}
                        </Text>
                      </VStack>
                    </HStack>
                  </HStack>
                  <Text fontSize="sm" color="gray.700">
                    {comment.content}
                  </Text>
                </Box>
              ))}
            </VStack>
          )}
        </VStack>
      </Box>
    </VStack>
  )
}

export default function VideoWatchPage() {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        {/* <HeaderInfo title="Video" /> */}
        <VideoWatchPageContent />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}
