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
  FormControl,
  FormLabel,
  Select,
  HStack,
  useDisclosure,
  AlertDialog,
  AlertDialogOverlay,
  AlertDialogContent,
  AlertDialogHeader,
  AlertDialogBody,
  AlertDialogFooter,
} from '@chakra-ui/react'
import {
  collection,
  doc,
  getDocs,
  query,
  updateDoc,
  where,
} from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import {
  ImagePreviewModal,
  useImagePreview,
} from '../../../../components/ImagePreviewModal'
import { usePaymentNotifications } from '../../../../hooks/usePaymentNotifications'
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
  owingStatus?: string
  address?: string
  guardianName?: string
  guardianPhone?: string
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
  onCohortChanged: () => void
  student: StudentData
  adminUser: any // Add admin user prop
}

// Add this interface for cohort change
interface CohortChange {
  oldCohort: string
  newCohort: string
  oldClassPlan: string
  newClassPlan: string
  changedAt: Date
  changedBy: string
  reason?: string
}

export const StudentDetailsModal: React.FC<StudentDetailsModalProps> = ({
  isOpen,
  onClose,
  onCohortChanged,
  student,
  adminUser,
}) => {
  const [payments, setPayments] = useState<PaymentRecord[]>([])
  const [attendance, setAttendance] = useState<AttendanceRecord[]>([])
  const [loadingPayments, setLoadingPayments] = useState(false)
  const [loadingAttendance, setLoadingAttendance] = useState(false)
  const [activeTab, setActiveTab] = useState(0)
  const [availableCohorts, setAvailableCohorts] = useState<string[]>([])
  const [selectedCohort, setSelectedCohort] = useState('')
  const [selectedClassPlan, setSelectedClassPlan] = useState('')
  const [isChangingCohort, setIsChangingCohort] = useState(false)
  const toast = useToast()
  const {
    isOpen: isImageOpen,
    onClose: onImageClose,
    imageUrl,
    title,
    openImagePreview,
  } = useImagePreview()
  const { sendPaymentNotification, isLoading: isNotificationLoading } =
    usePaymentNotifications()

  // Cohort change confirmation dialog
  const {
    isOpen: isCohortDialogOpen,
    onOpen: onCohortDialogOpen,
    onClose: onCohortDialogClose,
  } = useDisclosure()
  const cancelRef = React.useRef<HTMLButtonElement>(null)
  const isFacilitator = adminUser?.role === 'facilitator'

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

  // Fetch available cohorts from your system
  const fetchAvailableCohorts = async () => {
    try {
      // You might have a cohorts collection or get them from existing students
      const studentsQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
      )

      const querySnapshot = await getDocs(studentsQuery)
      const cohorts = new Set<string>()

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        if (data.schoolFeeInfo?.cohort) {
          cohorts.add(data.schoolFeeInfo.cohort)
        }
      })

      // Add common cohorts if needed
      const commonCohorts = [
        'COHORT 62',
        'COHORT 61',
        'COHORT 60',
        'COHORT 59',
        'COHORT 58',
        'COHORT 57',
        'COHORT 56',
        'COHORT 55',
      ]

      commonCohorts.forEach((cohort) => cohorts.add(cohort))

      setAvailableCohorts(Array.from(cohorts).sort().reverse()) // Latest first
    } catch (error) {
      console.error('Error fetching cohorts:', error)
    }
  }

  // Update cohort function
  const updateStudentCohort = async (
    newCohort: string,
    newClassPlan: string,
  ) => {
    if (!adminUser) {
      toast({
        title: 'Authentication required',
        description: 'You must be logged in as admin to change cohorts',
        status: 'error',
        duration: 3000,
      })
      return false
    }

    if (!student.schoolFeeInfo) {
      toast({
        title: 'No school fee info',
        description: 'Student does not have school fee information',
        status: 'error',
        duration: 3000,
      })
      return false
    }

    setIsChangingCohort(true)

    try {
      const studentRef = doc(portalDb, 'users', student.uid)
      const oldCohort = student.schoolFeeInfo.cohort || 'Not assigned'
      const oldClassPlan = student.schoolFeeInfo.classPlan || 'Not assigned'

      await updateDoc(studentRef, {
        'schoolFeeInfo.cohort': newCohort,
        'schoolFeeInfo.classPlan': newClassPlan,
        'schoolFeeInfo.updatedAt': new Date(),
      })

      toast({
        title: 'Cohort updated successfully!',
        description: `${student.fullName} moved from ${oldCohort} : ${oldClassPlan} to ${newCohort} : ${newClassPlan}`,
        status: 'success',
        duration: 5000,
        isClosable: true,
      })

      return true
    } catch (error) {
      console.error('Error updating cohort:', error)
      toast({
        title: 'Failed to update cohort',
        description: 'Please try again or contact support',
        status: 'error',
        duration: 3000,
      })
      return false
    } finally {
      setIsChangingCohort(false)
      onCohortChanged()
      onClose()
      onCohortDialogClose()
    }
  }

  // Handle cohort change confirmation
  const handleCohortChange = async () => {
    if (
      (!selectedCohort && !selectedClassPlan) ||
      (selectedCohort === student.schoolFeeInfo?.cohort &&
        selectedClassPlan === student.schoolFeeInfo?.classPlan)
    ) {
      toast({
        title: 'Invalid cohort',
        description: 'Please select a different cohort or class plan',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    const success = await updateStudentCohort(selectedCohort, selectedClassPlan)
    if (success) {
      setSelectedCohort('')
      setSelectedClassPlan('')
      // Refresh parent component if needed
      if ((window as any).refreshStudentList) {
        ;(window as any).refreshStudentList()
      }
    }
  }

  // Load data when modal opens
  useEffect(() => {
    if (isOpen) {
      fetchPayments()
      fetchAttendance()
      fetchAvailableCohorts()
      setSelectedCohort(student.schoolFeeInfo?.cohort || '')
      setSelectedClassPlan(student.schoolFeeInfo?.classPlan || '')
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

  // Function to send admin notification for a payment
  const handleSendPaymentNotification = async (payment: PaymentRecord) => {
    try {
      const notificationData = {
        studentId: student.uid,
        studentName: student.fullName || 'Unknown Student',
        studentEmail: student.email || '',
        amount: payment.amount,
        installmentNumber: payment.installmentNumber || 1,
        paymentReceiptUrl: payment.receiptUrl || '',
        cohort: student.schoolFeeInfo?.cohort || '',
        classPlan: student.schoolFeeInfo?.classPlan || '',
      }

      const result = await sendPaymentNotification(notificationData)

      if (result.success) {
        toast({
          title: 'Notification Sent!',
          description: `Admin notification sent for payment #${payment.installmentNumber}`,
          status: 'success',
          duration: 3000,
          isClosable: true,
        })
      } else {
        throw new Error(result.error || 'Failed to send notification')
      }
    } catch (error) {
      toast({
        title: 'Notification Failed',
        description: 'Failed to send admin notification',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
    }
  }

  // Add a new tab for Cohort Management
  const CohortManagementTab = () => (
    <VStack spacing={6} align="stretch">
      {/* Current Cohort Info */}
      <Box bg="blue.50" p={4} borderRadius="lg">
        <Text fontSize="lg" fontWeight="bold" mb={3} color="blue.800">
          Current Cohort Information
        </Text>
        <Flex gap={6} wrap="wrap">
          <Box>
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Current Cohort
            </Text>
            <Text fontSize="xl" fontWeight="bold" color="blue.900">
              {student.schoolFeeInfo?.cohort || 'Not assigned'}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Class Plan
            </Text>
            <Text fontSize="lg" color="blue.900">
              {student.schoolFeeInfo?.classPlan || 'Not specified'}
            </Text>
          </Box>
          <Box>
            <Text fontSize="sm" color="blue.600" fontWeight="medium">
              Assignment Date
            </Text>
            <Text fontSize="lg" color="blue.900">
              {student.schoolFeeInfo?.createdAt
                ? new Date(
                    student.schoolFeeInfo.createdAt.seconds * 1000,
                  ).toLocaleDateString()
                : 'Unknown'}
            </Text>
          </Box>
        </Flex>
      </Box>

      {/* Cohort Change Form */}
      <Box
        bg="white"
        p={6}
        borderRadius="lg"
        border="1px"
        borderColor="gray.200"
      >
        <Text fontSize="lg" fontWeight="bold" mb={4}>
          Change Student Cohort & Class Plan
        </Text>

        <Box display={'flex'} gap={4}>
          <FormControl>
            <FormLabel>Select New Cohort</FormLabel>
            <Select
              value={selectedCohort}
              onChange={(e) => setSelectedCohort(e.target.value)}
              placeholder="Choose a cohort..."
              bg="white"
            >
              {availableCohorts.map((cohort) => (
                <option key={cohort} value={cohort}>
                  {cohort}
                </option>
              ))}
            </Select>
          </FormControl>
          <FormControl>
            <FormLabel>Select New Class Plan</FormLabel>
            <Select
              value={selectedClassPlan}
              onChange={(e) => setSelectedClassPlan(e.target.value)}
              placeholder="Choose a class plan..."
              bg="white"
            >
              {classPlans.map((plan) => (
                <option key={plan} value={plan}>
                  {plan}
                </option>
              ))}
            </Select>
          </FormControl>
        </Box>

        <Alert status="info" mt={4} borderRadius="md">
          <AlertIcon />
          <Box>
            <Text fontWeight="medium">Important Notes:</Text>
            <Text fontSize="sm">
              • Changing cohort will affect attendance tracking and class
              assignments
              <br />
              • This action will be recorded in the change history
              <br />• Notify the student about this change if necessary
            </Text>
          </Box>
        </Alert>

        <HStack spacing={3} mt={6}>
          {/* //  */}
          <Button
            colorScheme="blue"
            onClick={onCohortDialogOpen}
            isDisabled={
              (!selectedCohort && !selectedClassPlan) ||
              (selectedCohort === student.schoolFeeInfo?.cohort &&
                selectedClassPlan === student.schoolFeeInfo?.classPlan)
            }
            isLoading={isChangingCohort}
          >
            Change
          </Button>
          <Button
            variant="outline"
            onClick={() => {
              setSelectedCohort(student.schoolFeeInfo?.cohort || '')
              setSelectedClassPlan(student.schoolFeeInfo?.classPlan || '')
            }}
          >
            Reset
          </Button>
        </HStack>
      </Box>
    </VStack>
  )

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
              Student Email: {student.email}
            </Text>
            <Text fontSize="sm" color="gray.600">
              Cohort: {student.schoolFeeInfo?.cohort || 'Not assigned'} ||
              Student ID: {student.uid}
            </Text>
          </VStack>
        </ModalHeader>
        <ModalCloseButton />

        <ModalBody>
          <Tabs index={activeTab} onChange={setActiveTab} variant="enclosed">
            <TabList>
              <Tab>Overview</Tab>
              {!isFacilitator && <Tab>Payment History</Tab>}
              {!isFacilitator && <Tab>Attendance</Tab>}
              {!isFacilitator && <Tab>Cohort Management</Tab>}
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
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Address
                            </Text>
                            <Text fontWeight="medium">
                              {student.address || 'Not specified'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Guardian Name
                            </Text>
                            <Text fontWeight="medium">
                              {student.guardianName || 'Not available'}
                            </Text>
                          </Box>
                          <Box>
                            <Text fontSize="sm" color="gray.600">
                              Guardian Phone
                            </Text>
                            <Text fontWeight="medium">
                              {student.guardianPhone || 'Not available'}
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
                  {!isFacilitator && (
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
                                student.registrationComplete
                                  ? 'green'
                                  : 'orange'
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
                  )}

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

              {!isFacilitator && (
                // {/* Payment History Tab */ }
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
                                <Th>Actions</Th>
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
                                  <Td>
                                    <Button
                                      // isDisabled={paymentStats.balance === 0}
                                      size="sm"
                                      colorScheme="purple"
                                      variant="outline"
                                      isLoading={isNotificationLoading}
                                      onClick={() =>
                                        handleSendPaymentNotification(payment)
                                      }
                                    >
                                      Resend notification
                                    </Button>
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
              )}
              {!isFacilitator && (
                //  {/* Attendance Tab */}
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
                                      colorScheme={getStatusColor(
                                        record.status,
                                      )}
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
              )}
              {!isFacilitator && (
                //  {/* Cohort Management Tab */}
                <TabPanel>
                  <CohortManagementTab />
                </TabPanel>
              )}
            </TabPanels>
          </Tabs>
        </ModalBody>

        <ModalFooter>
          <Button variant="outline" mr={3} onClick={onClose}>
            Close
          </Button>
        </ModalFooter>
      </ModalContent>

      {/* Cohort Change Confirmation Dialog */}
      <AlertDialog
        isOpen={isCohortDialogOpen}
        leastDestructiveRef={cancelRef}
        onClose={onCohortDialogClose}
      >
        <AlertDialogOverlay>
          <AlertDialogContent>
            <AlertDialogHeader fontSize="lg" fontWeight="bold">
              Confirm Cohort/Class Plan Change
            </AlertDialogHeader>

            <AlertDialogBody>
              <Text mb={4}>
                Are you sure you want to move{' '}
                <strong>{student.fullName}</strong> from{' '}
                <Badge colorScheme="orange">
                  {student.schoolFeeInfo?.cohort || 'Not assigned'} {':'}{' '}
                  {student.schoolFeeInfo?.classPlan || 'Not assigned'}
                </Badge>{' '}
                to{' '}
                <Badge colorScheme="green">
                  {selectedCohort} : {selectedClassPlan}
                </Badge>
                ?
              </Text>

              <Alert status="warning" borderRadius="md">
                <AlertIcon />
                <Text fontSize="sm">
                  This action will affect the student&apos;s class assignments
                  and attendance tracking. Please ensure this change is
                  necessary.
                </Text>
              </Alert>
            </AlertDialogBody>

            <AlertDialogFooter>
              <Button ref={cancelRef} onClick={onCohortDialogClose}>
                Cancel
              </Button>
              <Button
                colorScheme="blue"
                onClick={handleCohortChange}
                ml={3}
                isLoading={isChangingCohort}
              >
                Confirm Change
              </Button>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialogOverlay>
      </AlertDialog>

      <ImagePreviewModal
        isOpen={isImageOpen}
        onClose={onImageClose}
        imageUrl={imageUrl}
        title={title}
      />
    </Modal>
  )
}
