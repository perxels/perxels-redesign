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
  useDisclosure,
  Grid,
  GridItem,
  Image,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
  IconButton,
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { useCurrentSOTW } from '../../../../hooks/useSOTW'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { useSOTWActions } from '../../../../hooks/useSOTW'
import { CreateSOTWModal } from './CreateSOTWModal'
import { FiZoomIn } from 'react-icons/fi'
import { useRouter } from 'next/router'

export const SOTWAdminView = () => {
  const { currentSOTW, loading } = useCurrentSOTW()
  const { portalUser } = usePortalAuth()
  const { deactivateSOTW } = useSOTWActions()
  const { reload } = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [deactivating, setDeactivating] = useState(false)
  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure()
  const toast = useToast()

  const handleDeactivateSOTW = async () => {
    if (!currentSOTW) return

    setDeactivating(true)
    const result = await deactivateSOTW()

    if (result.success) {
      toast({
        title: 'SOTW Deactivated',
        description: 'Student of the Week has been deactivated',
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to deactivate SOTW',
        status: 'error',
        duration: 3000,
      })
    }
    setDeactivating(false)
    reload()
  }

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onImageOpen()
  }

  const handleSOTWCreated = () => {
    onCreateClose()
    toast({
      title: 'Success!',
      description: 'Student of the Week has been set successfully',
      status: 'success',
      duration: 3000,
    })
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <Text>Loading...</Text>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <VStack spacing={6} align="stretch">
        {/* Header with Create Button */}
        <HStack justify="space-between">
          <Box>
            <Heading size="lg">Student of the Week Management</Heading>
            <Text color="gray.600">
              Manage current Student of the Week and view history
            </Text>
          </Box>
          <Button colorScheme="purple" onClick={onCreateOpen}>
            Set New SOTW
          </Button>
        </HStack>

        {/* Current SOTW Section */}
        {currentSOTW ? (
          <Card bg="white" shadow="md">
            <CardBody>
              <VStack spacing={6} align="stretch">
                {/* Header with Actions */}
                <HStack justify="space-between">
                  <Heading size="xl" color="brand.purple.600">
                    🌟 Current Student of the Week
                  </Heading>
                  <Button
                    colorScheme="red"
                    variant="outline"
                    onClick={handleDeactivateSOTW}
                    isLoading={deactivating}
                  >
                    Deactivate SOTW
                  </Button>
                </HStack>

                {/* Student Info */}
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
                      <Heading size="lg">{currentSOTW.studentName}</Heading>
                      <HStack spacing={4}>
                        <Badge colorScheme="blue" fontSize="md">
                          {currentSOTW.cohort}
                        </Badge>
                        <Badge colorScheme="green" fontSize="md">
                          {currentSOTW.classPlan}
                        </Badge>
                      </HStack>
                      <Text color="gray.600">{currentSOTW.studentEmail}</Text>
                      <HStack spacing={6} color="gray.600">
                        <Text>❤️ {currentSOTW.likes.length} likes</Text>
                        <Text>💬 {currentSOTW.comments.length} comments</Text>
                      </HStack>
                      <Text fontSize="sm" color="gray.500">
                        Selected by {currentSOTW.selectedByEmail} on{' '}
                        {currentSOTW.selectedAt.toLocaleDateString()}
                      </Text>
                    </VStack>
                  </GridItem>
                </Grid>

                {/* Citation */}
                <Box>
                  <Heading size="md" color="brand.purple.600" mb={3}>
                    Citation & Recognition
                  </Heading>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                  >
                    {currentSOTW.citation}
                  </Text>
                </Box>

                {/* Work Highlights */}
                <Box>
                  <Heading size="md" color="brand.purple.600" mb={3}>
                    Work & Project Highlights
                  </Heading>
                  <Text
                    fontSize="lg"
                    lineHeight="tall"
                    bg="gray.50"
                    p={4}
                    borderRadius="md"
                  >
                    {currentSOTW.workHighlight}
                  </Text>
                </Box>

                {/* Work Images */}
                {currentSOTW.workImages.length > 0 && (
                  <Box>
                    <Heading size="md" color="brand.purple.600" mb={3}>
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

                {/* Comments Preview */}
                <Box>
                  <Heading size="md" color="brand.purple.600" mb={3}>
                    Recent Comments ({currentSOTW.comments.length})
                  </Heading>
                  {currentSOTW.comments.length === 0 ? (
                    <Alert status="info" borderRadius="md">
                      <AlertIcon />
                      No comments yet.
                    </Alert>
                  ) : (
                    <VStack
                      spacing={2}
                      align="stretch"
                      maxH="200px"
                      overflowY="auto"
                    >
                      {currentSOTW.comments
                        .filter((comment) => comment.isActive)
                        .slice(0, 5)
                        .map((comment) => (
                          <Card key={comment.id} variant="outline" size="sm">
                            <CardBody py={2}>
                              <HStack spacing={2} align="flex-start">
                                <Avatar
                                  size="xs"
                                  name={comment.userName}
                                  src={comment.userAvatar}
                                />
                                <Box flex={1}>
                                  <Text fontSize="sm" fontWeight="medium">
                                    {comment.userName}
                                  </Text>
                                  <Text
                                    fontSize="sm"
                                    color="gray.600"
                                    noOfLines={2}
                                  >
                                    {comment.comment}
                                  </Text>
                                </Box>
                                <Text fontSize="xs" color="gray.500">
                                  {comment.createdAt.toLocaleDateString()}
                                </Text>
                              </HStack>
                            </CardBody>
                          </Card>
                        ))}
                    </VStack>
                  )}
                </Box>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <Card>
            <CardBody>
              <VStack spacing={4} textAlign="center" py={8}>
                <Heading size="lg">No Active Student of the Week</Heading>
                <Text color="gray.600">
                  There is currently no Student of the Week selected. Set a new
                  one to get started!
                </Text>
                <Button colorScheme="purple" onClick={onCreateOpen}>
                  Set First SOTW
                </Button>
              </VStack>
            </CardBody>
          </Card>
        )}
      </VStack>

      {/* Create SOTW Modal */}
      <CreateSOTWModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onSOTWCreated={handleSOTWCreated}
      />

      {/* Image Modal */}
      <Modal isOpen={isImageOpen} onClose={onImageClose} size="xl">
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
