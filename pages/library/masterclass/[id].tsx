import { useRouter } from 'next/router'
import { useEffect, useRef, useState } from 'react'
import { AdminMasterClass } from '../../../utils/types'
import {
  Spinner,
  Center,
  useToast,
  Heading,
  Button,
  VStack,
  Box,
  Image,
  HStack,
  Flex,
  Tooltip,
  IconButton,
  Text,
  Divider,
  SimpleGrid,
  GridItem,
} from '@chakra-ui/react'
import { onAuthStateChanged } from 'firebase/auth'
import { auth } from '../../../firebaseConfig'
import {
  doc,
  updateDoc,
  arrayUnion,
  arrayRemove,
  getDoc,
  getDocs,
  collection,
} from 'firebase/firestore'
import { db } from '../../../firebaseConfig'
import { MainLayout } from '../../../layouts'
import { LibraryLayout } from '../../../features/library'
import VideoPlayer from '../../../features/library/VideoPlayer'
import { AiFillDislike, AiFillLike, AiOutlineDislike, AiOutlineLike } from 'react-icons/ai'
import moment from 'moment'
import MasterclassComments from '../../../features/library/MasterclassComments'

const SingleMasterclassDetail = () => {
  const router = useRouter()
  const { id } = router.query
  const [masterclass, setMasterclass] = useState<AdminMasterClass | null>(null)
  const [nextMasterclass, setNextMasterclass] =
    useState<AdminMasterClass | null>(null)
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

  const handleLike = async () => {
    if (!auth.currentUser || !masterclass || !id) {
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
      const masterclassRef = doc(db, 'adminMasterClasses', id as string)

      if (userLiked) {
        await updateDoc(masterclassRef, {
          likes: arrayRemove(userId),
        })
        setUserLiked(false)
        setLikeCount((prev) => prev - 1)
      } else {
        if (userDisliked) {
          await updateDoc(masterclassRef, {
            likes: arrayUnion(userId),
            dislikes: arrayRemove(userId),
          })
          setUserDisliked(false)
          setDislikeCount((prev) => prev - 1)
        } else {
          await updateDoc(masterclassRef, {
            likes: arrayUnion(userId),
          })
          setUserLiked(true)
          setLikeCount((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error liking masterclass:', error)
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

  const handleDislike = async () => {
    if (!auth.currentUser || !masterclass || !id) {
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
      const masterclassRef = doc(db, 'adminMasterClasses', id as string)

      if (userDisliked) {
        await updateDoc(masterclassRef, {
          dislikes: arrayRemove(userId),
        })
        setUserDisliked(false)
        setDislikeCount((prev) => prev - 1)
      } else {
        if (userLiked) {
          await updateDoc(masterclassRef, {
            dislikes: arrayUnion(userId),
            likes: arrayRemove(userId),
          })
          setUserLiked(false)
          setLikeCount((prev) => prev - 1)
        } else {
          await updateDoc(masterclassRef, {
            dislikes: arrayUnion(userId),
          })
          setUserDisliked(true)
          setDislikeCount((prev) => prev + 1)
        }
      }
    } catch (error) {
      console.error('Error disliking masterclass:', error)
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

  const handleBackToMasterclass = () => {
    router.push('/library/masterclass')
  }

  const handleNextMasterclass = () => {
    if (nextMasterclass) {
      router.push(`/library/masterclass/${nextMasterclass.id}`)
    }
  }

  useEffect(() => {
    const fetchMasterclass = async () => {
      if (!id) return
      setLoading(true)
      try {
        const masterclassRef = doc(db, 'adminMasterClasses', id as string)
        const masterclassSnap = await getDoc(masterclassRef)

        if (masterclassSnap.exists()) {
          const masterclassData = {
            id: masterclassSnap.id,
            ...masterclassSnap.data(),
          } as AdminMasterClass

          setMasterclass(masterclassData)

          // Set like and dislike counts
          const likes = (masterclassData as any).likes || []
          const dislikes = (masterclassData as any).dislikes || []
          setLikeCount(likes.length)
          setDislikeCount(dislikes.length)

          // Check if current user has liked or disliked
          if (auth.currentUser) {
            const userId = auth.currentUser.uid
            setUserLiked(likes.includes(userId))
            setUserDisliked(dislikes.includes(userId))
          }

          // Fetch all masterclasses to find next masterclass
          const allMasterclasses = await getDocs(
            collection(db, 'adminMasterClasses'),
          )
          const masterclasses = allMasterclasses.docs.map((doc) => ({
            id: doc.id,
            ...doc.data(),
          })) as AdminMasterClass[]

          // Find next masterclass
          const currentIndex = masterclasses.findIndex(
            (masterclass) => masterclass.id === id,
          )

          if (currentIndex !== -1 && currentIndex < masterclasses.length - 1) {
            setNextMasterclass(masterclasses[currentIndex + 1])
          }
        }
      } catch (error) {
        console.error('Error fetching masterclass:', error)
        setError('Failed to load masterclass')
      } finally {
        setLoading(false)
      }
    }

    fetchMasterclass()
  }, [id])

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

  if (error || !masterclass) {
    return (
      <MainLayout>
        <LibraryLayout>
          <Center h="50vh" flexDirection="column" gap={4}>
            <Heading size="lg" color="red.500">
              {error || 'Video not found'}
            </Heading>
            <Button onClick={handleBackToMasterclass} colorScheme="yellow">
              Back to Masterclasses
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
                    videoUrl={masterclass.url}
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
                      masterclass.bannerImage ||
                      '/assets/images/library/videoImage.png'
                    }
                    alt={masterclass.title}
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
                  {masterclass.firstTag}
                </Center>
                {masterclass.secondTag && (
                <Center
                  borderRadius="16px"
                  color="#171717"
                  border="1px solid #E8E8E8"
                  display="inline-flex"
                  p="6px 10px"
                >
                    {masterclass.secondTag}
                  </Center>
                )}
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
              {masterclass.title}
            </Heading>

            <HStack spacing={2} color="gray.600">
              <Text fontWeight="bold">By Perxels</Text>
              <Text>•</Text>
              <Text>{moment(masterclass.datePosted).format('MMMM D, YYYY')}</Text>
            </HStack>
          </VStack>

          {/* Video Comments and reply */}
          <Box mt={2} width="100%">
            <Divider mb={6} />
            <MasterclassComments masterclassId={id as string} />
          </Box>

          {/* Next Video Section */}
          {nextMasterclass && (
            <Box mt={8}>
              <Divider mb={6} />
              <VStack align="stretch" spacing={4}>
                <Heading size="md">Next Video</Heading>
                <Box
                  as="button"
                  onClick={handleNextMasterclass}
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
                        src={nextMasterclass.bannerImage || '/assets/images/library/videoImage.png'}
                        alt={nextMasterclass.title}
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
                        <Heading textAlign="left" size="md">{nextMasterclass.title}</Heading>
                        <Text color="gray.600">By Perxels</Text>
                        <Text color="gray.500">
                          {moment(nextMasterclass.datePosted).format('MMMM D, YYYY')}
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

export default SingleMasterclassDetail
