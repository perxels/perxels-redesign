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
import {
  FiPlus,
  FiEdit,
  FiEye,
  FiTrash2,
  FiUsers,
  FiDownload,
  FiFile,
} from 'react-icons/fi'
import { PortalEbook } from '../../../../types/ebook.types'
import {
  getAllEbooks,
  toggleEbookStatus,
  deleteEbookCompletely,
} from '../../../../lib/utils/ebook.utils'
import { CreateEbookModal } from './create-ebook-modal'
import { EbookAccessModal } from './ebook-access-modal'
import { EditEbookModal } from './edit-ebook-modal'

export const EbookManagement = () => {
  const [ebooks, setEbooks] = useState<PortalEbook[]>([])
  const [filteredEbooks, setFilteredEbooks] = useState<PortalEbook[]>([])
  const [loading, setLoading] = useState(true)
  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<
    'all' | 'active' | 'inactive'
  >('all')
  const [selectedEbook, setSelectedEbook] = useState<PortalEbook | null>(null)
  const [ebookToToggle, setEbookToToggle] = useState<PortalEbook | null>(null)

  const {
    isOpen: isCreateOpen,
    onOpen: onCreateOpen,
    onClose: onCreateClose,
  } = useDisclosure()
  const {
    isOpen: isAccessOpen,
    onOpen: onAccessOpen,
    onClose: onAccessClose,
  } = useDisclosure()
  const {
    isOpen: isEditOpen,
    onOpen: onEditOpen,
    onClose: onEditClose,
  } = useDisclosure()
  const {
    isOpen: isConfirmOpen,
    onOpen: onConfirmOpen,
    onClose: onConfirmClose,
  } = useDisclosure()

  const toast = useToast()

  const fetchEbooks = async () => {
    try {
      setLoading(true)
      const ebookData = await getAllEbooks()
      setEbooks(ebookData)
      setFilteredEbooks(ebookData)
    } catch (error) {
      console.error('Error fetching ebooks:', error)
      toast({
        title: 'Error',
        description: 'Failed to fetch ebooks',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchEbooks()
  }, [])

  // Filter ebooks based on search and status
  useEffect(() => {
    let filtered = ebooks

    // Filter by search term
    if (searchTerm) {
      filtered = filtered.filter(
        (ebook) =>
          ebook.title.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ebook.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ebook.author.toLowerCase().includes(searchTerm.toLowerCase()) ||
          ebook.accessCode.toLowerCase().includes(searchTerm.toLowerCase()),
      )
    }

    // Filter by status
    if (statusFilter !== 'all') {
      filtered = filtered.filter((ebook) =>
        statusFilter === 'active' ? ebook.isActive : !ebook.isActive,
      )
    }

    setFilteredEbooks(filtered)
  }, [ebooks, searchTerm, statusFilter])

  const handleToggleStatus = async (ebook: PortalEbook) => {
    try {
      await toggleEbookStatus(ebook.id, !ebook.isActive)
      toast({
        title: 'Status Updated',
        description: `Ebook ${
          ebook.isActive ? 'deactivated' : 'activated'
        } successfully`,
        status: 'success',
        duration: 3000,
      })
      fetchEbooks()
    } catch (error) {
      console.error('Error toggling ebook status:', error)
      toast({
        title: 'Error',
        description: 'Failed to update ebook status',
        status: 'error',
        duration: 3000,
      })
    }
  }

  const handleDeleteEbook = async () => {
    if (!ebookToToggle) return

    try {
      const result = await deleteEbookCompletely(ebookToToggle.id)

      if (result.success) {
        toast({
          title: 'Ebook Deleted Successfully',
          description: `Ebook and all related files have been deleted. ${
            result.deletedFiles?.length || 0
          } files removed from Firebase Storage.`,
          status: 'success',
          duration: 5000,
        })
        fetchEbooks()
        onConfirmClose()
      } else {
        throw new Error(result.error || 'Failed to delete ebook')
      }
    } catch (error) {
      console.error('Error deleting ebook:', error)
      toast({
        title: 'Error',
        description:
          error instanceof Error ? error.message : 'Failed to delete ebook',
        status: 'error',
        duration: 5000,
      })
    }
  }

  const formatFileSize = (bytes: number): string => {
    if (bytes === 0) return '0 Bytes'
    const k = 1024
    const sizes = ['Bytes', 'KB', 'MB', 'GB']
    const i = Math.floor(Math.log(bytes) / Math.log(k))
    return parseFloat((bytes / Math.pow(k, i)).toFixed(2)) + ' ' + sizes[i]
  }

  const formatDate = (date: any) => {
    if (!date) return 'N/A'
    const dateObj = date.toDate ? date.toDate() : new Date(date)
    return dateObj.toLocaleDateString()
  }

  const getStats = () => {
    const totalEbooks = ebooks.length
    const activeEbooks = ebooks.filter((ebook) => ebook.isActive).length
    const totalDownloads = ebooks.reduce(
      (sum, ebook) => sum + ebook.downloadCount,
      0,
    )
    const categories = new Set(
      ebooks.map((ebook) => ebook.category).filter(Boolean),
    ).size

    return { totalEbooks, activeEbooks, totalDownloads, categories }
  }

  const stats = getStats()

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading ebooks...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Flex justify="space-between" align="center">
        <VStack align="start" spacing={1}>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            Ebook Management
          </Text>
          <Text color="gray.600" fontSize="sm">
            Manage and monitor ebook access
          </Text>
        </VStack>
        <Button
          leftIcon={<FiPlus />}
          colorScheme="purple"
          onClick={onCreateOpen}
        >
          Add New Ebook
        </Button>
      </Flex>

      {/* Stats Cards */}
      <HStack spacing={4}>
        <Box p={4} bg="blue.50" borderRadius="lg" flex={1}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Total Ebooks
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="blue.700">
              {stats.totalEbooks}
            </Text>
          </VStack>
        </Box>
        <Box p={4} bg="green.50" borderRadius="lg" flex={1}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="green.600" fontWeight="medium">
              Active Ebooks
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="green.700">
              {stats.activeEbooks}
            </Text>
          </VStack>
        </Box>
        <Box p={4} bg="purple.50" borderRadius="lg" flex={1}>
          <VStack align="start" spacing={1}>
            <Text fontSize="sm" color="purple.600" fontWeight="medium">
              Total Downloads
            </Text>
            <Text fontSize="2xl" fontWeight="bold" color="purple.700">
              {stats.totalDownloads}
            </Text>
          </VStack>
        </Box>
      </HStack>

      {/* Filters */}
      <HStack spacing={4}>
        <Input
          placeholder="Search ebooks..."
          value={searchTerm}
          onChange={(e) => setSearchTerm(e.target.value)}
          maxW="300px"
        />
        <Select
          value={statusFilter}
          onChange={(e) =>
            setStatusFilter(e.target.value as 'all' | 'active' | 'inactive')
          }
          maxW="200px"
        >
          <option value="all">All Status</option>
          <option value="active">Active</option>
          <option value="inactive">Inactive</option>
        </Select>
      </HStack>

      {/* Ebooks Table */}
      <Box overflowX="auto">
        <Table variant="simple">
          <Thead>
            <Tr>
              <Th>Title</Th>
              <Th>Author</Th>
              <Th>File</Th>
              <Th>Access Code</Th>
              <Th>Downloads</Th>
              <Th>Status</Th>
              <Th>Date Posted</Th>
              <Th>Actions</Th>
            </Tr>
          </Thead>
          <Tbody>
            {filteredEbooks.map((ebook) => (
              <Tr key={ebook.id}>
                <Td>
                  <VStack align="start" spacing={1}>
                    <Text fontWeight="medium">{ebook.title}</Text>
                    <Text fontSize="sm" color="gray.600" noOfLines={2}>
                      {ebook.description}
                    </Text>
                    {ebook.category && (
                      <Badge colorScheme="blue" variant="subtle" size="sm">
                        {ebook.category}
                      </Badge>
                    )}
                  </VStack>
                </Td>
                <Td>
                  <Text>{ebook.author}</Text>
                </Td>
                <Td>
                  <VStack align="start" spacing={1}>
                    <HStack spacing={2}>
                      <FiFile />
                      <Text fontSize="sm">{ebook.fileName}</Text>
                    </HStack>
                    <Text fontSize="xs" color="gray.500">
                      {formatFileSize(ebook.fileSize)} •{' '}
                      {ebook.fileType.toUpperCase()}
                    </Text>
                  </VStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme="purple"
                    variant="outline"
                    fontFamily="mono"
                  >
                    {ebook.accessCode}
                  </Badge>
                </Td>
                <Td>
                  <HStack spacing={1}>
                    <FiDownload />
                    <Text>{ebook.downloadCount}</Text>
                  </HStack>
                </Td>
                <Td>
                  <Badge
                    colorScheme={ebook.isActive ? 'green' : 'red'}
                    variant="subtle"
                  >
                    {ebook.isActive ? 'Active' : 'Inactive'}
                  </Badge>
                </Td>
                <Td>
                  <Text fontSize="sm">{formatDate(ebook.datePosted)}</Text>
                </Td>
                <Td>
                  <HStack spacing={2}>
                    <Tooltip label="View Access">
                      <IconButton
                        aria-label="View access"
                        icon={<FiUsers />}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEbook(ebook)
                          onAccessOpen()
                        }}
                      />
                    </Tooltip>
                    <Tooltip label="Edit Ebook">
                      <IconButton
                        aria-label="Edit ebook"
                        icon={<FiEdit />}
                        size="sm"
                        variant="outline"
                        onClick={() => {
                          setSelectedEbook(ebook)
                          onEditOpen()
                        }}
                      />
                    </Tooltip>
                    <Tooltip label={ebook.isActive ? 'Deactivate' : 'Activate'}>
                      <IconButton
                        aria-label="Toggle status"
                        icon={<FiEye />}
                        size="sm"
                        variant="ghost"
                        colorScheme={ebook.isActive ? 'orange' : 'green'}
                        onClick={() => handleToggleStatus(ebook)}
                      />
                    </Tooltip>
                    <Tooltip label="Delete Ebook">
                      <IconButton
                        aria-label="Delete ebook"
                        icon={<FiTrash2 />}
                        size="sm"
                        variant="ghost"
                        colorScheme="red"
                        onClick={() => {
                          setEbookToToggle(ebook)
                          onConfirmOpen()
                        }}
                      />
                    </Tooltip>
                  </HStack>
                </Td>
              </Tr>
            ))}
          </Tbody>
        </Table>
      </Box>

      {filteredEbooks.length === 0 && (
        <Alert status="info">
          <AlertIcon />
          No ebooks found matching your criteria.
        </Alert>
      )}

      {/* Modals */}
      <CreateEbookModal
        isOpen={isCreateOpen}
        onClose={onCreateClose}
        onEbookCreated={fetchEbooks}
      />

      {selectedEbook && (
        <>
          <EbookAccessModal
            isOpen={isAccessOpen}
            onClose={onAccessClose}
            ebook={selectedEbook}
          />
          <EditEbookModal
            isOpen={isEditOpen}
            onClose={onEditClose}
            ebook={selectedEbook}
            onEbookUpdated={fetchEbooks}
          />
        </>
      )}

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isConfirmOpen} onClose={onConfirmClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Ebook</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <VStack spacing={4} align="start">
              <Text>
                Are you sure you want to delete &quot;{ebookToToggle?.title}
                &quot;?
              </Text>
              <Alert status="warning">
                <AlertIcon />
                <VStack align="start" spacing={1}>
                  <Text fontWeight="medium">
                    This action will permanently delete:
                  </Text>
                  <Text fontSize="sm">• The ebook from the database</Text>
                  <Text fontSize="sm">• The PDF file from Firebase Storage</Text>
                  <Text fontSize="sm">
                    • The thumbnail image from Firebase Storage (if exists)
                  </Text>
                  <Text fontSize="sm">• All access records for this ebook</Text>
                  <Text fontSize="sm" fontWeight="bold">
                    This action cannot be undone.
                  </Text>
                </VStack>
              </Alert>
            </VStack>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onConfirmClose}>
              Cancel
            </Button>
            <Button colorScheme="red" onClick={handleDeleteEbook}>
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </VStack>
  )
}
