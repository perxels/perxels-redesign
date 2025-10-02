import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import {
  VStack,
  Box,
  Button,
  Text,
  HStack,
  useToast,
  Spinner,
  Input,
  FormControl,
  FormLabel,
  FormErrorMessage,
  useDisclosure,
  Modal,
  ModalOverlay,
  ModalContent,
  ModalHeader,
  ModalBody,
  ModalCloseButton,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { collection, getDocs, query, where } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import {
  findAttendanceByClassId,
  didStudentCheckIn,
  checkInStudent,
} from '../../../../lib/utils/attendance.utils'
import { HeaderInfo } from '../../../../features/portal/dashboard/messages/header-info'
import StudentStatusGuard from '../../../../components/StudentStatusGuard'

// Memoize today's date to prevent unnecessary recalculations
const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface AttendanceData {
  id: string
  date: string
  code: string
  classId: string
  createdAt: Date
}

interface AttendanceStats {
  present: number
  absent: number
}

// Helper to normalize date values to YYYY-MM-DD
const normalizeDate = (dateValue: any) => {
  if (!dateValue) return ''
  let date: Date
  if (typeof dateValue === 'string') date = new Date(dateValue)
  else if (dateValue.seconds) date = new Date(dateValue.seconds * 1000)
  else if (dateValue.toDate) date = dateValue.toDate()
  else if (dateValue instanceof Date) date = dateValue
  else return ''
  const year = date.getFullYear()
  const month = String(date.getMonth() + 1).padStart(2, '0')
  const day = String(date.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

const AttendancePage = () => {
  const { user, portalUser } = usePortalAuth()
  const [time, setTime] = useState(new Date())
  const [attendance, setAttendance] = useState<AttendanceData | null>(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [attendanceLoading, setAttendanceLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [stats, setStats] = useState<AttendanceStats>({ present: 0, absent: 0 })
  const [attendanceCode, setAttendanceCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Memoize today's date
  const today = useMemo(() => getToday(), [])

  // Memoize class ID to prevent unnecessary re-renders
  const classId = useMemo(
    () => portalUser?.schoolFeeInfo?.cohort,
    [portalUser?.schoolFeeInfo?.cohort],
  )

  // Optimized time updater - only update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Memoized attendance fetching function
  const fetchAttendance = useCallback(async () => {
    if (!classId) {
      setAttendance(null)
      setAttendanceLoading(false)
      return
    }

    try {
      setAttendanceLoading(true)
      const snapshot = await findAttendanceByClassId(classId, today)

      if (!snapshot.empty) {
        const attendanceData = {
          id: snapshot.docs[0].id,
          ...snapshot.docs[0].data(),
        } as AttendanceData
        setAttendance(attendanceData)

        // Check if student has already checked in for this attendance
        if (user?.uid) {
          const hasCheckedIn = await didStudentCheckIn(
            attendanceData.id,
            user.uid,
          )
          setCheckedIn(hasCheckedIn?.checkedIn || false)
        }
      } else {
        setAttendance(null)
        setCheckedIn(false)
      }
    } catch (error) {
      console.error('Error fetching attendance:', error)
      setAttendance(null)
      setCheckedIn(false)
    } finally {
      setAttendanceLoading(false)
    }
  }, [classId, today, user?.uid])

  // Memoized summary fetching function
  const fetchSummary = useCallback(async () => {
    if (!classId || !user?.uid) {
      setStats({ present: 0, absent: 0 })
      setSummaryLoading(false)
      return
    }

    try {
      setSummaryLoading(true)
      const snapshot = await findAttendanceByClassId(classId)

      let present = 0
      let absent = 0

      // Process all attendance records in parallel for better performance
      const checkinPromises = snapshot.docs.map(async (docSnap) => {
        const attendanceData = docSnap.data()
        const attendanceDate = attendanceData.date

        // Check if this attendance session is for today
        const isToday = attendanceDate === today

        const checkinRef = collection(
          portalDb,
          'attendance',
          docSnap.id,
          'checkins',
        )
        const checkins = await getDocs(checkinRef)
        const studentCheckin = checkins.docs.find((d) => d.id === user.uid)
        const hasCheckedIn = studentCheckin?.data()?.checkedIn || false

        return {
          hasCheckedIn,
          isToday,
          attendanceDate,
        }
      })

      const checkinResults = await Promise.all(checkinPromises)

      checkinResults.forEach(({ hasCheckedIn, isToday }) => {
        if (hasCheckedIn) {
          present++
        } else if (!isToday) {
          // Only count as absent if it's not today's attendance
          // Students can still check in for today's attendance
          absent++
        }
        // If it's today and they haven't checked in, don't count as absent yet
      })

      setStats({ present, absent })
    } catch (error) {
      console.error('Error fetching summary:', error)
      setStats({ present: 0, absent: 0 })
    } finally {
      setSummaryLoading(false)
    }
  }, [classId, user?.uid, today])

  // Fetch attendance when class ID changes
  useEffect(() => {
    fetchAttendance()
  }, [fetchAttendance])

  // Fetch summary when dependencies change
  useEffect(() => {
    fetchSummary()
  }, [fetchSummary])

  // Open check-in modal
  const handleCheckinClick = useCallback(() => {
    setAttendanceCode('')
    setCodeError('')
    onOpen()
  }, [onOpen])

  // Memoized check-in handler with code validation
  const handleCheckin = useCallback(async () => {
    if (!attendance || !user?.uid) return

    setCodeError('')
    if (!attendanceCode.trim()) {
      setCodeError('Please enter the attendance code')
      return
    }

    setLoading(true)
    try {
      // Validate the attendance code
      if (attendanceCode.trim().toUpperCase() !== attendance.code) {
        setCodeError('Invalid attendance code. Please check and try again.')
        return
      }

      await checkInStudent(attendance.id, user.uid)
      setCheckedIn(true)
      setAttendanceCode('')
      onClose()

      toast({
        title: 'Check-in successful! ✅',
        description: 'You have been marked present for today',
        status: 'success',
        duration: 3000,
      })

      // Refresh summary after successful check-in
      fetchSummary()
    } catch (err: any) {
      setCodeError(err.message || 'Check-in failed. Please try again.')
    } finally {
      setLoading(false)
    }
  }, [attendance, user?.uid, attendanceCode, onClose, toast, fetchSummary])

  // Memoized time display
  const timeDisplay = useMemo(
    () =>
      time.toLocaleTimeString([], {
        hour: '2-digit',
        minute: '2-digit',
        second: '2-digit',
        hour12: true,
      }),
    [time],
  )

  // Memoized date display
  const dateDisplay = useMemo(
    () => today.split('-').reverse().join(':'),
    [today],
  )

  // Loading state
  if (attendanceLoading) {
    return (
      <StudentAuthGuard>
        <DashboardLayout>
          <HeaderInfo title="Attendance" />
          <VStack
            w="full"
            gap={8}
            alignItems="center"
            justifyContent="center"
            minH="400px"
          >
            <Spinner size="xl" color="#363576" />
            <Text color="gray.500">Loading attendance...</Text>
          </VStack>
        </DashboardLayout>
      </StudentAuthGuard>
    )
  }

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <StudentStatusGuard>
          <HeaderInfo title="Attendance" />
          <VStack
            w="full"
            gap={8}
            alignItems="flex-start"
            justifyContent="flex-start"
          >
            <Box w="full" textAlign="center" mt={8}>
              <Text color="gray.500" textAlign="left" mb={8}>
                You&apos;re welcome to class today, please click in
              </Text>

              {attendance && checkedIn ? (
                <Box
                  as="section"
                  display="flex"
                  alignItems="center"
                  justifyContent="center"
                  w="full"
                  px={{ base: 4, md: 12 }}
                  py={{ base: 4, md: 8 }}
                  bg="#F7F7FF"
                  borderRadius="3xl"
                  boxShadow="none"
                  mb={8}
                  style={{ minHeight: 120, borderRadius: 40 }}
                >
                  <HStack
                    w="full"
                    spacing={0}
                    alignItems="center"
                    justifyContent="center"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      w="full"
                      justifyContent="center"
                      gap={4}
                    >
                      <Box as="span" color="#363576" fontSize="3xl">
                        {/* Checkmark icon (can use emoji or Chakra Icon) */}
                        <span role="img" aria-label="checked in">
                          ✅
                        </span>
                      </Box>
                      <Text
                        fontSize={{ base: 'xl', md: '2xl' }}
                        fontWeight="bold"
                        color="#363576"
                      >
                        You have checked in for today!
                      </Text>
                    </Box>
                  </HStack>
                </Box>
              ) : attendance ? (
                <Box
                  as="section"
                  display="flex"
                  alignItems="center"
                  justifyContent="between"
                  w="full"
                  px={{ base: 4, md: 12 }}
                  py={{ base: 4, md: 8 }}
                  bg="#F7F7FF"
                  borderRadius="3xl"
                  boxShadow="none"
                  mb={8}
                  style={{ minHeight: 120, borderRadius: 40 }}
                >
                  <HStack
                    w="full"
                    spacing={0}
                    alignItems="center"
                    justifyContent="flex-start"
                  >
                    <Box
                      display="flex"
                      alignItems="center"
                      w="full"
                      gap={{ base: 4, md: 12 }}
                    >
                      <VStack>
                        <label style={{ fontSize: '16px' }}>Time</label>
                        <Text
                          fontSize={{ base: '2xl', md: '3xl', lg: '48px' }}
                          fontWeight="bold"
                          color="#333"
                          letterSpacing="0.02em"
                          minW="180px"
                          textAlign="center"
                          textTransform="uppercase"
                        >
                          {timeDisplay}
                        </Text>
                      </VStack>
                      <Box
                        h={{ base: '40px', md: '60px' }}
                        borderLeft="2px solid #222"
                        mx={{ base: 2, md: 6 }}
                      />
                      <VStack>
                        <label style={{ fontSize: '16px' }}>Date</label>
                        <Text
                          fontSize={{ base: '2xl', md: '3xl', lg: '48px' }}
                          fontWeight="bold"
                          color="#333"
                          letterSpacing="0.02em"
                          minW="260px"
                          textAlign="center"
                        >
                          {dateDisplay}
                        </Text>
                      </VStack>
                    </Box>
                    <Button
                      bg="#363576"
                      color="white"
                      _hover={{ bg: '#28235c' }}
                      px={{ base: 8, md: 16 }}
                      py={{ base: 4, md: 8 }}
                      fontSize={{ base: 'md', md: 'xl' }}
                      borderRadius="lg"
                      minW="160px"
                      minH="56px"
                      ml={{ base: 4, md: 12 }}
                      onClick={handleCheckinClick}
                      isDisabled={checkedIn}
                      fontWeight="medium"
                      style={{ borderRadius: 16 }}
                    >
                      {checkedIn ? 'Checked In' : 'Check In'}
                    </Button>
                  </HStack>
                </Box>
              ) : (
                <Box
                  bg="gray.50"
                  borderRadius="2xl"
                  px={12}
                  py={8}
                  mb={8}
                  textAlign="center"
                >
                  <Text color="gray.500" fontSize="lg">
                    No attendance session available for today
                  </Text>
                </Box>
              )}

              <HStack
                spacing={8}
                mt={attendance ? 0 : 16}
                justifyContent="flex-start"
              >
                <Box
                  bg="#E9E8F9"
                  borderRadius="2xl"
                  px={12}
                  py={8}
                  minW="180px"
                  textAlign="center"
                  position="relative"
                >
                  {summaryLoading && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    >
                      <Spinner size="sm" color="#363576" />
                    </Box>
                  )}
                  <Text color="#363576" fontWeight="medium" mb={2}>
                    Present
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    opacity={summaryLoading ? 0.5 : 1}
                  >
                    {stats.present}
                  </Text>
                </Box>
                <Box
                  bg="#FFE6EA"
                  borderRadius="2xl"
                  px={12}
                  py={8}
                  minW="180px"
                  textAlign="center"
                  position="relative"
                >
                  {summaryLoading && (
                    <Box
                      position="absolute"
                      top="50%"
                      left="50%"
                      transform="translate(-50%, -50%)"
                    >
                      <Spinner size="sm" color="#D32F2F" />
                    </Box>
                  )}
                  <Text color="#D32F2F" fontWeight="medium" mb={2}>
                    {attendance ? 'Absent (Past Days)' : 'Absent'}
                  </Text>
                  <Text
                    fontSize="3xl"
                    fontWeight="bold"
                    opacity={summaryLoading ? 0.5 : 1}
                  >
                    {stats.absent}
                  </Text>
                  {attendance &&
                    normalizeDate(attendance.date) === today &&
                    !checkedIn && (
                      <Text fontSize="xs" color="#D32F2F" mt={1}>
                        Today&apos;s attendance still open
                      </Text>
                    )}
                </Box>
              </HStack>
            </Box>
          </VStack>

          {/* Attendance Code Modal */}
          <Modal isOpen={isOpen} onClose={onClose} isCentered>
            <ModalOverlay />
            <ModalContent mx={4} borderRadius="xl">
              <ModalHeader textAlign="center" color="#363576">
                Enter Attendance Code
              </ModalHeader>
              <ModalCloseButton />
              <ModalBody pb={6}>
                <VStack spacing={6}>
                  <Text color="gray.600" textAlign="center" fontSize="sm">
                    Please enter the attendance code provided by your instructor
                    to check in for today&apos;s class.
                  </Text>

                  <FormControl isInvalid={!!codeError}>
                    <FormLabel
                      fontSize="sm"
                      fontWeight="medium"
                      color="gray.700"
                    >
                      Attendance Code
                    </FormLabel>
                    <Input
                      value={attendanceCode}
                      onChange={(e) =>
                        setAttendanceCode(e.target.value.toUpperCase())
                      }
                      placeholder="e.g., COP1234"
                      textTransform="uppercase"
                      fontSize="lg"
                      fontWeight="bold"
                      textAlign="center"
                      letterSpacing="0.1em"
                      bg="gray.50"
                      border="2px solid"
                      borderColor={codeError ? 'red.300' : 'yellow.300'}
                      borderRadius="lg"
                      h="3.5rem"
                      _focus={{
                        borderColor: codeError ? 'red.500' : 'yellow.400',
                        bg: 'white',
                        boxShadow: '0 0 0 1px rgba(245, 158, 11, 0.2)',
                      }}
                      _hover={{
                        borderColor: codeError ? 'red.500' : 'yellow.400',
                      }}
                    />
                    <FormErrorMessage>{codeError}</FormErrorMessage>
                  </FormControl>

                  <Button
                    bg="#363576"
                    color="white"
                    _hover={{ bg: '#28235c' }}
                    px={8}
                    py={4}
                    fontSize="lg"
                    borderRadius="lg"
                    w="full"
                    onClick={handleCheckin}
                    isLoading={loading}
                    isDisabled={!attendanceCode.trim()}
                    fontWeight="medium"
                  >
                    Confirm Check-in
                  </Button>

                  <Text fontSize="xs" color="gray.500" textAlign="center">
                    Make sure you have the correct code from your instructor
                    before proceeding.
                  </Text>
                </VStack>
              </ModalBody>
            </ModalContent>
          </Modal>
        </StudentStatusGuard>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default AttendancePage
