import React, { useState, useRef, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  FormControl,
  FormLabel,
  Input,
  Textarea,
  VStack,
  HStack,
  Box,
  Text,
  Avatar,
  Badge,
  useToast,
  Image,
  IconButton,
  Grid,
  GridItem,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react'
import { FiSearch, FiUpload, FiX } from 'react-icons/fi'
import { useSOTWActions } from '../../../../hooks/useSOTW'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { SOTWImage } from '../../../../types/sotw.types'
import { collection, query, where, getDocs, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { useSOTWImageUpload } from '../../../../hooks/useSOTWImageUpload'

interface CreateSOTWModalProps {
  isOpen: boolean
  onClose: () => void
  onSOTWCreated: () => void
}

interface StudentData {
  uid: string
  fullName: string
  email: string
  cohort?: string
  classPlan?: string
  avatar?: string
  isStudentActive?: boolean
}

export const CreateSOTWModal: React.FC<CreateSOTWModalProps> = ({
  isOpen,
  onClose,
  onSOTWCreated,
}) => {
  const { setSOTW } = useSOTWActions()
  const { uploadSOTWImage, uploading: cloudinaryUploading } =
    useSOTWImageUpload()
  const { portalUser } = usePortalAuth()
  const toast = useToast()
  const fileInputRef = useRef<HTMLInputElement>(null)

  const [loading, setLoading] = useState(false)
  const [searchTerm, setSearchTerm] = useState('')
  const [students, setStudents] = useState<StudentData[]>([])
  const [allStudents, setAllStudents] = useState<StudentData[]>([])
  const [searching, setSearching] = useState(false)
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null,
  )
  const [igLink, setIgLink] = useState('')
  const [projectName, setProjectName] = useState('')
  const [citation, setCitation] = useState('')
  const [workHighlight, setWorkHighlight] = useState('')
  const [workImages, setWorkImages] = useState<SOTWImage[]>([])
  const [uploadingImages, setUploadingImages] = useState(false)

  // Load all students when modal opens
  useEffect(() => {
    if (isOpen) {
      loadAllStudents()
    }
  }, [isOpen])

  const loadAllStudents = async () => {
    try {
      setSearching(true)
      // Simple query without complex filters that require indexes
      const studentsQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
        orderBy('fullName', 'asc'),
      )

      const querySnapshot = await getDocs(studentsQuery)
      const studentsData: StudentData[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        studentsData.push({
          uid: doc.id,
          fullName: data.fullName || 'Unknown',
          email: data.email || '',
          cohort: data.schoolFeeInfo?.cohort,
          classPlan: data.schoolFeeInfo?.classPlan,
          avatar: data.growthInfo?.pictureUrl || '',
          isStudentActive: data.isStudentActive !== false,
        })
      })

      setAllStudents(studentsData)
      setStudents(studentsData) // Initially show all students
    } catch (error) {
      console.error('Error loading students:', error)
      toast({
        title: 'Failed to load students',
        description: 'Please try again',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSearching(false)
    }
  }

  const handleSearchStudents = () => {
    if (!searchTerm.trim()) {
      // If search is empty, show all active students
      setStudents(
        allStudents.filter((student) => student.isStudentActive !== false),
      )
      return
    }

    setSearching(true)
    try {
      const filteredStudents = allStudents.filter(
        (student) =>
          student.isStudentActive !== false &&
          (student.fullName?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.email?.toLowerCase().includes(searchTerm.toLowerCase()) ||
            student.cohort?.toLowerCase().includes(searchTerm.toLowerCase())),
      )
      setStudents(filteredStudents)
    } catch (error) {
      console.error('Error filtering students:', error)
      toast({
        title: 'Search failed',
        description: 'Failed to search students',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setSearching(false)
    }
  }

  // Debounced search
  useEffect(() => {
    if (!isOpen) return

    const timer = setTimeout(() => {
      handleSearchStudents()
    }, 300) // 300ms debounce

    return () => clearTimeout(timer)
  }, [searchTerm, isOpen])

  // HandleImageUpload function with error logging and detailed steps
  const handleImageUpload = async (files: FileList) => {
    setUploadingImages(true)
    try {
      for (let i = 0; i < files.length; i++) {
        const file = files[i]
        if (file.type.startsWith('image/')) {
          const result = await uploadSOTWImage(file)

          const image: SOTWImage = {
            id: Date.now().toString() + i,
            url: result.url,
            caption: '',
            uploadedAt: new Date(),
          }
          setWorkImages((prev) => [...prev, image])
        }
      }
      toast({
        title: 'Images uploaded successfully',
        status: 'success',
        duration: 3000,
      })
    } catch (error: any) {
      console.error('❌ Image upload failed:', error)
      toast({
        title: 'Upload failed',
        description: error.message,
        status: 'error',
        duration: 3000,
      })
    } finally {
      setUploadingImages(false)
    }
  }

  const removeImage = (imageId: string) => {
    setWorkImages((prev) => prev.filter((img) => img.id !== imageId))
  }

  const handleSubmit = async () => {
    if (!selectedStudent || !citation.trim() || !workHighlight.trim()) {
      toast({
        title: 'Missing information',
        description:
          'Please select a student and provide both citation and work highlight',
        status: 'error',
        duration: 3000,
      })
      return
    }

    // Check if student is active
    if (selectedStudent.isStudentActive === false) {
      toast({
        title: 'Student is inactive',
        description: 'Cannot select an inactive student as Student of the Week',
        status: 'error',
        duration: 3000,
      })
      return
    }

    setLoading(true)
    const result = await setSOTW(
      {
        studentId: selectedStudent.uid,
        studentName: selectedStudent.fullName,
        studentEmail: selectedStudent.email,
        studentAvatar: selectedStudent.avatar || '',
        cohort: selectedStudent.cohort || 'Not assigned',
        classPlan: selectedStudent.classPlan || 'Not specified',
        projectName: projectName.trim(),
        igLink: igLink.trim(),
        citation: citation.trim(),
        workHighlight: workHighlight.trim(),
        workImages,
      },
      portalUser,
    )

    if (result.success) {
      toast({
        title: 'Student of the Week set! 🎉',
        description: `${selectedStudent.fullName} is now the Student of the Week`,
        status: 'success',
        duration: 5000,
      })
      onSOTWCreated()
      resetForm()
      onClose()
    } else {
      toast({
        title: 'Error',
        description: result.error || 'Failed to set Student of the Week',
        status: 'error',
        duration: 3000,
      })
    }
    setLoading(false)
  }

  const resetForm = () => {
    setSelectedStudent(null)
    setIgLink('')
    setProjectName('')
    setCitation('')
    setWorkHighlight('')
    setWorkImages([])
    setSearchTerm('')
    setStudents(
      allStudents.filter((student) => student.isStudentActive !== false),
    )
  }

  const handleClose = () => {
    resetForm()
    onClose()
  }

  return (
    <Modal isOpen={isOpen} onClose={handleClose} size="4xl">
      <ModalOverlay />
      <ModalContent>
        <ModalHeader>Set Student of the Week</ModalHeader>
        <ModalCloseButton />
        <ModalBody>
          <VStack spacing={4} align="stretch">
            {/* Student Search */}
            <Box>
              <FormLabel fontWeight="bold">Search Student</FormLabel>
              <HStack>
                <Input
                  placeholder="Search by name, email, or cohort..."
                  value={searchTerm}
                  onChange={(e) => setSearchTerm(e.target.value)}
                  onKeyPress={(e) =>
                    e.key === 'Enter' && handleSearchStudents()
                  }
                />
                <Button
                  leftIcon={<FiSearch />}
                  onClick={handleSearchStudents}
                  isDisabled={searching}
                  isLoading={searching}
                >
                  Search
                </Button>
              </HStack>

              <Text fontSize="sm" color="gray.600" mt={1}>
                {students.length} student(s) found
                {searchTerm && ` matching "${searchTerm}"`}
              </Text>

              {/* Search Results */}
              {searching ? (
                <Box mt={3} textAlign="center" py={4}>
                  <Spinner size="sm" />
                  <Text mt={2}>Searching students...</Text>
                </Box>
              ) : students.length > 0 ? (
                <Box
                  mt={3}
                  maxH="300px"
                  overflowY="auto"
                  border="1px"
                  borderColor="gray.200"
                  borderRadius="md"
                >
                  {students.map((student) => (
                    <HStack
                      key={student.uid}
                      p={3}
                      borderBottom="1px"
                      borderColor="gray.100"
                      cursor="pointer"
                      _hover={{ bg: 'gray.50' }}
                      _last={{ borderBottom: 'none' }}
                      onClick={() => setSelectedStudent(student)}
                      bg={
                        selectedStudent?.uid === student.uid
                          ? 'blue.50'
                          : 'transparent'
                      }
                      borderLeft={
                        selectedStudent?.uid === student.uid
                          ? '4px solid'
                          : 'none'
                      }
                      borderLeftColor={
                        selectedStudent?.uid === student.uid
                          ? 'blue.500'
                          : 'transparent'
                      }
                    >
                      <Avatar
                        size="sm"
                        name={student.fullName}
                        src={student.avatar}
                      />
                      <Box flex={1}>
                        <Text fontWeight="medium">{student.fullName}</Text>
                        <Text fontSize="sm" color="gray.600">
                          {student.email}
                        </Text>
                        <HStack spacing={2} mt={1}>
                          {student.cohort && (
                            <Badge colorScheme="blue" fontSize="xs">
                              {student.cohort}
                            </Badge>
                          )}
                          {student.classPlan && (
                            <Badge colorScheme="green" fontSize="xs">
                              {student.classPlan}
                            </Badge>
                          )}
                          {student.isStudentActive === false && (
                            <Badge colorScheme="red" fontSize="xs">
                              Inactive
                            </Badge>
                          )}
                        </HStack>
                      </Box>
                    </HStack>
                  ))}
                </Box>
              ) : (
                <Box
                  mt={3}
                  p={4}
                  textAlign="center"
                  bg="gray.50"
                  borderRadius="md"
                >
                  <Text color="gray.600">No students found</Text>
                </Box>
              )}

              {/* Selected Student */}
              {selectedStudent && (
                <Box mt={4} p={3} bg="blue.100" borderRadius="md">
                  <HStack justify="space-between">
                    <HStack>
                      <Avatar
                        name={selectedStudent.fullName}
                        src={selectedStudent.avatar}
                      />
                      <Box>
                        <Text fontWeight="bold">
                          {selectedStudent.fullName}
                        </Text>
                        <Text fontSize="sm" color="gray.600">
                          {selectedStudent.email}
                        </Text>
                        <HStack spacing={2} mt={1}>
                          <Badge colorScheme="blue">
                            {selectedStudent.cohort || 'No cohort'}
                          </Badge>
                          <Badge colorScheme="green">
                            {selectedStudent.classPlan || 'No plan'}
                          </Badge>
                          {selectedStudent.isStudentActive === false && (
                            <Badge colorScheme="red">Inactive</Badge>
                          )}
                        </HStack>
                      </Box>
                    </HStack>
                    <Button
                      size="sm"
                      variant="outline"
                      onClick={() => setSelectedStudent(null)}
                    >
                      Change
                    </Button>
                  </HStack>
                </Box>
              )}
            </Box>

            {/* Project Name */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Project Name</FormLabel>
              <Textarea
                placeholder="e.g - Google Website..."
                value={projectName}
                onChange={(e) => setProjectName(e.target.value)}
                rows={2}
              />
            </FormControl>
            {/* IG Link */}
            <FormControl>
              <FormLabel fontWeight="bold">IG Link</FormLabel>
              <Textarea
                placeholder="e.g - https://www.instagram.com/fiwa_perxels..."
                value={igLink}
                onChange={(e) => setIgLink(e.target.value)}
                rows={2}
              />
            </FormControl>
            {/* Citation */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Citation / Remarks</FormLabel>
              <Textarea
                placeholder="Write a special citation or remarks about why this student was selected..."
                value={citation}
                onChange={(e) => setCitation(e.target.value)}
                rows={4}
              />
            </FormControl>

            {/* Work Highlight */}
            <FormControl isRequired>
              <FormLabel fontWeight="bold">Work / Project Highlight</FormLabel>
              <Textarea
                placeholder="Highlight specific work, projects, or achievements..."
                value={workHighlight}
                onChange={(e) => setWorkHighlight(e.target.value)}
                rows={4}
              />
            </FormControl>

            {/* Work Images */}
            <Box>
              <FormLabel fontWeight="bold">Work Images (Optional)</FormLabel>
              <input
                type="file"
                ref={fileInputRef}
                multiple
                accept="image/*"
                onChange={(e) =>
                  e.target.files && handleImageUpload(e.target.files)
                }
                style={{ display: 'none' }}
              />

              <Button
                leftIcon={<FiUpload />}
                onClick={() => fileInputRef.current?.click()}
                isLoading={uploadingImages || cloudinaryUploading}
                mb={3}
              >
                Upload Images
              </Button>

              {/* Image Preview */}
              {workImages.length > 0 && (
                <Grid
                  templateColumns="repeat(auto-fill, minmax(150px, 1fr))"
                  gap={3}
                >
                  {workImages.map((image) => (
                    <GridItem key={image.id} position="relative">
                      <Box
                        border="1px"
                        borderColor="gray.200"
                        borderRadius="md"
                        overflow="hidden"
                      >
                        <Image
                          src={image.url}
                          alt="Work image"
                          height="120px"
                          width="100%"
                          objectFit="cover"
                        />
                        <IconButton
                          aria-label="Remove image"
                          icon={<FiX />}
                          size="xs"
                          position="absolute"
                          top={1}
                          right={1}
                          colorScheme="red"
                          onClick={() => removeImage(image.id)}
                        />
                      </Box>
                    </GridItem>
                  ))}
                </Grid>
              )}
            </Box>

            <Alert status="info">
              <AlertIcon />
              Setting a new Student of the Week will automatically archive the
              current one.
            </Alert>
          </VStack>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={handleClose}>
            Cancel
          </Button>
          <Button
            colorScheme="purple"
            onClick={handleSubmit}
            isLoading={loading}
            isDisabled={
              !selectedStudent ||
              !citation.trim() ||
              !workHighlight.trim() ||
              selectedStudent.isStudentActive === false
            }
          >
            Set as Student of the Week
          </Button>
        </ModalFooter>
      </ModalContent>
    </Modal>
  )
}
