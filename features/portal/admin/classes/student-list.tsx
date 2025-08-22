import React, { useState, useEffect, useMemo } from 'react'
import {
  Box,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Badge,
  Button,
  Flex,
  useDisclosure,
  HStack,
} from '@chakra-ui/react'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { MdDelete } from 'react-icons/md'

import { useRouter } from 'next/router'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { StudentDetailsModal } from './student-details-modal'
import { DeleteStudentModal } from './delete-student-modal'

interface StudentData {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: string
  emailVerified: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  createdAt: any
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  gender?: string
  occupation?: string
  owingStatus?: string
}

function trimUrl(url: string, maxLength = 25): string {
  if (!url) return ''
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength) + '...'
}

export const StudentList = () => {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(null)

  const { portalUser } = usePortalAuth()
  const router = useRouter()
  const isAdmin = portalUser?.role === 'admin'
  
  const { isOpen: isDetailsOpen, onOpen: onDetailsOpen, onClose: onDetailsClose } = useDisclosure()
  const { isOpen: isDeleteOpen, onOpen: onDeleteOpen, onClose: onDeleteClose } = useDisclosure()

  // Get filters from query string
  const filters = useMemo(() => {
    return {
      search: (router.query.search as string) || '',
      class: (router.query.class as string) || '',
      classPlan: (router.query.classPlan as string) || '',
      branch: (router.query.branch as string) || 'all',
      paymentStatus: (router.query.paymentStatus as string) || 'all',
      status: (router.query.status as string) || 'all',
    }
  }, [router.query])

  // Apply filters to students
  const filteredStudents = useMemo(() => {
    let filtered = [...students]

    // Filter by search term (name, email, phone)
    if (filters.search) {
      filtered = filtered.filter(
        (student) =>
          student.fullName
            .toLowerCase()
            .includes(filters.search.toLowerCase()) ||
          student.email.toLowerCase().includes(filters.search.toLowerCase()) ||
          student.phone.includes(filters.search),
      )
    }

    // Filter by class (cohort)
    if (filters.class) {
      filtered = filtered.filter((student) => {
        const studentCohort = student.schoolFeeInfo?.cohort || ''
        return studentCohort.toLowerCase().includes(filters.class.toLowerCase())
      })
    }

    // Filter by class plan
    if (filters.classPlan) {
      filtered = filtered.filter((student) => {
        const studentClassPlan = student.schoolFeeInfo?.classPlan || ''
        return studentClassPlan
          .toLowerCase()
          .includes(filters.classPlan.toLowerCase())
      })
    }

    // Filter by branch
    if (filters.branch && filters.branch !== 'all') {
      filtered = filtered.filter((student) =>
        student.branch.toLowerCase().includes(filters.branch.toLowerCase()),
      )
    }

    // Filter by payment status
    if (filters.paymentStatus && filters.paymentStatus !== 'all') {
      filtered = filtered.filter((student) => {
        const studentPaymentStatus = student.owingStatus || 'Owing'

        // Map student payment status to filter values
        let mappedStatus = 'pending'
        if (studentPaymentStatus === 'Paid') {
          mappedStatus = 'completed'
        } else if (studentPaymentStatus === 'Owing') {
          mappedStatus = 'pending'
        } else if (studentPaymentStatus === 'Partial') {
          mappedStatus = 'partial'
        } else if (studentPaymentStatus === 'Overdue') {
          mappedStatus = 'overdue'
        }

        return mappedStatus === filters.paymentStatus
      })
    }

    // Filter by status
    if (filters.status && filters.status !== 'all') {
      filtered = filtered.filter((student) => {
        const status = getStudentStatusKey(student)
        return status === filters.status
      })
    }

    return filtered
  }, [students, filters])

  // Fetch students from Firebase
  const fetchStudents = async () => {
    if (!isAdmin) {
      setError('Only administrators can view student list')
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      const studentsQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
      )

      const querySnapshot = await getDocs(studentsQuery)
      const studentsData: StudentData[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        studentsData.push({
          uid: doc.id,
          email: data.email || '',
          fullName: data.fullName || 'N/A',
          phone: data.phone || 'N/A',
          branch: data.branch || 'Not specified',
          role: data.role || 'student',
          emailVerified: data.emailVerified || false,
          registrationComplete: data.registrationComplete || false,
          onboardingComplete: data.onboardingComplete || false,
          createdAt: data.createdAt,
          schoolFeeInfo: data.schoolFeeInfo,
          growthInfo: data.growthInfo,
          termsAgreed: data.termsAgreed || false,
          gender: data.gender,
          occupation: data.occupation,
          owingStatus: data.owingStatus,
        })
      })

      // Sort by creation date (newest first) on client side
      const sortedStudents = studentsData.sort((a, b) => {
        if (!a.createdAt || !b.createdAt) return 0
        const dateA = a.createdAt.toDate
          ? a.createdAt.toDate()
          : new Date(a.createdAt)
        const dateB = b.createdAt.toDate
          ? b.createdAt.toDate()
          : new Date(b.createdAt)
        return dateB.getTime() - dateA.getTime()
      })

      setStudents(sortedStudents)
    } catch (err: any) {
      console.error('Error fetching students:', err)
      setError('Failed to load students. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  // Load students on component mount
  useEffect(() => {
    fetchStudents()
  }, [isAdmin])

  // Get student status key for filtering
  const getStudentStatusKey = (student: StudentData) => {
    if (!student.emailVerified) return 'email-pending'
    if (!student.registrationComplete) return 'registration-incomplete'
    if (!student.onboardingComplete) return 'onboarding-pending'
    return 'active'
  }

  const handleViewDetails = (student: StudentData) => {
    setSelectedStudent(student)
    onDetailsOpen()
  }

  const handleDeleteStudent = (student: StudentData) => {
    setSelectedStudent(student)
    onDeleteOpen()
  }

  const handleStudentDeleted = () => {
    // Refresh the student list
    fetchStudents()
  }

  return (
    <VStack w="full" spacing={6} align="stretch">
      {/* Loading State */}
      {loading ? (
        <Box textAlign="center" py={12}>
          <Spinner size="lg" color="purple.500" />
          <Text mt={4} color="gray.600">
            Loading students...
          </Text>
        </Box>
      ) : error ? (
        /* Error State */
        <Alert status="error">
          <AlertIcon />
          <AlertDescription>{error}</AlertDescription>
        </Alert>
      ) : filteredStudents.length === 0 ? (
        /* Empty State */
        <Alert status="info">
          <AlertIcon />
          <AlertDescription>
            {students.length === 0
              ? 'No students found. Students will appear here once they register.'
              : 'No students match your current filters. Try adjusting your search criteria.'}
          </AlertDescription>
        </Alert>
      ) : (
        /* Students Grid */
        <VStack spacing={4} align="stretch">
          {filteredStudents.map((student) => (
            <Box
              key={student.uid}
              bg="gray.100"
              borderRadius="lg"
              px={{ base: 3, md: 4 }}
              py={{ base: 4, md: 3 }}
              boxShadow="sm"
            >
              {/* Mobile Layout */}
              <Box display={{ base: 'block', md: 'none' }}>
                <Flex justify="space-between" align="center" mb={3}>
                  <Box flex="1">
                    <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
                      {student.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.700" noOfLines={1}>
                      {student.phone}
                    </Text>
                  </Box>
                  <HStack spacing={2}>
                    <Button
                      size="xs"
                      bg="gray.700"
                      color="white"
                      borderRadius="sm"
                      px={3}
                      py={1}
                      _hover={{ bg: 'gray.800' }}
                      fontSize="xs"
                      fontWeight="normal"
                      minW="70px"
                      onClick={() => handleViewDetails(student)}
                    >
                      Details
                    </Button>
                    <Button
                      size="xs"
                      bg="red.500"
                      color="white"
                      borderRadius="sm"
                      px={3}
                      py={1}
                      _hover={{ bg: 'red.600' }}
                      fontSize="xs"
                      fontWeight="normal"
                      minW="70px"
                      onClick={() => handleDeleteStudent(student)}
                    >
                      <MdDelete size={14} />
                    </Button>
                  </HStack>
                </Flex>

                <VStack spacing={2} align="stretch">
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.700" noOfLines={1} flex="1">
                      {student.email}
                    </Text>
                    <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                      {student.growthInfo?.gender || 'Female'}
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.500" noOfLines={1} flex="1">
                      {trimUrl(student?.growthInfo?.pictureUrl)}
                    </Text>
                    <Badge colorScheme="blue" variant="subtle" fontSize="xs">
                      {student.growthInfo?.profession || 'Banker'}
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600">
                      Status:
                    </Text>
                    <Badge
                      colorScheme={
                        student.owingStatus === 'Paid' ? 'green' : 'red'
                      }
                      variant="subtle"
                      fontSize="xs"
                    >
                      {student.owingStatus || 'Owing'}
                    </Badge>
                  </Flex>
                </VStack>
              </Box>

              {/* Desktop Layout */}
              <Flex
                display={{ base: 'none', md: 'flex' }}
                alignItems="center"
                justifyContent="space-between"
                gap={4}
              >
                {/* Name and Phone */}
                <Box minW="180px">
                  <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
                    {student.fullName}
                  </Text>
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {student.phone}
                  </Text>
                </Box>

                {/* Email and Profile Link */}
                <Box minW="220px">
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {student.email}
                  </Text>
                  <Text fontSize="sm" color="gray.500" noOfLines={1}>
                    {trimUrl(student?.growthInfo?.pictureUrl)}
                  </Text>
                </Box>

                {/* Gender */}
                <Text
                  minW="80px"
                  fontSize="sm"
                  color="gray.700"
                  textAlign="center"
                >
                  {student.growthInfo?.gender || 'Female'}
                </Text>

                {/* Occupation */}
                <Text
                  minW="100px"
                  fontSize="sm"
                  color="gray.700"
                  textAlign="center"
                >
                  {student.growthInfo?.profession || 'Banker'}
                </Text>

                {/* Owing Status */}
                <Text
                  minW="80px"
                  fontWeight="bold"
                  fontSize="md"
                  color="gray.800"
                  textAlign="center"
                >
                  {student.owingStatus || 'Owing'}
                </Text>

                {/* Action Buttons */}
                <HStack spacing={2}>
                  <Button
                    size="xs"
                    bg="gray.700"
                    color="white"
                    borderRadius="sm"
                    px={3}
                    py={1}
                    _hover={{ bg: 'gray.800' }}
                    fontSize="xs"
                    fontWeight="normal"
                    minW="70px"
                    onClick={() => handleViewDetails(student)}
                  >
                    See Details
                  </Button>
                  <Button
                    size="xs"
                    bg="red.500"
                    color="white"
                    borderRadius="sm"
                    px={3}
                    py={1}
                    _hover={{ bg: 'red.600' }}
                    fontSize="xs"
                    fontWeight="normal"
                    minW="70px"
                    onClick={() => handleDeleteStudent(student)}
                  >
                    <MdDelete size={14} />
                  </Button>
                </HStack>
              </Flex>
            </Box>
          ))}
        </VStack>
      )}

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          student={selectedStudent}
        />
      )}

      {/* Delete Student Modal */}
      {selectedStudent && (
        <DeleteStudentModal
          isOpen={isDeleteOpen}
          onClose={onDeleteClose}
          student={selectedStudent}
          onStudentDeleted={handleStudentDeleted}
          adminUser={portalUser}
        />
      )}
    </VStack>
  )
}
