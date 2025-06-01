import React, { useEffect, useState } from 'react'
import {
  Box,
  Text,
  Heading,
  Image,
  Center,
  Flex,
  useDisclosure,
  Button,
  useToast,
  Tooltip,
  IconButton,
} from '@chakra-ui/react'
import { libraryCardContentProps } from '../../constant'
import LibraryPdfModal from '../../components/LibraryPdfModal'
import { auth, db } from '../../firebaseConfig'
import { arrayRemove, arrayUnion, doc, onSnapshot, updateDoc } from 'firebase/firestore'
import {
  AiFillDislike,
  AiFillLike,
  AiOutlineDislike,
  AiOutlineLike,
} from 'react-icons/ai'

interface PdfWithInteractions extends libraryCardContentProps {
  likes?: string[]
  dislikes?: string[]
  id?: string
}

export const PdfCards: React.FC<PdfWithInteractions> = ({
  bannerImage,
  mainTitle,
  subTitle,
  tag,
  role,
  url,
  data,
  dataChanged,
  setDataChanged,
  likes = [],
  dislikes = [],
  id,
}) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  const [isLoading, setIsLoading] = useState(false)
  const [likeCount, setLikeCount] = useState(likes?.length || 0)
  const [dislikeCount, setDislikeCount] = useState(dislikes?.length || 0)
  const [userLiked, setUserLiked] = useState(false)
  const [userDisliked, setUserDisliked] = useState(false)
  const [interactionLoading, setInteractionLoading] = useState(false)
  const toast = useToast()

  // Set up real-time listener for this PDF's likes and dislikes
  useEffect(() => {
    if (!id) return

    const pdfRef = doc(db, 'libraryPDFs', id)
    const unsubscribe = onSnapshot(pdfRef, (doc) => {
      if (doc.exists()) {
        const data = doc.data()
        const likes = data.likes || []
        const dislikes = data.dislikes || []
        
        setLikeCount(likes.length)
        setDislikeCount(dislikes.length)
        
        if (auth.currentUser) {
          setUserLiked(likes.includes(auth.currentUser.uid))
          setUserDisliked(dislikes.includes(auth.currentUser.uid))
        }
      }
    }, (error) => {
      console.error('Error listening to PDF updates:', error)
    })

    return () => unsubscribe()
  }, [id])

  const handlePdfDownload = (pdfUrl: string) => {
    setIsLoading(true)
    const url = pdfUrl
    fetch(url)
      .then((response) => response.blob())
      .then((blob) => {
        const url = window.URL.createObjectURL(new Blob([blob]))
        const a = document.createElement('a')
        a.href = url
        a.download = `${mainTitle}.pdf`
        document.body.appendChild(a)
        a.click()
        a.remove()
        onClose()
        setIsLoading(false)
      })
      .catch((error) => {
        setIsLoading(false)
        console.error('Error downloading PDF:', error)
      })
  }

  const handleLike = async () => {
    if (!auth.currentUser || !id) {
      toast({
        title: 'Please log in to like PDFs',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setInteractionLoading(true)
    try {
      const userId = auth.currentUser.uid
      const pdfRef = doc(db, 'libraryPDFs', id)

      if (userLiked) {
        await updateDoc(pdfRef, {
          likes: arrayRemove(userId),
        })
      } else {
        if (userDisliked) {
          await updateDoc(pdfRef, {
            likes: arrayUnion(userId),
            dislikes: arrayRemove(userId),
          })
        } else {
          await updateDoc(pdfRef, {
            likes: arrayUnion(userId),
          })
        }
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

  const handleDislike = async () => {
    if (!auth.currentUser || !id) {
      toast({
        title: 'Please log in to dislike PDFs',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setInteractionLoading(true)
    try {
      const userId = auth.currentUser.uid
      const pdfRef = doc(db, 'libraryPDFs', id)

      if (userDisliked) {
        await updateDoc(pdfRef, {
          dislikes: arrayRemove(userId),
        })
      } else {
        if (userLiked) {
          await updateDoc(pdfRef, {
            dislikes: arrayUnion(userId),
            likes: arrayRemove(userId),
          })
        } else {
          await updateDoc(pdfRef, {
            dislikes: arrayUnion(userId),
          })
        }
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

  return (
    <Box
      display="flex"
      position="relative"
      flexDir="column"
      alignItems="flex-start"
      borderRadius="10px"
    >
      <Box maxHeight="253px" width="100%" position="relative">
        <Image
          height="100%"
          width="100%"
          borderRadius={'8px 8px 0px 0px'}
          objectFit={'cover'}
          src={
            bannerImage
              ? bannerImage
              : './assets/images/library/libraryImage1.png'
          }
          alt="libraryCard1"
        />
      </Box>
      <Box
        borderRadius={'0px 0px 8px 8px'}
        position="relative"
        p="16px 24px"
        width="100%"
        bgColor="rgba(246, 246, 246, 0.65);"
      >
        <Flex justifyContent="space-between" alignItems="center" mb="1rem">
          <Center
            borderRadius={'16px'}
            color="#171717"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 10px"
          >
            {tag}
          </Center>

          <Flex gap={4} alignItems="center">
            {/* Like button */}
            <Flex alignItems="center">
              <Tooltip label={userLiked ? 'Unlike' : 'Like'}>
                <IconButton
                  aria-label="Like"
                  icon={userLiked ? <AiFillLike /> : <AiOutlineLike />}
                  onClick={handleLike}
                  isLoading={interactionLoading}
                  variant="ghost"
                  colorScheme={userLiked ? 'primary' : 'gray'}
                  size="lg"
                  cursor="pointer"
                  bgColor="transparent"
                />
              </Tooltip>
              <Text fontSize="sm" ml={1}>
                {likeCount}
              </Text>
            </Flex>

            {/* Dislike button */}
            <Flex alignItems="center">
              <Tooltip label={userDisliked ? 'Remove Dislike' : 'Dislike'}>
                <IconButton
                  aria-label="Dislike"
                  icon={userDisliked ? <AiFillDislike /> : <AiOutlineDislike />}
                  onClick={handleDislike}
                  isLoading={interactionLoading}
                  variant="ghost"
                  colorScheme={userDisliked ? 'primary' : 'gray'}
                  size="lg"
                  bgColor="transparent"
                  cursor="pointer"
                />
              </Tooltip>
            </Flex>

            {/* Download button */}
            <Center
              as={Button}
              borderRadius={'16px'}
              color="#FFFFFF"
              border="1px solid #E8E8E8"
              display="inline-flex"
              p="6px 10px"
              background="#363576"
              cursor="pointer"
              onClick={() => handlePdfDownload(url ?? '')}
              isLoading={isLoading}
            >
              Download
            </Center>
          </Flex>
        </Flex>

        <Heading fontSize="24px" lineHeight="120%" fontWeight="600">
          {mainTitle}
        </Heading>
        <Text
          fontSize="18px"
          color="#1A1A1A"
        >
          {subTitle}
        </Text>
        <Text
          fontSize="18px"
          color="rgba(26, 26, 26, 0.80)"
        >
          {role}
        </Text>
      </Box>
      <LibraryPdfModal
        isOpen={isOpen}
        onClose={onClose}
        userList={data}
        title={mainTitle}
        url={url}
        dataChanged={dataChanged}
        setDataChanged={setDataChanged}
      />
    </Box>
  )
}
