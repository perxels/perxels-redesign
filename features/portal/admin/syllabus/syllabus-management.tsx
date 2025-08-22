import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  Badge,
  IconButton,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalFooter,
  ModalCloseButton,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Divider,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { MdAdd, MdEdit, MdDelete, MdVisibility, MdContentCopy } from 'react-icons/md'
import { collection, getDocs, addDoc, updateDoc, deleteDoc, doc, serverTimestamp } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { Syllabus, CreateSyllabusFormData } from '../../../../types/syllabus.types'
import { DEFAULT_SYLLABUS } from '../../../../constant/defaultSyllabus'
import { SyllabusForm } from './syllabus-form'
import { SyllabusViewer } from './syllabus-viewer'

export const SyllabusManagement = () => {
  const [syllabi, setSyllabi] = useState<Syllabus[]>([])
  const [loading, setLoading] = useState(true)
  const [selectedSyllabus, setSelectedSyllabus] = useState<Syllabus | null>(null)
  const [isSubmitting, setIsSubmitting] = useState(false)
  const [error, setError] = useState<string | null>(null)
  
  const { isOpen: isFormOpen, onOpen: onFormOpen, onClose: onFormClose } = useDisclosure()
  const { isOpen: isViewOpen, onOpen: onViewOpen, onClose: onViewClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()
  
  const toast = useToast()
  const { user, portalUser } = usePortalAuth()

  // Check if user is admin
  const isAdmin = portalUser?.role === 'admin'

  const fetchSyllabi = async () => {
    if (!isAdmin) return
    
    setLoading(true)
    setError(null)
    try {
      const querySnapshot = await getDocs(collection(portalDb, 'syllabi'))
      const syllabiData: Syllabus[] = querySnapshot.docs.map(doc => {
        const data = doc.data()
        return {
          id: doc.id,
          name: data.name,
          description: data.description,
          totalWeeks: data.totalWeeks,
          totalDays: data.totalDays,
          weeks: data.weeks,
          createdAt: data.createdAt?.toDate() || new Date(),
          updatedAt: data.updatedAt?.toDate() || new Date(),
          createdBy: data.createdBy,
          isActive: data.isActive,
          version: data.version,
        }
      })
      setSyllabi(syllabiData)
    } catch (err) {
      console.error('Error fetching syllabi:', err)
      setError('Failed to fetch syllabi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchSyllabi()
  }, [isAdmin])

  const handleCreateSyllabus = async (formData: CreateSyllabusFormData) => {
    if (!user?.uid || !isAdmin) return

    setIsSubmitting(true)
    setError(null)

    try {
      const syllabusData = {
        ...formData,
        totalWeeks: formData.weeks.length,
        totalDays: formData.weeks.reduce((acc, week) => acc + week.days.length, 0),
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        isActive: true,
        version: '1.0.0',
      }

      await addDoc(collection(portalDb, 'syllabi'), syllabusData)

      toast({
        title: 'Syllabus Created Successfully! 🎉',
        description: `${formData.name} has been created`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onFormClose()
      fetchSyllabi()
    } catch (err) {
      console.error('Error creating syllabus:', err)
      setError('Failed to create syllabus')
      toast({
        title: 'Error',
        description: 'Failed to create syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUpdateSyllabus = async (syllabusId: string, formData: CreateSyllabusFormData) => {
    if (!user?.uid || !isAdmin) return

    setIsSubmitting(true)
    setError(null)

    try {
      const syllabusData = {
        ...formData,
        totalWeeks: formData.weeks.length,
        totalDays: formData.weeks.reduce((acc, week) => acc + week.days.length, 0),
        updatedAt: serverTimestamp(),
      }

      await updateDoc(doc(portalDb, 'syllabi', syllabusId), syllabusData)

      toast({
        title: 'Syllabus Updated Successfully! ✅',
        description: `${formData.name} has been updated`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onFormClose()
      fetchSyllabi()
    } catch (err) {
      console.error('Error updating syllabus:', err)
      setError('Failed to update syllabus')
      toast({
        title: 'Error',
        description: 'Failed to update syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleDeleteSyllabus = async () => {
    if (!selectedSyllabus || !user?.uid || !isAdmin) return

    setIsSubmitting(true)
    setError(null)

    try {
      await deleteDoc(doc(portalDb, 'syllabi', selectedSyllabus.id))

      toast({
        title: 'Syllabus Deleted Successfully! 🗑️',
        description: `${selectedSyllabus.name} has been deleted`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      onDeleteClose()
      setSelectedSyllabus(null)
      fetchSyllabi()
    } catch (err) {
      console.error('Error deleting syllabus:', err)
      setError('Failed to delete syllabus')
      toast({
        title: 'Error',
        description: 'Failed to delete syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleUseDefaultSyllabus = async () => {
    if (!user?.uid || !isAdmin) return

    setIsSubmitting(true)
    setError(null)

    try {
      const syllabusData = {
        ...DEFAULT_SYLLABUS,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        isActive: true,
        version: '1.0.0',
      }

      await addDoc(collection(portalDb, 'syllabi'), syllabusData)

      toast({
        title: 'Default Syllabus Created Successfully! 🎉',
        description: 'UI/UX Design Foundation Course syllabus has been created',
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      fetchSyllabi()
    } catch (err) {
      console.error('Error creating default syllabus:', err)
      setError('Failed to create default syllabus')
      toast({
        title: 'Error',
        description: 'Failed to create default syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  const handleEdit = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus)
    onFormOpen()
  }

  const handleView = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus)
    onViewOpen()
  }

  const handleDelete = (syllabus: Syllabus) => {
    setSelectedSyllabus(syllabus)
    onDeleteOpen()
  }

  const handleDuplicate = async (syllabus: Syllabus) => {
    if (!user?.uid || !isAdmin) return

    setIsSubmitting(true)
    setError(null)

    try {
      const { id, ...syllabusWithoutId } = syllabus
      const duplicatedSyllabus = {
        ...syllabusWithoutId,
        name: `${syllabus.name} (Copy)`,
        createdAt: serverTimestamp(),
        updatedAt: serverTimestamp(),
        createdBy: user.uid,
        isActive: true,
        version: '1.0.0',
      }

      await addDoc(collection(portalDb, 'syllabi'), duplicatedSyllabus)

      toast({
        title: 'Syllabus Duplicated Successfully! 📋',
        description: `${syllabus.name} has been duplicated`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      fetchSyllabi()
    } catch (err) {
      console.error('Error duplicating syllabus:', err)
      setError('Failed to duplicate syllabus')
      toast({
        title: 'Error',
        description: 'Failed to duplicate syllabus',
        status: 'error',
        duration: 5000,
        isClosable: true,
      })
    } finally {
      setIsSubmitting(false)
    }
  }

  // Show loading while checking auth
  if (!isAdmin) {
    return (
      <Alert status="warning">
        <AlertIcon />
        <AlertDescription>Only administrators can manage syllabi.</AlertDescription>
      </Alert>
    )
  }

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading syllabi...</Text>
      </Box>
    )
  }

  return (
    <Box>
      {/* Header */}
      <VStack spacing={6} align="stretch">
        <HStack justify="space-between" align="center">
          <VStack align="start" spacing={2}>
            <Heading size="lg">Syllabus Management</Heading>
            <Text color="gray.600">Manage course syllabi and curriculum</Text>
          </VStack>
          <HStack spacing={3}>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="blue"
              onClick={handleUseDefaultSyllabus}
              isLoading={isSubmitting}
              loadingText="Creating..."
            >
              Use Default Syllabus
            </Button>
            <Button
              leftIcon={<MdAdd />}
              colorScheme="purple"
              onClick={() => {
                setSelectedSyllabus(null)
                onFormOpen()
              }}
            >
              Create New Syllabus
            </Button>
          </HStack>
        </HStack>

        {/* Stats */}
        <HStack spacing={6}>
          <Stat>
            <StatLabel>Total Syllabi</StatLabel>
            <StatNumber>{syllabi.length}</StatNumber>
            <StatHelpText>Available course syllabi</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Active Syllabi</StatLabel>
            <StatNumber>{syllabi.filter(s => s.isActive).length}</StatNumber>
            <StatHelpText>Currently active</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Total Weeks</StatLabel>
            <StatNumber>{syllabi.reduce((acc, s) => acc + s.totalWeeks, 0)}</StatNumber>
            <StatHelpText>Across all syllabi</StatHelpText>
          </Stat>
        </HStack>

        {error && (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        )}

        {/* Syllabi Table */}
        <Card>
          <CardHeader>
            <Heading size="md">Course Syllabi</Heading>
          </CardHeader>
          <CardBody>
            {syllabi.length === 0 ? (
              <Box textAlign="center" py={10}>
                <Text color="gray.500" mb={4}>No syllabi found</Text>
                <Button
                  colorScheme="purple"
                  onClick={handleUseDefaultSyllabus}
                  isLoading={isSubmitting}
                  loadingText="Creating..."
                >
                  Create Default Syllabus
                </Button>
              </Box>
            ) : (
              <Table variant="simple">
                <Thead>
                  <Tr>
                    <Th>Name</Th>
                    <Th>Description</Th>
                    <Th>Weeks</Th>
                    <Th>Days</Th>
                    <Th>Status</Th>
                    <Th>Version</Th>
                    <Th>Actions</Th>
                  </Tr>
                </Thead>
                <Tbody>
                  {syllabi.map((syllabus) => (
                    <Tr key={syllabus.id}>
                      <Td fontWeight="medium">{syllabus.name}</Td>
                      <Td>
                        <Text noOfLines={2} maxW="300px">
                          {syllabus.description}
                        </Text>
                      </Td>
                      <Td>{syllabus.totalWeeks}</Td>
                      <Td>{syllabus.totalDays}</Td>
                      <Td>
                        <Badge
                          colorScheme={syllabus.isActive ? 'green' : 'gray'}
                          variant="subtle"
                        >
                          {syllabus.isActive ? 'Active' : 'Inactive'}
                        </Badge>
                      </Td>
                      <Td>{syllabus.version}</Td>
                      <Td>
                        <HStack spacing={2}>
                          <IconButton
                            aria-label="View syllabus"
                            icon={<MdVisibility />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleView(syllabus)}
                          />
                          <IconButton
                            aria-label="Edit syllabus"
                            icon={<MdEdit />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleEdit(syllabus)}
                          />
                          <IconButton
                            aria-label="Duplicate syllabus"
                            icon={<MdContentCopy />}
                            size="sm"
                            variant="ghost"
                            onClick={() => handleDuplicate(syllabus)}
                          />
                          <IconButton
                            aria-label="Delete syllabus"
                            icon={<MdDelete />}
                            size="sm"
                            variant="ghost"
                            colorScheme="red"
                            onClick={() => handleDelete(syllabus)}
                          />
                        </HStack>
                      </Td>
                    </Tr>
                  ))}
                </Tbody>
              </Table>
            )}
          </CardBody>
        </Card>
      </VStack>

      {/* Syllabus Form Modal */}
      <Modal isOpen={isFormOpen} onClose={onFormClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSyllabus ? 'Edit Syllabus' : 'Create New Syllabus'}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <SyllabusForm
              syllabus={selectedSyllabus}
              onSubmit={selectedSyllabus ? 
                (data) => handleUpdateSyllabus(selectedSyllabus.id, data) : 
                handleCreateSyllabus
              }
              isSubmitting={isSubmitting}
            />
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Syllabus Viewer Modal */}
      <Modal isOpen={isViewOpen} onClose={onViewClose} size="6xl" scrollBehavior="inside">
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>
            {selectedSyllabus?.name}
          </ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            {selectedSyllabus && (
              <SyllabusViewer syllabus={selectedSyllabus} />
            )}
          </ModalBody>
        </ModalContent>
      </Modal>

      {/* Delete Confirmation Modal */}
      <Modal isOpen={isDeleteOpen} onClose={onDeleteClose}>
        <ModalOverlay />
        <ModalContent>
          <ModalHeader>Delete Syllabus</ModalHeader>
          <ModalCloseButton />
          <ModalBody>
            <Text>
              Are you sure you want to delete &quot;{selectedSyllabus?.name}&quot;? This action cannot be undone.
            </Text>
          </ModalBody>
          <ModalFooter>
            <Button variant="ghost" mr={3} onClick={onDeleteClose}>
              Cancel
            </Button>
            <Button
              colorScheme="red"
              onClick={handleDeleteSyllabus}
              isLoading={isSubmitting}
              loadingText="Deleting..."
            >
              Delete
            </Button>
          </ModalFooter>
        </ModalContent>
      </Modal>
    </Box>
  )
}
