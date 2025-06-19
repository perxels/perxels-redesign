import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Input,
  Button,
  Text,
  Avatar,
  Divider,
  Flex,
  useToast,
} from '@chakra-ui/react'
import {
  collection,
  addDoc,
  query,
  where,
  onSnapshot,
  serverTimestamp,
  doc,
  getDoc,
  getDocs,
} from 'firebase/firestore'
import { db, auth } from '../../firebaseConfig'
import moment from 'moment'
import { IoReturnDownForwardSharp } from 'react-icons/io5'

interface Comment {
  id: string
  text: string
  userId: string
  videoId: string
  createdAt: any
  userName: string
  userPhotoURL?: string
}

interface MasterclassCommentsProps {
  masterclassId: string
}

const MasterclassComments: React.FC<MasterclassCommentsProps> = ({ masterclassId }) => {
  const [comments, setComments] = useState<Comment[]>([])
  const [newComment, setNewComment] = useState('')
  const [loading, setLoading] = useState(false)
  const [user, setUser] = useState<any>(null)
  const toast = useToast()

  // Fetch current user data
  useEffect(() => {
    const currentUser = auth.currentUser
    if (currentUser) {
      const fetchUserData = async () => {
        try {
          const userDocRef = doc(db, 'users', currentUser.uid)
          const userDoc = await getDoc(userDocRef)

          if (userDoc.exists()) {
            setUser({
              uid: currentUser.uid,
              ...userDoc.data(),
            })
          }
        } catch (error) {
          console.error('Error fetching user data:', error)
        }
      }

      fetchUserData()
    }
  }, [])

  // Fetch comments for this video
  useEffect(() => {
    if (!masterclassId) IoReturnDownForwardSharp

    const commentsRef = collection(db, 'videoComments')

    // First, let's try to get all comments for debugging
    const fetchAllComments = async () => {
      try {
        const allCommentsSnapshot = await getDocs(commentsRef)
      } catch (error) {
        console.error('Error fetching all comments:', error)
      }
    }

    fetchAllComments()

    // Now set up the filtered query
    const q = query(
      commentsRef,
      where('masterclassId', '==', masterclassId),
      // Temporarily remove orderBy to see if that's causing issues
      // orderBy('createdAt', 'desc')
    )

    const unsubscribe = onSnapshot(
      q,
      (snapshot) => {
        const fetchedComments: Comment[] = []
        snapshot.forEach((doc) => {
          const data = doc.data()

          // Handle case where createdAt might be null/undefined
          fetchedComments.push({
            id: doc.id,
            ...data,
            createdAt: data.createdAt || new Date().getTime(), // Fallback for timestamps
          } as Comment)
        })

        // Sort manually since we removed orderBy
        fetchedComments.sort((a, b) => {
          const timeA = a.createdAt?.toDate?.() || new Date(a.createdAt || 0)
          const timeB = b.createdAt?.toDate?.() || new Date(b.createdAt || 0)
          return timeB.getTime() - timeA.getTime() // Descending order
        })

        setComments(fetchedComments)
      },
      (error) => {
        console.error('Error in comment snapshot listener:', error)
      },
    )

    return () => {
      unsubscribe()
    }
  }, [masterclassId])

  const handleSubmitComment = async () => {
    if (!newComment.trim()) return
    if (!auth.currentUser) {
      toast({
        title: 'Please log in to comment',
        status: 'warning',
        duration: 3000,
        isClosable: true,
      })
      return
    }

    setLoading(true)
    try {
      const currentUser = auth.currentUser
      const userDocRef = doc(db, 'users', currentUser.uid)
      const userDoc = await getDoc(userDocRef)

      const userName = userDoc.exists()
        ? `${userDoc.data().firstName || ''} ${
            userDoc.data().lastName || ''
          }`.trim()
        : 'Anonymous User'
      // Create a timestamp locally for immediate display
      const now = new Date()

      // Add to Firestore
      const docRef = await addDoc(collection(db, 'masterclassComments'), {
        text: newComment,
        userId: currentUser.uid,
        userName: userName,
        masterclassId: masterclassId,
        createdAt: serverTimestamp(), // This might be null initially in Firestore
      })

      // Manually add the comment to the state for immediate display
      // This ensures the comment shows up even if the Firestore listener is delayed
      setComments((prevComments) => [
        {
          id: docRef.id,
          text: newComment,
          userId: currentUser.uid,
          userName: userName,
          videoId: masterclassId,
          masterclassId: masterclassId,
          createdAt: now, // Use local timestamp for immediate display
        },
        ...prevComments,
      ])

      setNewComment('')
      toast({
        title: 'Comment added',
        status: 'success',
        duration: 3000,
        isClosable: true,
      })
    } catch (error) {
      console.error('Error adding comment:', error)
      toast({
        title: 'Failed to add comment',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    } finally {
      setLoading(false)
    }
  }

  return (
    <Box mt={8} width="100%">
      <Text fontSize="xl" fontWeight="bold" mb={4}>
        Comments ({comments.length})
      </Text>

      {/* Comment input */}
      <HStack mb={6}>
        <Avatar
          size="sm"
          name={
            user
              ? `${user.firstName || ''} ${user.lastName || ''}`.trim()
              : undefined
          }
        />
        <Input
          placeholder="Add a comment..."
          value={newComment}
          onChange={(e) => setNewComment(e.target.value)}
          onKeyPress={(e) => {
            if (e.key === 'Enter') {
              handleSubmitComment()
            }
          }}
        />
        <Button
          colorScheme="yellow"
          isLoading={loading}
          onClick={handleSubmitComment}
        >
          Post
        </Button>
      </HStack>

      {/* Comments list */}
      <VStack spacing={4} align="stretch">
        {comments.length === 0 ? (
          <Text color="gray.500" textAlign="center" py={4}>
            Be the first to comment on this video!
          </Text>
        ) : (
          comments.map((comment) => {
            // Handle different timestamp formats
            let timeDisplay = 'Just now'
            try {
              if (comment.createdAt) {
                if (typeof comment.createdAt.toDate === 'function') {
                  // Firestore Timestamp
                  timeDisplay = moment(comment.createdAt.toDate()).fromNow()
                } else if (comment.createdAt instanceof Date) {
                  // JavaScript Date
                  timeDisplay = moment(comment.createdAt).fromNow()
                } else {
                  // Timestamp as number
                  timeDisplay = moment(new Date(comment.createdAt)).fromNow()
                }
              }
            } catch (error) {
              console.error('Error formatting timestamp:', error)
            }

            return (
              <Box key={comment.id} p={4} borderRadius="md" bg="gray.50">
                <Flex align="center" mb={2}>
                  <Avatar size="sm" name={comment.userName} mr={2} />
                  <Box>
                    <Text fontWeight="bold">{comment.userName}</Text>
                    <Text fontSize="xs" color="gray.500">
                      {timeDisplay}
                    </Text>
                  </Box>
                </Flex>
                <Text pl={10}>{comment.text}</Text>
              </Box>
            )
          })
        )}
      </VStack>
    </Box>
  )
}

export default MasterclassComments
