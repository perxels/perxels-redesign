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
  SimpleGrid,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  useDisclosure,
  Image,
  IconButton,
  Alert,
  AlertIcon,
  Input,
  Textarea,
} from '@chakra-ui/react'
import { useSOTWHistory } from '../../../../hooks/useSOTW'
import { useSOTWActions } from '../../../../hooks/useSOTW'
import { FiZoomIn, FiTrash2, FiEdit, FiSearch } from 'react-icons/fi'
import { useRouter } from 'next/router'

export const SOTWHistoryAdmin = () => {
  const { history, loading } = useSOTWHistory()
  const { deleteSOTWHistory } = useSOTWActions()
  const { reload } = useRouter()
  const [selectedImage, setSelectedImage] = useState<string | null>(null)
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedHistory, setSelectedHistory] = useState<any>(null)
  const [deletingId, setDeletingId] = useState<string | null>(null)
  const {
    isOpen: isImageOpen,
    onOpen: onImageOpen,
    onClose: onImageClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()
  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure()
  const toast = useToast()

  const filteredHistory = history.filter(
    (item) =>
      item.studentName.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.cohort.toLowerCase().includes(searchTerm.toLowerCase()) ||
      item.citation.toLowerCase().includes(searchTerm.toLowerCase()),
  )

  const openImageModal = (imageUrl: string) => {
    setSelectedImage(imageUrl)
    onImageOpen()
  }

  const openDeleteModal = (historyItem: any) => {
    setSelectedHistory(historyItem)
    onDeleteOpen()
  }

  const openDetailsModal = (historyItem: any) => {
    setSelectedHistory(historyItem)
    onDetailsOpen()
  }

  const handleDeleteHistory = async () => {
    if (!selectedHistory) return

    setDeletingId(selectedHistory.id)
    const result = await deleteSOTWHistory(selectedHistory.id)

    if (result.success) {
      toast({
        title: 'History Deleted',
        description: 'SOTW history record has been deleted',
        status: 'success',
        duration: 3000,
      })
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to delete history',
        status: 'error',
        duration: 3000,
      })
    }

    setDeletingId(null)
    setSelectedHistory(null)
    reload()
    onDeleteClose()
  }

  if (loading) {
    return (
      <Card>
        <CardBody>
          <Text>Loading history...</Text>
        </CardBody>
      </Card>
    )
  }

  return (
    <>
      <VStack spacing={6} align="stretch" mt={8}>
        <Heading size="lg">SOTW History</Heading>

        {/* Search */}
        <Card>
          <CardBody>
            <HStack>
              <Input
                placeholder="Search by student name, cohort, or citation..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
              <IconButton
                aria-label="Search"
                icon={<FiSearch />}
                // onClick={() => {}} // You can add search functionality if needed
              />
            </HStack>
          </CardBody>
        </Card>

        {filteredHistory.length === 0 ? (
          <Card>
            <CardBody>
              <VStack spacing={4} textAlign="center" py={8}>
                <Heading size="md">No History Found</Heading>
                <Text color="gray.600">
                  {history.length === 0
                    ? 'No Student of the Week history yet.'
                    : 'No history matches your search.'}
                </Text>
              </VStack>
            </CardBody>
          </Card>
        ) : (
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={6}>
            {filteredHistory.map((item) => (
              <Card
                key={item.id}
                shadow="md"
                _hover={{ shadow: 'lg' }}
                transition="shadow 0.2s"
              >
                <CardBody>
                  <VStack spacing={3} align="stretch">
                    {/* Student Header */}
                    <HStack spacing={3}>
                      <Avatar
                        size="md"
                        name={item.studentName}
                        src={item.studentAvatar}
                      />
                      <Box flex={1}>
                        <Text fontWeight="bold" fontSize="lg">
                          {item.studentName}
                        </Text>
                        <HStack spacing={2} mt={1}>
                          <Badge colorScheme="blue" fontSize="xs">
                            {item.cohort}
                          </Badge>
                          <Badge colorScheme="green" fontSize="xs">
                            {item.classPlan}
                          </Badge>
                        </HStack>
                      </Box>
                    </HStack>

                    {/* Dates */}
                    <Box>
                      <Text fontSize="sm" color="gray.600">
                        Week of {item.weekStart.toLocaleDateString()}
                      </Text>
                      <Text fontSize="xs" color="gray.500">
                        Selected by {item.selectedByEmail}
                      </Text>
                    </Box>

                    {/* Citation Preview */}
                    <Text fontSize="sm" color="gray.700" noOfLines={3}>
                      {item.citation}
                    </Text>

                    {/* Stats */}
                    <HStack
                      justify="space-between"
                      fontSize="sm"
                      color="gray.600"
                    >
                      <Text>❤️ {item.totalLikes || 0}</Text>
                      <Text>💬 {item.totalComments || 0}</Text>
                      <Text>{item.workImages?.length || 0} 📷</Text>
                    </HStack>

                    {/* Actions */}
                    <HStack spacing={2}>
                      <Button
                        size="sm"
                        variant="outline"
                        flex={1}
                        onClick={() => openDetailsModal(item)}
                      >
                        View Details
                      </Button>
                      <IconButton
                        aria-label="Delete history"
                        icon={<FiTrash2 />}
                        size="sm"
                        colorScheme="red"
                        variant="outline"
                        onClick={() => openDeleteModal(item)}
                      />
                    </HStack>
                  </VStack>
                </CardBody>
              </Card>
            ))}
          </SimpleGrid>
        )}
      </VStack>

      {/* History Details Modal */}
      <Modal isOpen={isDetailsOpen} onClose={onDetailsClose} size="4xl">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            SOTW History: {selectedHistory?.studentName}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedHistory && (
              <VStack spacing={6} align="stretch">
                {/* Student Info */}
                <HStack spacing={4}>
                  <Avatar
                    size="xl"
                    name={selectedHistory.studentName}
                    src={selectedHistory.studentAvatar}
                  />
                  <Box>
                    <Heading size="lg">{selectedHistory.studentName}</Heading>
                    <HStack spacing={3} mt={2}>
                      <Badge colorScheme="blue">{selectedHistory.cohort}</Badge>
                      <Badge colorScheme="green">
                        {selectedHistory.classPlan}
                      </Badge>
                    </HStack>
                    <Text color="gray.600" mt={1}>
                      {selectedHistory.studentEmail}
                    </Text>
                    <Text fontSize="sm" color="gray.500" mt={1}>
                      Selected on{' '}
                      {selectedHistory.selectedAt.toLocaleDateString()} by{' '}
                      {selectedHistory.selectedByEmail}
                    </Text>
                  </Box>
                </HStack>

                {/* Citation */}
                <Box>
                  <Heading size="md" mb={3}>
                    Citation
                  </Heading>
                  <Text bg="gray.50" p={4} borderRadius="md">
                    {selectedHistory.citation}
                  </Text>
                </Box>

                {/* Work Highlight */}
                <Box>
                  <Heading size="md" mb={3}>
                    Work Highlights
                  </Heading>
                  <Text bg="gray.50" p={4} borderRadius="md">
                    {selectedHistory.workHighlight}
                  </Text>
                </Box>

                {/* Work Images */}
                {selectedHistory.workImages?.length > 0 && (
                  <Box>
                    <Heading size="md" mb={3}>
                      Work Images
                    </Heading>
                    <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
                      {selectedHistory.workImages.map((image: any) => (
                        <Box key={image.id} position="relative">
                          <Image
                            src={image.url}
                            alt={image.caption || 'Work image'}
                            objectFit="cover"
                            height="150px"
                            width="100%"
                            borderRadius="md"
                            cursor="pointer"
                            onClick={() => openImageModal(image.url)}
                          />
                          {image.caption && (
                            <Text fontSize="sm" color="gray.600" mt={2}>
                              {image.caption}
                            </Text>
                          )}
                        </Box>
                      ))}
                    </SimpleGrid>
                  </Box>
                )}

                {/* Stats */}
                <HStack
                  spacing={6}
                  justify="center"
                  bg="brand.purple.50"
                  p={4}
                  borderRadius="md"
                >
                  <Box textAlign="center">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="brand.purple.600"
                    >
                      {selectedHistory.totalLikes || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Likes
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="brand.purple.600"
                    >
                      {selectedHistory.totalComments || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Comments
                    </Text>
                  </Box>
                  <Box textAlign="center">
                    <Text
                      fontSize="2xl"
                      fontWeight="bold"
                      color="brand.purple.600"
                    >
                      {selectedHistory.workImages?.length || 0}
                    </Text>
                    <Text fontSize="sm" color="gray.600">
                      Images
                    </Text>
                  </Box>
                </HStack>
              </VStack>
            )}
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" onClick={onDetailsClose}>
              Close
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete SOTW History</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Alert status="warning" mb={4}>
              <AlertIcon />
              Are you sure you want to delete the SOTW history for{' '}
              {selectedHistory?.studentName}?
            </Alert>
            <Text color="gray.600">
              This action cannot be undone. All data including citations, work
              highlights, and images will be permanently deleted.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="outline" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteHistory}
              isLoading={deletingId === selectedHistory?.id}
            >
              Delete History
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>

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
