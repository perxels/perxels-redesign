import React, { useEffect, useRef, useState } from 'react'
import { useRouter } from 'next/router'
import {
  doc,
  getDoc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  setDoc,
  collection,
  getDocs,
} from 'firebase/firestore'
import { db, auth } from '../../../firebaseConfig'
import { Video } from '../../../utils/types'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import { onAuthStateChanged } from 'firebase/auth'
import {
  Box,
  Heading,
  Text,
  VStack,
  HStack,
  Image,
  Flex,
  Spinner,
  Center,
  Button,
  Divider,
  useToast,
  IconButton,
  Tooltip,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react'
import {
  AiOutlineLike,
  AiOutlineDislike,
  AiFillLike,
  AiFillDislike,
} from 'react-icons/ai'
import VideoPlayer from '../../../features/library/VideoPlayer'
import VideoComments from '../../../features/library/VideoComments'
import moment from 'moment'

// Interface for video with likes and dislikes
interface VideoWithInteractions extends Video {
  likes?: string[]
  dislikes?: string[]
}

const SingleVideoDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [video, setVideo] = useState<VideoWithInteractions | null>(null)
  const [nextVideo, setNextVideo] = useState<VideoWithInteractions | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState('')
  const [isPlaying, setIsPlaying] = useState(false)
  const [likeCount, setLikeCount] = useState(0)
  const [dislikeCount, setDislikeCount] = useState(0)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [interactionLoading, setInteractionLoading] = useState(false)
  const toast = useToast()

  const targetRef = useRef<HTMLDivElement | null>(null)

  // Check authentication
  useEffect(() => {
    const unsubscribe = onAuthStateChanged(auth, (user) => {
      if (!user) {
        router.push('/library/login') // redirect to login if not authenticated
      }
    })

    return () => unsubscribe() // cleanup
  }, [router])

  // eslint-disable-next-line react-hooks/rules-of-hooks
  useEffect(() => {
    if (targetRef.current) {
      const topOffset = 100 // Offset for the navbar
      const elementPosition =
        targetRef.current.getBoundingClientRect().top + window.pageYOffset
      const offsetPosition = elementPosition - topOffset

      window.scrollTo({
        top: offsetPosition,
      })
    }
  }, [])

  // Handle like action
  const handleLike = async () => {
    if (!auth.currentUser || !video || !id) {
      toast({
        title: 'Please log in to like videos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setInteractionLoading(true)
    try {
      const userId = auth.currentUser.uid
      const videoRef = doc(db, 'libraryVideos', id as string)

      if (userLiked) {
        // User already liked, so remove the like
        await updateDoc(videoRef, {
          likes: arrayRemove(userId),
        })
        setUserLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        // Add like and remove dislike if exists
        if (userDisliked) {
          await updateDoc(videoRef, {
            likes: arrayUnion(userId),
            dislikes: arrayRemove(userId),
          })
          setUserDisliked(false)
          setDislikeCount((prev) => prev - 1)
        } else {
          await updateDoc(videoRef, {
            likes: arrayUnion(userId),
          })
        }
        setUserLiked(true)
        setLikeCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error updating like:', error)
      toast({
        title: 'Error',
        description: 'Failed to update like status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setInteractionLoading(false)
    }
  }

  // Handle dislike action
  const handleDislike = async () => {
    if (!auth.currentUser || !video || !id) {
      toast({
        title: 'Please log in to dislike videos',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setInteractionLoading(true)
    try {
      const userId = auth.currentUser.uid
      const videoRef = doc(db, 'libraryVideos', id as string)

      if (userDisliked) {
        // User already disliked, so remove the dislike
        await updateDoc(videoRef, {
          dislikes: arrayRemove(userId),
        })
        setUserDisliked(false)
        setDislikeCount((prev) => prev - 1)
      } else {
        // Add dislike and remove like if exists
        if (userLiked) {
          await updateDoc(videoRef, {
            dislikes: arrayUnion(userId),
            likes: arrayRemove(userId),
          })
          setUserLiked(false)
          setLikeCount((prev) => prev - 1)
        } else {
          await updateDoc(videoRef, {
            dislikes: arrayUnion(userId),
          })
        }
        setUserDisliked(true)
        setDislikeCount((prev) => prev + 1)
      }
    } catch (error) {
      console.error('Error updating dislike:', error)
      toast({
        title: 'Error',
        description: 'Failed to update dislike status',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setInteractionLoading(false)
    }
  }

  // Fetch video data and next video
  useEffect(() => {
    const fetchVideos = async () => {
      if (!id) return

      setLoading(true)
      try {
        // Fetch current video
        const videoRef = doc(db, 'libraryVideos', id as string)
        const videoSnap = await getDoc(videoRef)

        if (videoSnap.exists()) {
          const videoData = {
            id: videoSnap.id,
            ...videoSnap.data(),
          } as VideoWithInteractions

          setVideo(videoData)

          // Set like and dislike counts
          const likes = videoData.likes || []
          const dislikes = videoData.dislikes || []
          setLikeCount(likes.length)
          setDislikeCount(dislikes.length)

          // Check if current user has liked or disliked
          if (auth.currentUser) {
            const userId = auth.currentUser.uid
            setUserLiked(likes.includes(userId))
            setUserDisliked(dislikes.includes(userId))
          }

          // Fetch all videos to find next video
          const videosRef = collection(db, 'libraryVideos')
          const videosSnap = await getDocs(videosRef)
          const allVideos = videosSnap.docs.map(doc => ({
            id: doc.id,
            ...doc.data()
          })) as VideoWithInteractions[]

          // Sort videos by order
          const sortedVideos = allVideos.sort((a, b) => {
            if (a.order === undefined && b.order === undefined) return 0
            if (a.order === undefined) return 1
            if (b.order === undefined) return -1
            return a.order - b.order
          })

          // Find current video index
          const currentIndex = sortedVideos.findIndex(v => v.id === id)
          
          // Get next video if exists
          if (currentIndex !== -1 && currentIndex < sortedVideos.length - 1) {
            setNextVideo(sortedVideos[currentIndex + 1])
          }
        } else {
          setError('Video not found')
          toast({
            title: 'Video not found',
            description: 'The requested video could not be found',
            status: 'error',
            duration: 5000,
            isClosable: true,
          })
        }
      } catch (err) {
        console.error('Error fetching video:', err)
        setError('Failed to load video')
        toast({
          title: 'Error',
          description: 'Failed to load video details',
          status: 'error',
          duration: 5000,
          isClosable: true,
        })
      } finally {
        setLoading(false)
      }
    }

    fetchVideos()
  }, [id, toast])

  const handleBackToVideos = () => {
    router.push('/library/videos')
  }

  const handleNextVideo = () => {
    if (nextVideo) {
      router.push(`/library/videos/${nextVideo.id}`)
    }
  }

  if (loading) {
    return (
      <MainLayout>
        <LibraryLayout>
          <Center h="50vh">
            <Spinner size="xl" color="brand.yellow.500" thickness="4px" />
          </Center>
        </LibraryLayout>
      </MainLayout>
    )
  }

  if (error || !video) {
    return (
      <MainLayout>
        <LibraryLayout>
          <Center h="50vh" flexDirection="column" gap={4}>
            <Heading size="lg" color="red.500">
              {error || 'Video not found'}
            </Heading>
            <Button onClick={handleBackToVideos} colorScheme="yellow">
              Back to Videos
            </Button>
          </Center>
        </LibraryLayout>
      </MainLayout>
    )
  }

  return (
    <MainLayout>
      <LibraryLayout>
        <VStack ref={targetRef} spacing={8} align="stretch" py={8}>
          {/* Video Player Section */}
          <Box
            position="relative"
            width="100%"
            height="auto"
            bg="black"
            borderRadius="md"
            overflow="hidden"
          >
            {isPlaying ? (
              <Box height="0" paddingBottom="56.25%" position="relative">
                {' '}
                {/* 16:9 aspect ratio */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                >
                  <VideoPlayer
                    videoUrl={video.videoUrl}
                    onEnd={() => setIsPlaying(false)}
                    height="100%"
                  />
                </Box>
              </Box>
            ) : (
              <Box position="relative" width="100%" paddingBottom="56.25%">
                {' '}
                {/* 16:9 aspect ratio */}
                <Box
                  position="absolute"
                  top="0"
                  left="0"
                  width="100%"
                  height="100%"
                >
                  <Image
                    src={
                      video.imageUrl || '/assets/images/library/videoImage.png'
                    }
                    alt={video.videoTitle}
                    objectFit="cover"
                    width="100%"
                    height="100%"
                    borderRadius="md"
                  />
                  <Center
                    position="absolute"
                    top="0"
                    left="0"
                    width="100%"
                    height="100%"
                    bg="rgba(0,0,0,0.3)"
                    borderRadius="md"
                  >
                    <Image
                      src="/assets/images/library/playIcon.svg"
                      alt="Play"
                      cursor="pointer"
                      onClick={() => setIsPlaying(true)}
                      width="80px"
                      height="80px"
                    />
                  </Center>
                </Box>
              </Box>
            )}
          </Box>

          {/* Video Details */}
          <VStack align="flex-start" spacing={4}>
            <HStack justifyContent="space-between" w="full">
              <Flex columnGap="8px">
                <Center
                  borderRadius="16px"
                  color="#FFF"
                  backgroundColor="#339966"
                  border="1px solid #E8E8E8"
                  display="inline-flex"
                  p="4px 16px"
                >
                  NEW
                </Center>
                <Center
                  borderRadius="16px"
                  color="#171717"
                  border="1px solid #E8E8E8"
                  display="inline-flex"
                  p="6px 10px"
                >
                  {video.videoSession}
                </Center>
              </Flex>

              <HStack spacing={2}>
                <Tooltip label={userLiked ? 'Unlike' : 'Like'}>
                  <IconButton
                    aria-label="Like video"
                    icon={
                      userLiked ? (
                        <AiFillLike size="20px" />
                      ) : (
                        <AiOutlineLike size="20px" />
                      )
                    }
                    onClick={handleLike}
                    isLoading={interactionLoading}
                    variant="ghost"
                    bg="transparent"
                    colorScheme={userLiked ? 'primary' : 'gray'}
                  />
                </Tooltip>
                <Text fontWeight="bold" minW="30px">
                  {likeCount > 0 ? likeCount : ''}
                </Text>

                <Tooltip label={userDisliked ? 'Remove dislike' : 'Dislike'}>
                  <IconButton
                    aria-label="Dislike video"
                    icon={
                      userDisliked ? (
                        <AiFillDislike size="20px" />
                      ) : (
                        <AiOutlineDislike size="20px" />
                      )
                    }
                    onClick={handleDislike}
                    isLoading={interactionLoading}
                    variant="ghost"
                    bg="transparent"
                    colorScheme={userDisliked ? 'primary' : 'gray'}
                  />
                </Tooltip>
              </HStack>
            </HStack>

            <Heading as="h1" size="xl">
              {video.videoTitle}
            </Heading>

            <HStack spacing={2} color="gray.600">
              <Text fontWeight="bold">By {video.author}</Text>
              <Text>•</Text>
              <Text>{moment(video.datePosted).format('MMMM D, YYYY')}</Text>
            </HStack>
          </VStack>

          {/* Video Comments and reply */}
          <Box mt={2} width="100%">
            <Divider mb={6} />
            <VideoComments videoId={id as string} />
          </Box>

          {/* Next Video Section */}
          {nextVideo && (
            <Box mt={8}>
              <Divider mb={6} />
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Next Video</Heading>
                <Box
                  as="button"
                  onClick={handleNextVideo}
                  cursor="pointer"
                  _hover={{ transform: 'scale(1.02)' }}
                  transition="transform 0.2s"
                >
                  <SimpleGrid columns={[4]} spacing={4}>
                    <GridItem colSpan={[2, 1]}>
                    <Box
                      position="relative"
                      width="100%"
                      paddingBottom="56.25%"
                      borderRadius="md"
                      overflow="hidden"
                    >
                      <Image
                        src={nextVideo.imageUrl || '/assets/images/library/videoImage.png'}
                        alt={nextVideo.videoTitle}
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        objectFit="cover"
                      />
                      <Center
                        position="absolute"
                        top="0"
                        left="0"
                        width="100%"
                        height="100%"
                        bg="rgba(0,0,0,0.3)"
                      >
                        <Image
                          src="/assets/images/library/playIcon.svg"
                          alt="Play"
                          width="60px"
                          height="60px"
                        />
                      </Center>
                    </Box>
                    </GridItem>
                    <GridItem colSpan={[2, 3]}>
                      <VStack align="flex-start" spacing={2}>
                        <Heading textAlign="left" size="md">{nextVideo.videoTitle}</Heading>
                        <Text color="gray.600">By {nextVideo.author}</Text>
                        <Text color="gray.500">
                          {moment(nextVideo.datePosted).format('MMMM D, YYYY')}
                        </Text>
                      </VStack>
                    </GridItem>
                  </SimpleGrid>
                </Box>
              </VStack>
            </Box>
          )}
        </VStack>
      </LibraryLayout>
    </MainLayout>
  )
}

export default SingleVideoDetail
