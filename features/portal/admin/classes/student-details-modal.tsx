import React, { useState, useEffect } from 'react'
import {
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalFooter,
  ModalBody,
  ModalCloseButton,
  Button,
  VStack,
  HStack,
  Text,
  Box,
  Badge,
  Spinner,
  Alert,
  AlertIcon,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Table,
  Thead,
  Tbody,
  Tr,
  Th,
  Td,
  useToast,
  Flex,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
} from '@chakra-ui/react'
import { collection, getDocs, query, where, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'

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

interface PaymentRecord {
  id: string
  amount: number
  date: Date
  receiptUrl?: string
  status: 'pending' | 'approved' | 'rejected'
  type: 'initial' | 'installment'
  installmentNumber?: number
  reviewedAt?: Date
  reviewedBy?: string
}

interface AttendanceRecord {
  id: string
  date: Date
  status: 'present' | 'absent' | 'late'
  class: string
  notes?: string
}

interface StudentDetailsModalProps {
  isOpen: boolean
  onClose: () => void
  student: StudentData
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  student,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const toast = useToast()
  const {
    isOpen: isImageOpen,
    onClose: onImageClose,
    imageUrl,
    title,
    openImagePreview,
  } = useImagePreview()

  // Fetch payment records from schoolFeeInfo
  const fetchPayments = async () => {
    try {
      setLoadingPayments(true)

      // Get payments from schoolFeeInfo.payments array
      const schoolFeeInfo = student.schoolFeeInfo
      if (!schoolFeeInfo || !schoolFeeInfo.payments) {
        setPayments([])
        return
      }

      const paymentsData: PaymentRecord[] = []

      // Convert the payments object/array to our PaymentRecord format
      Object.entries(schoolFeeInfo.payments).forEach(
        ([key, paymentData]: [string, any]) => {
          // Handle different date formats
          let paymentDate: Date
          if (paymentData.reviewedAt) {
            if (paymentData.reviewedAt.toDate) {
              // Firestore timestamp
              paymentDate = paymentData.reviewedAt.toDate()
            } else if (typeof paymentData.reviewedAt === 'string') {
              // String date
              paymentDate = new Date(paymentData.reviewedAt)
            } else if (paymentData.reviewedAt instanceof Date) {
              // Already a Date object
              paymentDate = paymentData.reviewedAt
            } else {
              // Fallback to current date
              paymentDate = new Date()
            }
          } else {
            // Fallback to current date if no reviewedAt
            paymentDate = new Date()
          }

          paymentsData.push({
            id: key,
            amount: paymentData.amount || 0,
            date: paymentDate,
            receiptUrl: paymentData.paymentReceiptUrl,
            status: 'approved', // Payments in schoolFeeInfo are typically approved
            type:
              paymentData.installmentNumber === 1 ? 'initial' : 'installment',
            installmentNumber: paymentData.installmentNumber,
            reviewedAt: paymentDate,
            reviewedBy: paymentData.reviewedBy,
          })
        },
      )

      // Sort by date (newest first)
      paymentsData.sort((a, b) => b.date.getTime() - a.date.getTime())

      setPayments(paymentsData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load payment records',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoadingPayments(false)
    }
  }

  // Fetch attendance records
  const fetchAttendance = async () => {
    try {
      setLoadingAttendance(true)

      // Get student's cohort/class
      const studentCohort = student.schoolFeeInfo?.cohort || ''

      if (!studentCohort) {
        setAttendance([])
        return
      }

      // Query all attendance documents for this student's cohort
      const attendanceQuery = query(
        collection(portalDb, 'attendance'),
        where('classId', '==', studentCohort),
      )

      const attendanceSnapshot = await getDocs(attendanceQuery)
      const attendanceData: AttendanceRecord[] = []

      // For each attendance document, check if student was present in checkins subcollection
      for (const attendanceDoc of attendanceSnapshot.docs) {
        const attendanceDocData = attendanceDoc.data()
        const attendanceDate =
          attendanceDocData.date || attendanceDoc.id.split('_')[1] // Extract date from document ID

        // Check if student exists in checkins subcollection
        // First, let's get all checkins for this attendance record
        const checkinsCollection = collection(
          portalDb,
          'attendance',
          attendanceDoc.id,
          'checkins',
        )
        const checkinSnapshot = await getDocs(checkinsCollection)

        // Check if any document in checkins has the student's ID as the document ID
        const isPresent = checkinSnapshot.docs.some(
          (doc) => doc.id === student.uid,
        )

        // Parse date
        let parsedDate: Date
        if (attendanceDate) {
          if (typeof attendanceDate === 'string') {
            parsedDate = new Date(attendanceDate)
          } else if (attendanceDate.toDate) {
            parsedDate = attendanceDate.toDate()
          } else {
            parsedDate = new Date(attendanceDate)
          }
        } else {
          // Fallback: try to parse date from document ID
          const dateFromId = attendanceDoc.id.split('_')[1]
          parsedDate = dateFromId ? new Date(dateFromId) : new Date()
        }

        attendanceData.push({
          id: attendanceDoc.id,
          date: parsedDate,
          status: isPresent ? 'present' : 'absent',
          class: studentCohort,
          notes: isPresent ? 'Checked in' : 'No check-in record',
        })
      }

      // Sort by date (newest first)
      attendanceData.sort((a, b) => b.date.getTime() - a.date.getTime())

      setAttendance(attendanceData)
    } catch (error) {
      toast({
        title: 'Error',
        description: 'Failed to load attendance records',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoadingAttendance(false)
    }
  }

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPayments()
      fetchAttendance()
    }
  }, [isOpen, student.uid])

  const formatDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  }

  const formatCurrency = (amount: number) => {
    return new Intl.NumberFormat('en-NG', {
      style: 'currency',
      currency: 'NGN',
    }).format(amount)
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'present':
      case 'approved':
      case 'Paid':
        return 'green'
      case 'absent':
      case 'rejected':
      case 'Owing':
        return 'red'
      case 'late':
      case 'pending':
      case 'Partial':
        return 'orange'
      case 'Overdue':
        return 'red'
      default:
        return 'gray'
    }
  }

  const getAttendanceStats = () => {
    const total = attendance.length
    const present = attendance.filter((a) => a.status === 'present').length
    const absent = attendance.filter((a) => a.status === 'absent').length
    const late = attendance.filter((a) => a.status === 'late').length
    const attendanceRate = total > 0 ? ((present + late) / total) * 100 : 0

    return { total, present, absent, late, attendanceRate }
  }

  const getPaymentStats = () => {
    const totalPaid = payments.reduce((sum, p) => sum + p.amount, 0)
    const totalOwed = student.schoolFeeInfo?.totalSchoolFee || 0
    const balance = totalOwed - totalPaid
    const paymentProgress = totalOwed > 0 ? (totalPaid / totalOwed) * 100 : 0

    return { totalPaid, totalOwed, balance, paymentProgress }
  }

  const attendanceStats = getAttendanceStats()
  const paymentStats = getPaymentStats()

  return (
    <Modal isOpen={isOpen} onClose={onClose} size="6xl" scrollBehavior="inside">
      <ModalOverlay />
      <ModalContent maxH="90vh">
        <ModalHeader>
          <VStack align="start" spacing={2}>
            <Text fontSize="2xl" fontWeight="bold">
              {student.fullName}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Student ID: {student.uid}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
            <TabList>
              <Tab>Overview</Tab>
              <Tab>Payment History</Tab>
              <Tab>Attendance</Tab>
            </TabList>

            <TabPanels>
              {/* Overview Tab */}
              <TabPanel>
                <VStack spacing={6} align="stretch">
                  {/* Student Profile */}
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Student Information
                    </Text>
                    <Flex gap={8} wrap="wrap">
                      <Box flex="1" minW="200px">
                        <VStack align="start" spacing={3}>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Full Name
                            </Text>
                            <Text fontWeight="medium">{student.fullName}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Email
                            </Text>
                            <Text fontWeight="medium">{student.email}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Phone
                            </Text>
                            <Text fontWeight="medium">{student.phone}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Gender
                            </Text>
                            <Text fontWeight="medium">
                              {student.growthInfo?.gender || 'Not specified'}
                            </Text>
                          </Box>
                        </VStack>
                      </Box>
                      <Box flex="1" minW="200px">
                        <VStack align="start" spacing={3}>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Occupation
                            </Text>
                            <Text fontWeight="medium">
                              {student.growthInfo?.profession ||
                                'Not specified'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Branch
                            </Text>
                            <Text fontWeight="medium">{student.branch}</Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Cohort
                            </Text>
                            <Text fontWeight="medium">
                              {student.schoolFeeInfo?.cohort || 'Not assigned'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Class Plan
                            </Text>
                            <Text fontWeight="medium">
                              {student.schoolFeeInfo?.classPlan ||
                                'Not specified'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Overall Status
                            </Text>
                            <Badge
                              colorScheme={getStatusColor(
                                student.schoolFeeInfo?.overallStatus ||
                                  'pending',
                              )}
                            >
                              {student.schoolFeeInfo?.overallStatus ||
                                'Pending'}
                            </Badge>
                          </Box>
                        </VStack>
                      </Box>
                    </Flex>
                  </Box>

                  {/* Stats Overview */}
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Quick Stats
                    </Text>
                    <Flex gap={4} wrap="wrap">
                      <Stat
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        shadow="sm"
                        minW="150px"
                      >
                        <StatLabel>Payment Progress</StatLabel>
                        <StatNumber>
                          {paymentStats.paymentProgress.toFixed(1)}%
                        </StatNumber>
                        <StatHelpText>
                          {formatCurrency(paymentStats.totalPaid)} /{' '}
                          {formatCurrency(paymentStats.totalOwed)}
                        </StatHelpText>
                      </Stat>
                      <Stat
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        shadow="sm"
                        minW="150px"
                      >
                        <StatLabel>Attendance Rate</StatLabel>
                        <StatNumber>
                          {attendanceStats.attendanceRate.toFixed(1)}%
                        </StatNumber>
                        <StatHelpText>
                          {attendanceStats.present + attendanceStats.late} /{' '}
                          {attendanceStats.total} classes
                        </StatHelpText>
                      </Stat>
                      <Stat
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        shadow="sm"
                        minW="150px"
                      >
                        <StatLabel>Balance</StatLabel>
                        <StatNumber
                          color={
                            paymentStats.balance > 0 ? 'red.500' : 'green.500'
                          }
                        >
                          {formatCurrency(paymentStats.balance)}
                        </StatNumber>
                        <StatHelpText>
                          {paymentStats.balance > 0
                            ? 'Outstanding'
                            : 'Fully Paid'}
                        </StatHelpText>
                      </Stat>
                      <Stat
                        bg="white"
                        p={4}
                        borderRadius="lg"
                        shadow="sm"
                        minW="150px"
                      >
                        <StatLabel>Registration Status</StatLabel>
                        <StatNumber>
                          <Badge
                            colorScheme={
                              student.registrationComplete ? 'green' : 'orange'
                            }
                          >
                            {student.registrationComplete
                              ? 'Complete'
                              : 'Incomplete'}
                          </Badge>
                        </StatNumber>
                        <StatHelpText>
                          {student.emailVerified
                            ? 'Email Verified'
                            : 'Email Pending'}
                        </StatHelpText>
                      </Stat>
                    </Flex>
                  </Box>

                  {/* Account Status */}
                  <Box bg="gray.50" p={4} borderRadius="lg">
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Account Status
                    </Text>
                    <Flex gap={4} wrap="wrap">
                      <Badge
                        colorScheme={student.emailVerified ? 'green' : 'red'}
                        p={2}
                      >
                        Email: {student.emailVerified ? 'Verified' : 'Pending'}
                      </Badge>
                      <Badge
                        colorScheme={
                          student.registrationComplete ? 'green' : 'orange'
                        }
                        p={2}
                      >
                        Registration:{' '}
                        {student.registrationComplete
                          ? 'Complete'
                          : 'Incomplete'}
                      </Badge>
                      <Badge
                        colorScheme={
                          student.onboardingComplete ? 'green' : 'orange'
                        }
                        p={2}
                      >
                        Onboarding:{' '}
                        {student.onboardingComplete ? 'Complete' : 'Pending'}
                      </Badge>
                      <Badge
                        colorScheme={student.termsAgreed ? 'green' : 'red'}
                        p={2}
                      >
                        Terms: {student.termsAgreed ? 'Agreed' : 'Pending'}
                      </Badge>
                    </Flex>
                  </Box>
                </VStack>
              </TabPanel>

              {/* Payment History Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Payment History
                    </Text>
                    {loadingPayments ? (
                      <Box textAlign="center" py={8}>
                        <Spinner size="lg" color="purple.500" />
                        <Text mt={4}>Loading payment records...</Text>
                      </Box>
                    ) : payments.length === 0 ? (
                      <Alert status="info">
                        <AlertIcon />
                        No payment records found for this student.
                      </Alert>
                    ) : (
                      <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Date</Th>
                              <Th>Amount</Th>
                              <Th>Installment</Th>
                              <Th>Type</Th>
                              <Th>Receipt</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {payments.map((payment) => (
                              <Tr key={payment.id}>
                                <Td>{formatDate(payment.date)}</Td>
                                <Td fontWeight="bold">
                                  {formatCurrency(payment.amount)}
                                </Td>
                                <Td>
                                  <Badge colorScheme="blue" variant="subtle">
                                    #{payment.installmentNumber}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Badge
                                    colorScheme={
                                      payment.type === 'initial'
                                        ? 'blue'
                                        : 'purple'
                                    }
                                  >
                                    {payment.type}
                                  </Badge>
                                </Td>
                                <Td>
                                  {payment.receiptUrl ? (
                                    <Button
                                      size="xs"
                                      colorScheme="blue"
                                      variant="outline"
                                      onClick={() =>
                                        openImagePreview(
                                          payment.receiptUrl!,
                                          `${student.fullName} - Payment Receipt #${payment.installmentNumber}`,
                                        )
                                      }
                                    >
                                      View
                                    </Button>
                                  ) : (
                                    <Text fontSize="sm" color="gray.500">
                                      No receipt
                                    </Text>
                                  )}
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </Box>
                </VStack>
              </TabPanel>

              {/* Attendance Tab */}
              <TabPanel>
                <VStack spacing={4} align="stretch">
                  <Box>
                    <Text fontSize="lg" fontWeight="bold" mb={4}>
                      Attendance Records
                    </Text>
                    {loadingAttendance ? (
                      <Box textAlign="center" py={8}>
                        <Spinner size="lg" color="purple.500" />
                        <Text mt={4}>Loading attendance records...</Text>
                      </Box>
                    ) : attendance.length === 0 ? (
                      <Alert status="info">
                        <AlertIcon />
                        No attendance records found for this student.
                      </Alert>
                    ) : (
                      <Box overflowX="auto">
                        <Table variant="simple" size="sm">
                          <Thead>
                            <Tr>
                              <Th>Date</Th>
                              <Th>Class</Th>
                              <Th>Status</Th>
                              <Th>Notes</Th>
                            </Tr>
                          </Thead>
                          <Tbody>
                            {attendance.map((record) => (
                              <Tr key={record.id}>
                                <Td>{formatDate(record.date)}</Td>
                                <Td>{record.class}</Td>
                                <Td>
                                  <Badge
                                    colorScheme={getStatusColor(record.status)}
                                  >
                                    {record.status}
                                  </Badge>
                                </Td>
                                <Td>
                                  <Text fontSize="sm" color="gray.600">
                                    {record.notes || '-'}
                                  </Text>
                                </Td>
                              </Tr>
                            ))}
                          </Tbody>
                        </Table>
                      </Box>
                    )}
                  </Box>
                </VStack>
              </TabPanel>
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageUrl={imageUrl}
        title={title}
      />
    </Modal>
  )
}
