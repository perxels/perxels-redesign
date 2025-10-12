import React, { useState } from 'react'
import {
  Box,
  VStack,
  Heading,
  Text,
  Card,
  CardBody,
  HStack,
  Avatar,
  Badge,
  Button,
  useToast,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Textarea,
  Alert,
  AlertIcon,
  IconButton,
} from '@chakra-ui/react'
import { useCurrentSOTW } from '../../../../hooks/useSOTW'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { useSOTWActions } from '../../../../hooks/useSOTW'
import { FiHeart, FiMessageSquare, FiZoomIn } from 'react-icons/fi'

export const SOTWDetailsView = () => {
  const { currentSOTW, loading } = useCurrentSOTW()
  const { portalUser } = usePortalAuth()
  const { addComment, toggleLike } = useSOTWActions()
  const [comment, setComment] = useState('')
  const [submitting, setSubmitting] = useState(false)
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  if (loading) {
    return (
      <Card>
        <CardBody>
          <Text>Loading Student of the Week...</Text>
        </CardBody>
      </Card>
    )
  }

  if (!currentSOTW) {
    return (
      <Card>
        <CardBody>
          <VStack spacing={4} textAlign="center">
            <Heading size="lg">🌟 Student of the Week</Heading>
            <Text color="gray.500">
              No Student of the Week selected at the moment.
            </Text>
          </VStack>
        </CardBody>
      </Card>
    )
  }

  const isCurrentUser = portalUser?.uid === currentSOTW.studentId
  const isLiked = currentSOTW.likes.includes(portalUser?.uid || '')
  const canComment = portalUser?.role === 'student'

  const handleAddComment = async () => {
    if (!comment.trim()) {
      toast({
        title: 'Comment cannot be empty',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    if (!portalUser) {
      toast({
        title: 'You must be logged in to comment',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setSubmitting(true)
    const result = await addComment(comment, portalUser)

    if (result.success) {
      setComment('')
      toast({
        title: 'Comment added!',
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: 'Failed to add comment',
        description: result.error,
        status: 'error',
        duration: 3000,
      })
    }
    setSubmitting(false)
  }

  const handleToggleLike = async () => {
    if (!portalUser) {
      toast({
        title: 'You must be logged in to like',
        status: 'error',
        duration: 3000,
      })
      return
    }

    const result = await toggleLike(portalUser.uid, currentSOTW.likes)
    if (!result.success) {
      toast({
        title: 'Failed to update like',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onOpen()
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        {/* Current SOTW Header */}
        <Card bg="white" shadow="md">
          <CardBody>
            <Grid
              templateColumns={{ base: '1fr', md: 'auto 1fr' }}
              gap={6}
              alignItems="center"
            >
              <GridItem>
                <Avatar
                  size="2xl"
                  name={currentSOTW.studentName}
                  src={currentSOTW.studentAvatar}
                  border="4px solid"
                  borderColor="brand.purple.300"
                />
              </GridItem>

              <GridItem>
                <VStack align="start" spacing={3}>
                  {isCurrentUser && (
                    <Badge colorScheme="yellow" fontSize="lg" p={2}>
                      🎉 You are the Student of the Week!
                    </Badge>
                  )}

                  <Heading size="xl" color="brand.purple.600">
                    {currentSOTW.studentName}
                  </Heading>

                  <HStack spacing={4}>
                    <Badge colorScheme="blue" fontSize="md">
                      {currentSOTW.cohort}
                    </Badge>
                    <Badge colorScheme="green" fontSize="md">
                      {currentSOTW.classPlan}
                    </Badge>
                  </HStack>

                  <HStack spacing={6} color="gray.600">
                    <Button
                      variant="outline"
                      leftIcon={<FiHeart fill={isLiked ? 'red' : 'none'} />}
                      color={isLiked ? 'red.500' : 'gray.500'}
                      onClick={handleToggleLike}
                    >
                      {currentSOTW.likes.length}{' '}
                      {currentSOTW.likes.length === 1 ? 'Like' : 'Likes'}
                    </Button>
                    <Text>
                      <FiMessageSquare
                        style={{ display: 'inline', marginRight: '4px' }}
                      />
                      {currentSOTW.comments.length}{' '}
                      {currentSOTW.comments.length === 1
                        ? 'Comment'
                        : 'Comments'}
                    </Text>
                  </HStack>
                </VStack>
              </GridItem>
            </Grid>
          </CardBody>
        </Card>

        {/* Citation Section */}
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="lg" color="brand.purple.600">
                Citation & Recognition
              </Heading>
              <Text fontSize="lg" lineHeight="tall">
                {currentSOTW.citation}
              </Text>
            </VStack>
          </CardBody>
        </Card>

        {/* Work Highlights */}
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="lg" color="brand.purple.600">
                Work & Project Highlights
              </Heading>
              <Text fontSize="lg" lineHeight="tall">
                {currentSOTW.workHighlight}
              </Text>

              {/* Work Images */}
              {currentSOTW.workImages.length > 0 && (
                <Box width="100%">
                  <Heading size="md" mb={4}>
                    Work Gallery
                  </Heading>
                  <Grid
                    templateColumns={{
                      base: '1fr',
                      md: 'repeat(2, 1fr)',
                      lg: 'repeat(3, 1fr)',
                    }}
                    gap={4}
                  >
                    {currentSOTW.workImages.map((image) => (
                      <GridItem key={image.id}>
                        <Box
                          position="relative"
                          borderRadius="md"
                          overflow="hidden"
                        >
                          <Image
                            src={image.url}
                            alt={image.caption || 'Work image'}
                            objectFit="cover"
                            height="200px"
                            width="100%"
                            cursor="pointer"
                            onClick={() => openImageModal(image.url)}
                          />
                          <IconButton
                            aria-label="Zoom image"
                            icon={<FiZoomIn />}
                            position="absolute"
                            top={2}
                            right={2}
                            size="sm"
                            onClick={() => openImageModal(image.url)}
                          />
                          {image.caption && (
                            <Text
                              fontSize="sm"
                              color="white"
                              position="absolute"
                              bottom={0}
                              left={0}
                              right={0}
                              bg="blackAlpha.700"
                              p={2}
                            >
                              {image.caption}
                            </Text>
                          )}
                        </Box>
                      </GridItem>
                    ))}
                  </Grid>
                </Box>
              )}
            </VStack>
          </CardBody>
        </Card>

        {/* Comments Section */}
        <Card>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="lg" color="brand.purple.600">
                Comments & Congratulations
              </Heading>

              {/* Add Comment */}
              {canComment && (
                <Box width="100%">
                  <Textarea
                    placeholder="Leave a congratulatory message or comment..."
                    value={comment}
                    onChange={(e) => setComment(e.target.value)}
                    rows={3}
                    resize="vertical"
                    mb={3}
                  />
                  <Button
                    colorScheme="purple"
                    onClick={handleAddComment}
                    isLoading={submitting}
                    isDisabled={!comment.trim()}
                  >
                    Post Comment
                  </Button>
                </Box>
              )}

              {/* Comments List */}
              {currentSOTW.comments.length === 0 ? (
                <Alert status="info" borderRadius="md">
                  <AlertIcon />
                  No comments yet. Be the first to congratulate!
                </Alert>
              ) : (
                <VStack spacing={3} align="stretch" width="100%">
                  {currentSOTW.comments
                    .filter((comment) => comment.isActive)
                    .sort(
                      (a, b) => b.createdAt.getTime() - a.createdAt.getTime(),
                    )
                    .map((comment) => (
                      <Card key={comment.id} variant="outline">
                        <CardBody py={3}>
                          <HStack spacing={3} align="flex-start">
                            <Avatar
                              size="sm"
                              name={comment.userName}
                              src={comment.userAvatar}
                            />
                            <VStack align="start" spacing={1} flex={1}>
                              <HStack justify="space-between" width="full">
                                <Text fontWeight="bold" fontSize="sm">
                                  {comment.userName}
                                </Text>
                                <Text fontSize="xs" color="gray.500">
                                  {comment.createdAt.toLocaleDateString()}
                                </Text>
                              </HStack>
                              <Text fontSize="sm" color="gray.700">
                                {comment.comment}
                              </Text>
                            </VStack>
                          </HStack>
                        </CardBody>
                      </Card>
                    ))}
                </VStack>
              )}
            </VStack>
          </CardBody>
        </Card>
      </VStack>

      {/* Image Modal */}
      <Modal isOpen={isOpen} onClose={onClose} size="xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Work Image</ModalHeader>
          <ModalCloseButton />
          <ModalBody pb={6}>
            {selectedImage && (
              <Image
                src={selectedImage}
                alt="Work image"
                width="100%"
                height="auto"
                borderRadius="md"
              />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>
    </>
  )
}
