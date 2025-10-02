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
  Avatar,
} from '@chakra-ui/react'

import { collection, getDocs, query, where } from 'firebase/firestore'
import { MdDelete } from 'react-icons/md'

import { useRouter } from 'next/router'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { StudentDetailsModal } from './student-details-modal'
import { DeleteStudentModal } from './delete-student-modal'
import { useIndividualPaymentReminder } from '../../../../hooks/useIndividualPaymentReminder'
import { ReminderConfirmationModal } from './student-payment-reminder'
import { FiBell } from 'react-icons/fi'
import { ExportStudentsButton } from '../../../../components/ExportStudentsButton'
import { StudentActivationModal } from './StudentActivationModal'

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
  isStudentActive?: boolean
  deactivationReason?: string
  createdAt: any
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  gender?: string
  occupation?: string
  owingStatus?: string
  address?: string
  guardianName?: string
  guardianPhone?: string
}

function trimUrl(url: string, maxLength = 25): string {
  if (!url) return ''
  if (url.length <= maxLength) return url
  return url.slice(0, maxLength) + '...'
}

export const StudentList = () => {
  const [students, setStudents] = useState<StudentData[]>([])
  const [loading, setIsLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [selectedStudent, setSelectedStudent] = useState<StudentData | null>(
    null,
  )
  const [reminderStudent, setReminderStudent] = useState<StudentData | null>(
    null,
  )
  const [activationStudent, setActivationStudent] =
    useState<StudentData | null>(null)
  const { sendIndividualReminder, isLoading: isReminderLoading } =
    useIndividualPaymentReminder()

  //  function to check if student has pending payment
  const hasPendingPayment = (student: StudentData): boolean => {
    const schoolFeeInfo = student.schoolFeeInfo
    if (!schoolFeeInfo) return false

    const totalFee = schoolFeeInfo.totalSchoolFee || 0
    const totalPaid = schoolFeeInfo.totalApproved || 0

    return totalPaid < totalFee
  }

  // Open reminder modal
  const handleOpenReminderModal = (student: StudentData) => {
    setReminderStudent(student) // Use separate state
    onReminderOpen()
  }

  // Handle sending reminder
  const handleSendReminder = async () => {
    if (!reminderStudent) return

    const result = await sendIndividualReminder(reminderStudent)
    if (result.success) {
      onReminderClose()
      setReminderStudent(null)
    }
  }

  // Pagination state
  const [currentPage, setCurrentPage] = useState(1)
  const [pageSize] = useState(20) // Show 20 students per page
  const [totalPages, setTotalPages] = useState(1)

  const { portalUser } = usePortalAuth()
  const router = useRouter()
  const isAdmin = portalUser?.role === 'admin'

  // Modal disclosures
  const {
    isOpen: isReminderOpen,
    onOpen: onReminderOpen,
    onClose: onReminderClose,
  } = useDisclosure()
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
  const {
    isOpen: isActivationOpen,
    onOpen: onActivationOpen,
    onClose: onActivationClose,
  } = useDisclosure()

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

  // Calculate total pages based on filtered students
  useEffect(() => {
    const total = Math.ceil(filteredStudents.length / pageSize)
    setTotalPages(total)

    // Reset to first page if current page exceeds total pages
    if (currentPage > total && total > 0) {
      setCurrentPage(1)
    }
  }, [filteredStudents.length, pageSize, currentPage])

  // Get paginated students for current page
  const paginatedStudents = useMemo(() => {
    const startIndex = (currentPage - 1) * pageSize
    const endIndex = startIndex + pageSize
    return filteredStudents.slice(startIndex, endIndex)
  }, [filteredStudents, currentPage, pageSize])

  // Pagination handlers
  const handlePrevPage = () => {
    if (currentPage > 1) {
      setCurrentPage(currentPage - 1)
    }
  }

  const handleNextPage = () => {
    if (currentPage < totalPages) {
      setCurrentPage(currentPage + 1)
    }
  }

  const handlePageChange = (page: number) => {
    setCurrentPage(page)
  }

  // Reset pagination when filters change
  useEffect(() => {
    setCurrentPage(1)
  }, [filters])

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

  // Fetch students from Firebase
  const fetchStudents = async () => {
    if (!isAdmin) {
      setError('Only administrators can view student list')
      setIsLoading(false)
      return
    }

    try {
      setIsLoading(true)
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
          address: data.address || 'Not specified',
          guardianName: data.guardianName || 'Not available',
          guardianPhone: data.guardianPhone || 'Not available',
          role: data.role || 'student',
          emailVerified: data.emailVerified || false,
          registrationComplete: data.registrationComplete || false,
          onboardingComplete: data.onboardingComplete || false,
          isStudentActive: data.isStudentActive || false,
          deactivationReason: data.deactivationReason,
          createdAt: data.createdAt,
          schoolFeeInfo: data.schoolFeeInfo,
          growthInfo: data.growthInfo,
          termsAgreed: data.termsAgreed || false,
          gender: data.gender,
          occupation: data.occupation,
          owingStatus:
            data.schoolFeeInfo &&
            data.schoolFeeInfo.totalSchoolFee &&
            data.schoolFeeInfo.totalApproved
              ? data.schoolFeeInfo.totalSchoolFee ===
                data.schoolFeeInfo.totalApproved
                ? 'Paid'
                : 'Owing'
              : 'Not Set',
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
      setIsLoading(false)
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

  // Handle activation toggle
  const handleActivationToggle = (student: StudentData) => {
    setActivationStudent(student)
    onActivationOpen()
  }
  // Handle status change (refresh data after activation/deactivation)
  const handleStatusChange = () => {
    fetchStudents() // Refresh the student list
  }

  const handleStudentDeleted = () => {
    // Refresh the student list
    fetchStudents()
  }

  // Generate page numbers for pagination
  const getPageNumbers = () => {
    const pages = []
    const maxVisiblePages = 5
    const startPage = Math.max(1, currentPage - Math.floor(maxVisiblePages / 2))
    const endPage = Math.min(totalPages, startPage + maxVisiblePages - 1)

    for (let i = startPage; i <= endPage; i++) {
      pages.push(i)
    }
    return pages
  }

  return (
    <VStack w="full" spacing={6} align="stretch">
      {/* Header with Stats and Actions */}
      <Flex justify="space-between" align="center" wrap="wrap" gap={4}>
        <Box>
          <Text fontSize="2xl" fontWeight="bold" color="gray.800">
            Student Management
          </Text>
          <Text fontSize="sm" color="gray.600">
            {loading
              ? 'Loading...'
              : `${filteredStudents.length} students found`}
          </Text>
        </Box>

        {!loading && filteredStudents.length > 0 && (
          <Box display={'flex'} alignItems="center" gap={2}>
            <Button
              variant="outline"
              colorScheme="blue"
              size="sm"
              onClick={fetchStudents}
            >
              Refresh
            </Button>
            <ExportStudentsButton
              students={filteredStudents}
              filters={filters}
              variant="button"
              size="sm"
            />
          </Box>
        )}
      </Flex>

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
          {paginatedStudents.map((student) => (
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
                    {hasPendingPayment(student) && (
                      <Button
                        size="xs"
                        bg="orange.500"
                        color="white"
                        borderRadius="sm"
                        px={2}
                        py={1}
                        _hover={{ bg: 'orange.600' }}
                        fontWeight="normal"
                        fontSize="xs"
                        onClick={() => handleOpenReminderModal(student)}
                        isLoading={isReminderLoading}
                      >
                        <FiBell size={14} />
                      </Button>
                    )}
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
                      minW="40px"
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
                  <Flex justify="space-between" align="center">
                    <Badge
                      colorScheme={
                        student.isStudentActive !== false ? 'green' : 'red'
                      }
                      variant="subtle"
                      fontSize="xs"
                    >
                      Student is{' '}
                      {student.isStudentActive !== false
                        ? 'Active'
                        : 'Inactive'}
                    </Badge>
                    <Button
                      size="xs"
                      variant="outline"
                      colorScheme={
                        student.isStudentActive !== false ? 'red' : 'green'
                      }
                      onClick={() => handleActivationToggle(student)}
                      fontSize="xs"
                      minW="50px"
                    >
                      {student.isStudentActive !== false
                        ? 'Deactivate'
                        : 'Activate'}
                    </Button>
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
                <Box>
                  <Text
                    minW="100px"
                    fontSize="sm"
                    color="gray.700"
                    textAlign="center"
                  >
                    {student.growthInfo?.profession || 'Banker'}
                  </Text>
                  <Badge
                    colorScheme={
                      student.isStudentActive !== false ? 'green' : 'red'
                    }
                    variant="subtle"
                    fontSize="xs"
                  >
                    Student is{' '}
                    {student.isStudentActive !== false ? 'Active' : 'Inactive'}
                  </Badge>
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
                  {hasPendingPayment(student) && (
                    <Button
                      size="xs"
                      bg="orange.500"
                      color="white"
                      borderRadius="sm"
                      px={2}
                      py={1}
                      _hover={{ bg: 'orange.600' }}
                      fontSize="sm"
                      fontWeight="normal"
                      minW="40px"
                      onClick={() => handleOpenReminderModal(student)}
                    >
                      <FiBell size={16} />
                    </Button>
                  )}
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
                    size="sm"
                    variant="outline"
                    colorScheme={
                      student.isStudentActive !== false ? 'red' : 'green'
                    }
                    onClick={() => handleActivationToggle(student)}
                    fontSize="xs"
                    minW="50px"
                  >
                    {student.isStudentActive !== false
                      ? 'Deactivate'
                      : 'Activate'}
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

          {/* Pagination Controls */}
          {totalPages > 1 && (
            <Flex justify="center" align="center" pt={6} gap={2} wrap="wrap">
              {/* Previous Button */}
              <Button
                onClick={handlePrevPage}
                isDisabled={currentPage === 1}
                variant="outline"
                size="sm"
                colorScheme="blue"
              >
                Previous
              </Button>

              {/* Page Numbers */}
              <HStack spacing={1}>
                {getPageNumbers().map((page) => (
                  <Button
                    key={page}
                    onClick={() => handlePageChange(page)}
                    variant={currentPage === page ? 'solid' : 'outline'}
                    size="sm"
                    colorScheme="blue"
                    minW="40px"
                  >
                    {page}
                  </Button>
                ))}
              </HStack>

              {/* Next Button */}
              <Button
                onClick={handleNextPage}
                isDisabled={currentPage === totalPages}
                variant="outline"
                size="sm"
                colorScheme="blue"
              >
                Next
              </Button>
            </Flex>
          )}

          {/* Pagination Info */}
          {filteredStudents.length > 0 && (
            <Flex justify="center" pt={2}>
              <Text fontSize="sm" color="gray.500">
                Showing {(currentPage - 1) * pageSize + 1} to{' '}
                {Math.min(currentPage * pageSize, filteredStudents.length)} of{' '}
                {filteredStudents.length} students
                {totalPages > 1 && ` (Page ${currentPage} of ${totalPages})`}
              </Text>
            </Flex>
          )}
        </VStack>
      )}

      {/* Student Reminder */}
      <ReminderConfirmationModal
        isOpen={isReminderOpen}
        onClose={onReminderClose}
        onConfirm={handleSendReminder}
        student={reminderStudent}
        isLoading={isReminderLoading}
      />

      {/* Student Details Modal */}
      {selectedStudent && (
        <StudentDetailsModal
          isOpen={isDetailsOpen}
          onClose={onDetailsClose}
          student={selectedStudent}
          adminUser={portalUser}
        />
      )}

      {/* Student Activation Modal */}
      {activationStudent && (
        <StudentActivationModal
          isOpen={isActivationOpen}
          onClose={onActivationClose}
          student={activationStudent}
          onStatusChange={handleStatusChange}
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
