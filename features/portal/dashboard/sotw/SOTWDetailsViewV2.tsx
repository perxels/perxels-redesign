import React, { useState } from 'react'
import {
  Alert,
  AlertIcon,
  Avatar,
  Badge,
  Box,
  Button,
  Card,
  CardBody,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  IconButton,
  Image,
  Img,
  Modal,
  ModalBody,
  ModalCloseButton,
  ModalContent,
  ModalHeader,
  ModalOverlay,
  Text,
  Textarea,
  useDisclosure,
  useToast,
  VStack,
} from '@chakra-ui/react'
import { MainContainer } from '../../../../layouts'
import { useCurrentSOTW, useSOTWActions } from '../../../../hooks/useSOTW'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { FaInstagram } from 'react-icons/fa'
import { FiHeart, FiMessageSquare, FiZoomIn } from 'react-icons/fi'

export const SOTWDetailsViewV2 = () => {
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
      <Card bg={'gray.200'} mt={6} width={'60%'} mx={'auto'}>
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

  const isCurrentUser = portalUser?.uid === currentSOTW?.studentId
  const isLiked = currentSOTW?.likes.includes(portalUser?.uid || '')
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
      {' '}
      <Box bg="brand.dark.200">
        <MainContainer
          noMobilePadding
          bg={`url(/assets/images/sudent-work/studentHeroBg.svg) center/cover no-repeat`}
        >
          {isCurrentUser && (
            <Badge colorScheme="yellow" fontSize="30px" p={2} ml={6} mt={6}>
              🎉 You are the Student of the Week!
            </Badge>
          )}
          <Box pos="relative" py={['0', '0', '0', '1.5rem']} px={5}>
            <Flex
              flexDirection={{ base: 'column-reverse', md: 'row' }}
              justifyContent="space-between"
              alignItems={['flex-start', 'center']}
            >
              <Box
                pl={['1.25rem', 0]}
                transform={['translate(0, -50%)', 'translate(0, 0)']}
                pos={['absolute', 'absolute', 'absolute', 'static']}
                bottom="0"
              >
                <Heading
                  as="h2"
                  fontSize={{ base: '3.200625rem', md: '5.1675rem' }}
                  lineHeight={{ base: '3.5rem', md: '5.7rem' }}
                  color="brand.white"
                  textTransform="uppercase"
                  maxW="528px"
                >
                  {currentSOTW?.projectName}
                </Heading>
                <Text
                  fontSize={{ base: '1.125rem', md: '1.25rem' }}
                  color="#E3E4E6"
                >
                  Designed by:
                </Text>
                <Text
                  fontSize="1.875rem"
                  color="brand.yellow.300"
                  fontWeight="bold"
                  mt={2}
                >
                  {currentSOTW?.studentName}
                </Text>
                {currentSOTW.igLink && (
                  <Flex flexDirection={['row', 'column']} gap={5} mt={5}>
                    <HStack
                      spacing={'0.625rem'}
                      as="a"
                      target="_blank"
                      href={currentSOTW.igLink}
                    >
                      <Center
                        w={10}
                        h={10}
                        borderRadius="50%"
                        backgroundColor="#F3F3F3"
                        color="brand.dark.200"
                        fontSize={'0.875rem'}
                      >
                        <FaInstagram />
                      </Center>
                      <Text
                        fontSize={{ base: '1.125rem', md: '1rem' }}
                        color="#E3E4E6"
                        display={['block']}
                        textDecoration="underline"
                      >
                        Instagram
                      </Text>
                    </HStack>
                  </Flex>
                )}

                <HStack spacing={4} mt={6}>
                  <Badge colorScheme="blue" fontSize="24px">
                    {currentSOTW.cohort}
                  </Badge>
                  <Badge colorScheme="green" fontSize="22px">
                    {currentSOTW.classPlan}
                  </Badge>
                </HStack>
                <HStack spacing={6} color="gray.600" mt={6}>
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
                    {currentSOTW.comments.length === 1 ? 'Comment' : 'Comments'}
                  </Text>
                </HStack>
              </Box>
              <Box>
                <Img
                  src="/assets/images/class-work/arrow.svg"
                  alt="arrow"
                  position={'absolute'}
                  top={'55%'}
                  transform={'translate(-70%, -10%)'}
                  display={{ base: 'none', md: 'block' }}
                  rounded="10px"
                />
              </Box>
              <Box
                h={['782px', '633px', '633px']}
                w={{ base: 'full', lg: '40%' }}
                boxShadow={{
                  base: 'none',
                  md: '-7px -9px 0px 0px rgba(253,232,92,1)',
                  lg: 'none',
                }}
                // bg={'red'}
                display={'flex'}
                justifyContent="center"
                alignItems={'center'}
              >
                <Avatar
                  size="2xl"
                  minHeight={200}
                  minWidth={200}
                  name={currentSOTW.studentName}
                  src={currentSOTW.studentAvatar}
                  border="3px solid"
                  borderColor="brand.purple.300"
                />
              </Box>
            </Flex>
            <Box>
              <Center mt="1.2rem">
                <Img
                  src="/assets/images/class-work/bottomArrow.png"
                  alt="arrow"
                />
              </Center>
            </Box>
          </Box>
        </MainContainer>
        <Box
          py="2rem"
          px={6}
          bg="brand.dark.200"
          display={'flex'}
          flexDirection={'column'}
          gap={20}
        >
          <Box>
            <Heading
              as="h2"
              fontSize={{ base: '2.5rem', md: '2.5rem' }}
              color="brand.white"
              lineHeight={'110%'}
              mb={{ base: 4, md: 6 }}
            >
              Recognition
            </Heading>
            <Text color="brand.white" fontSize="xl" fontWeight="normal">
              {currentSOTW.citation}
            </Text>
          </Box>
          {/* Work Images */}
          {currentSOTW.workImages.length > 0 && (
            <Box width="100%">
              <Heading
                as="h2"
                fontSize={{ base: '2.5rem', md: '2.5rem' }}
                color="brand.white"
                lineHeight={'110%'}
                mb={{ base: 4, md: 6 }}
              >
                Work Gallery
              </Heading>
              <Grid
                templateColumns={{
                  base: '1fr',
                  // md: 'repeat(2, 1fr)',
                }}
                gap={20}
                mt={6}
              >
                {currentSOTW.workImages.map((image) => (
                  <GridItem key={image.id}>
                    <Box
                      position="relative"
                      borderRadius="md"
                      overflow="hidden"
                      width="80%"
                      mx={'auto'}
                    >
                      <Image
                        src={image.url}
                        alt={image.caption || 'Work image'}
                        objectFit="cover"
                        // height="200px"
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
          <Box>
            <Heading
              as="h2"
              fontSize={{ base: '2.5rem', md: '2.5rem' }}
              color="brand.white"
              lineHeight={'110%'}
              mb={{ base: 4, md: 6 }}
            >
              Project Highlights
            </Heading>
            <Text color="brand.white" fontSize="xl" fontWeight="normal">
              {currentSOTW.workHighlight}
            </Text>
          </Box>
        </Box>
        {/* Comments Section */}
        <Card bg={'#151515'}>
          <CardBody>
            <VStack align="start" spacing={4}>
              <Heading size="lg" color={'brand.white'} fontWeight={'bold'}>
                Comments
              </Heading>

              {/* Add Comment */}
              {canComment && (
                <Box width="100%">
                  <Textarea
                    placeholder="Leave a congratulatory message or comment..."
                    color={'brand.white'}
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
                      <Card key={comment.id} variant="outline" bg={'gray.100'}>
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
      </Box>
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
