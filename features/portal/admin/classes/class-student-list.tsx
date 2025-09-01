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
  Input,
  InputGroup,
  InputLeftElement,
  Avatar,
  Select,
} from '@chakra-ui/react'
import { MdSearch, MdDelete } from 'react-icons/md'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { StudentDetailsModal } from './student-details-modal'
import { DeleteStudentModal } from './delete-student-modal'
import { classPlans } from '../../../../constant/adminConstants'

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
}

interface ClassStudentListProps {
  classId: string
  cohortName: string
}

export const ClassStudentList: React.FC<ClassStudentListProps> = ({
  classId,
  cohortName,
}) => {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null,
  )
  const [searchTerm, setSearchTerm] = useState('')
  const [selectedClassPlan, setSelectedClassPlan] = useState<string>('all')

  const { portalUser } = usePortalAuth()
  const isAdmin = portalUser?.role === 'admin'

  const {
    isOpen: isDetailsOpen,
    onOpen: onDetailsOpen,
    onClose: onDetailsClose,
  } = useDisclosure()
  const {
    isOpen: isDeleteOpen,
    onOpen: onDeleteOpen,
    onClose: onDeleteClose,
  } = useDisclosure()

  // Filter students by search term, class plan, and class
  const filteredStudents = useMemo(() => {
    let filtered = [...students]

    // Filter by search term (name, email, phone)
    if (searchTerm) {
      filtered = filtered.filter(
        (student) =>
          student.fullName.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.email.toLowerCase().includes(searchTerm.toLowerCase()) ||
          student.phone.includes(searchTerm),
      )
    }

    // Filter by class plan
    if (selectedClassPlan && selectedClassPlan !== 'all') {
      filtered = filtered.filter((student) => {
        const studentClassPlan = student.schoolFeeInfo?.classPlan || ''
        return studentClassPlan === selectedClassPlan
      })
    }

    // Filter by class (cohort)
    filtered = filtered.filter((student) => {
      const studentCohort = student.schoolFeeInfo?.cohort || ''
      return studentCohort.toLowerCase().includes(cohortName.toLowerCase())
    })

    return filtered
  }, [students, searchTerm, selectedClassPlan, cohortName])

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

  // Format date for display
  const formatDate = (timestamp: any) => {
    if (!timestamp) return 'N/A'

    try {
      const date = timestamp.toDate ? timestamp.toDate() : new Date(timestamp)
      return date.toLocaleDateString('en-US', {
        year: 'numeric',
        month: 'short',
        day: 'numeric',
      })
    } catch {
      return 'N/A'
    }
  }

  // Calculate owing status based on payment data
  const calculateOwingStatus = (student: StudentData): string => {
    const schoolFeeInfo = student.schoolFeeInfo

    if (!schoolFeeInfo) {
      return 'No Payment Info'
    }

    const totalSchoolFee = schoolFeeInfo.totalSchoolFee || 0
    const totalApproved = schoolFeeInfo.totalApproved || 0

    // If approved payments equal or exceed total school fee, student is paid
    if (totalApproved >= totalSchoolFee) {
      return 'Paid'
    }

    // Otherwise, student is owing
    return 'Owing'
  }

  // Get payment details for display
  const getPaymentDetails = (student: StudentData) => {
    const schoolFeeInfo = student.schoolFeeInfo

    if (!schoolFeeInfo) {
      return { totalFee: 0, paid: 0, remaining: 0, progress: 0 }
    }

    const totalFee = schoolFeeInfo.totalSchoolFee || 0
    const paid = schoolFeeInfo.totalApproved || 0
    const remaining = Math.max(0, totalFee - paid)
    const progress = totalFee > 0 ? (paid / totalFee) * 100 : 0

    return { totalFee, paid, remaining, progress }
  }

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

  const trimUrl = (url: string) => {
    if (!url) return 'N/A'
    return url.length > 30 ? url.substring(0, 30) + '...' : url
  }

  return (
    <VStack w="full" spacing={6} align="stretch">
      {/* Search and Stats */}
      <VStack spacing={4} align="stretch">
        <HStack justify="space-between" align="center">
          <Text fontSize="lg" fontWeight="semibold">
            Students in {cohortName}
          </Text>
          <Badge colorScheme="blue" variant="subtle">
            {filteredStudents.length} students
          </Badge>
        </HStack>

        {/* Filters Row */}
        <HStack spacing={4} align="center">
          {/* Class Plan Filter */}
          <Box minW="250px">
            <Text fontSize="sm" color="gray.700" mb={2}>
              Class Plan
            </Text>
            <Select
              value={selectedClassPlan}
              onChange={(e) => setSelectedClassPlan(e.target.value)}
              size="md"
              bg="white"
              borderColor="gray.300"
              _hover={{ borderColor: 'gray.400' }}
              _focus={{ borderColor: 'purple.500', boxShadow: 'outline' }}
            >
              <option value="all">All Class Plans</option>
              {classPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </Select>
          </Box>

          {/* Search Input */}
          <Box flex="1">
            <Text fontSize="sm" color="gray.700" mb={2}>
              Search
            </Text>
            <InputGroup>
              <InputLeftElement pointerEvents="none">
                <MdSearch color="gray.300" />
              </InputLeftElement>
              <Input
                placeholder="Search students by name, email, or phone..."
                value={searchTerm}
                onChange={(e) => setSearchTerm(e.target.value)}
              />
            </InputGroup>
          </Box>
        </HStack>
      </VStack>

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
              ? 'No students found in this class. Students will appear here once they register and are assigned to this cohort.'
              : 'No students match your current search criteria. Try adjusting your search or class plan filter.'}
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
                  <HStack spacing={2}>
                    <Avatar
                      name={student.fullName}
                      src={student?.growthInfo?.pictureUrl}
                    />
                    <Box minW="180px">
                      <Text
                        fontWeight="bold"
                        fontSize="md"
                        mb={1}
                        noOfLines={1}
                      >
                        {student.fullName}
                      </Text>
                      <Text fontSize="sm" color="gray.700" noOfLines={1}>
                        {student.phone}
                      </Text>
                    </Box>
                  </HStack>
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

                  {/* Class Plan Display (Mobile) */}
                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600">
                      Class Plan:
                    </Text>
                    <Badge
                      colorScheme="teal"
                      variant="subtle"
                      fontSize="xs"
                      maxW="120px"
                      noOfLines={1}
                    >
                      {student.schoolFeeInfo?.classPlan || 'Not specified'}
                    </Badge>
                  </Flex>

                  <Flex justify="space-between" align="center">
                    <Text fontSize="sm" color="gray.600">
                      Status:
                    </Text>
                    <Badge
                      colorScheme={
                        calculateOwingStatus(student) === 'Paid'
                          ? 'green'
                          : 'red'
                      }
                      variant="subtle"
                      fontSize="xs"
                    >
                      {calculateOwingStatus(student)}
                    </Badge>
                  </Flex>

                  {/* Payment Progress (Mobile) */}
                  {student.schoolFeeInfo && (
                    <VStack spacing={1} align="stretch">
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        Payment Status
                      </Text>
                      <HStack spacing={2} justify="center" fontSize="xs">
                        <VStack spacing={0}>
                          <Text color="red.600" fontWeight="medium">
                            Owing
                          </Text>
                          <Text color="red.600">
                            ₦
                            {getPaymentDetails(
                              student,
                            ).remaining.toLocaleString()}
                          </Text>
                        </VStack>
                        <Text color="gray.400">|</Text>
                        <VStack spacing={0}>
                          <Text color="green.600" fontWeight="medium">
                            Paid
                          </Text>
                          <Text color="green.600">
                            ₦{getPaymentDetails(student).paid.toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                      {/* Progress Bar */}
                      <Box
                        w="full"
                        bg="gray.200"
                        borderRadius="full"
                        h="2px"
                        mt={1}
                      >
                        <Box
                          bg="green.500"
                          h="2px"
                          borderRadius="full"
                          w={`${getPaymentDetails(student).progress}%`}
                          transition="width 0.3s ease"
                        />
                      </Box>
                      <Text fontSize="xs" color="gray.500" textAlign="center">
                        {getPaymentDetails(student).progress.toFixed(0)}%
                        Complete
                      </Text>
                    </VStack>
                  )}
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
                <HStack spacing={2}>
                  <Avatar
                    name={student.fullName}
                    src={student?.growthInfo?.pictureUrl}
                  />
                  <Box minW="180px">
                    <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
                      {student.fullName}
                    </Text>
                    <Text fontSize="sm" color="gray.700" noOfLines={1}>
                      {student.phone}
                    </Text>
                  </Box>
                </HStack>

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

                {/* Class Plan */}
                <Box minW="150px" textAlign="center">
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {student.schoolFeeInfo?.classPlan || 'Not specified'}
                  </Text>
                </Box>

                {/* Payment Progress */}
                <Box minW="120px" textAlign="center">
                  {student.schoolFeeInfo ? (
                    <VStack spacing={1}>
                      <Text fontSize="sm" fontWeight="medium" color="gray.800">
                        {calculateOwingStatus(student)}
                      </Text>
                      <HStack spacing={2} fontSize="xs">
                        <VStack spacing={0}>
                          <Text color="red.600" fontWeight="medium">
                            Owing
                          </Text>
                          <Text color="red.600">
                            ₦
                            {getPaymentDetails(
                              student,
                            ).remaining.toLocaleString()}
                          </Text>
                        </VStack>
                        <Text color="gray.400">|</Text>
                        <VStack spacing={0}>
                          <Text color="green.600" fontWeight="medium">
                            Paid
                          </Text>
                          <Text color="green.600">
                            ₦{getPaymentDetails(student).paid.toLocaleString()}
                          </Text>
                        </VStack>
                      </HStack>
                      {/* Progress Bar */}
                      <Box
                        w="full"
                        bg="gray.200"
                        borderRadius="full"
                        h="2px"
                        mt={1}
                      >
                        <Box
                          bg="green.500"
                          h="2px"
                          borderRadius="full"
                          w={`${getPaymentDetails(student).progress}%`}
                          transition="width 0.3s ease"
                        />
                      </Box>
                      <Text fontSize="xs" color="gray.500">
                        {getPaymentDetails(student).progress.toFixed(0)}%
                        Complete
                      </Text>
                    </VStack>
                  ) : (
                    <Text fontSize="sm" color="gray.500">
                      No Payment Info
                    </Text>
                  )}
                </Box>

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
