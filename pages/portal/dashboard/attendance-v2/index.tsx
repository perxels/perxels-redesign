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
  Alert,
  AlertIcon,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import {
  getDailyCode,
  getSessionsByDate,
  validateStudentCheckIn,
  checkInToSession,
  getAttendanceSummary,
  didStudentCheckInToSession,
} from '../../../../lib/utils/attendance-v2.utils'
import { HeaderInfo } from '../../../../features/portal/dashboard/messages/header-info'
import { formatTime } from '../../../../lib/utils/attendance-formatters'

// Memoize today's date to prevent unnecessary recalculations
const getToday = () => {
  const now = new Date()
  const year = now.getFullYear()
  const month = String(now.getMonth() + 1).padStart(2, '0')
  const day = String(now.getDate()).padStart(2, '0')
  return `${year}-${month}-${day}`
}

interface SessionData {
  sessionId: string
  cohortId: string
  planId: string
  date: string
  startsAt: Date
  endsAt: Date
  status: string
  location?: string
}

interface AttendanceStats {
  present: number
  absent: number
  totalSessions: number
}

const AttendancePageV2 = () => {
  const { user, portalUser } = usePortalAuth()
  const [time, setTime] = useState(new Date())
  const [session, setSession] = useState<SessionData | null>(null)
  const [checkedIn, setCheckedIn] = useState(false)
  const [loading, setLoading] = useState(false)
  const [sessionLoading, setSessionLoading] = useState(true)
  const [summaryLoading, setSummaryLoading] = useState(true)
  const [stats, setStats] = useState<AttendanceStats>({
    present: 0,
    absent: 0,
    totalSessions: 0,
  })
  const [attendanceCode, setAttendanceCode] = useState('')
  const [codeError, setCodeError] = useState('')
  const { isOpen, onOpen, onClose } = useDisclosure()
  const toast = useToast()

  // Memoize today's date
  const today = useMemo(() => getToday(), [])

  // Memoize class info to prevent unnecessary re-renders
  const classInfo = useMemo(
    () => ({
      cohortId: portalUser?.schoolFeeInfo?.cohort,
      planId: portalUser?.schoolFeeInfo?.classPlan,
    }),
    [portalUser?.schoolFeeInfo?.cohort, portalUser?.schoolFeeInfo?.classPlan],
  )

  // Optimized time updater - only update every second
  useEffect(() => {
    const interval = setInterval(() => {
      setTime(new Date())
    }, 1000)
    return () => clearInterval(interval)
  }, [])

  // Memoized session fetching function
  const fetchSession = useCallback(async () => {
    if (!classInfo.cohortId || !classInfo.planId) {
      setSession(null)
      setSessionLoading(false)
      return
    }

    try {
      setSessionLoading(true)

      // Get today's sessions
      const sessions = await getSessionsByDate(today)

      // Find session for this student's cohort and plan
      const matchingSession = sessions.find(
        (s) =>
          s.cohortId === classInfo.cohortId &&
          s.planId === classInfo.planId &&
          s.status === 'open',
      )

      if (matchingSession) {
        setSession(matchingSession)

        // Check if student has already checked in for this session
        if (user?.uid) {
          const checkinData = await didStudentCheckInToSession(
            matchingSession.sessionId,
            user.uid,
          )
          setCheckedIn(checkinData !== null && checkinData.checkedIn === true)
        }
      } else {
        setSession(null)
        setCheckedIn(false)
      }
    } catch (error) {
      setSession(null)
      setCheckedIn(false)
    } finally {
      setSessionLoading(false)
    }
  }, [classInfo.cohortId, classInfo.planId, today, user?.uid, portalUser])

  // Memoized summary fetching function
  const fetchSummary = useCallback(async () => {
    if (!classInfo.cohortId || !classInfo.planId || !user?.uid) {
      setStats({ present: 0, absent: 0, totalSessions: 0 })
      setSummaryLoading(false)
      return
    }

    try {
      setSummaryLoading(true)

      // Get all sessions for this student's cohort and plan
      const sessions = await getSessionsByDate(today)
      const studentSessions = sessions.filter(
        (s) =>
          s.cohortId === classInfo.cohortId && s.planId === classInfo.planId,
      )

      let present = 0
      let absent = 0

      // For each session, check if student checked in
      for (const sessionData of studentSessions) {
        const checkinData = await didStudentCheckInToSession(
          sessionData.sessionId,
          user.uid,
        )
        if (checkinData && checkinData.checkedIn) {
          present++
        } else {
          absent++
        }
      }

      setStats({
        present,
        absent,
        totalSessions: studentSessions.length,
      })
    } catch (error) {
      setStats({ present: 0, absent: 0, totalSessions: 0 })
    } finally {
      setSummaryLoading(false)
    }
  }, [classInfo.cohortId, classInfo.planId, user?.uid, today])

  // Fetch session when class info changes
  useEffect(() => {
    fetchSession()
  }, [fetchSession])

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
    if (!session || !user?.uid) return

    setCodeError('')
    if (!attendanceCode.trim()) {
      setCodeError('Please enter the attendance code')
      return
    }

    setLoading(true)
    try {
      // Validate the attendance code and get matching session
      const matchingSession = await validateStudentCheckIn(
        user.uid,
        attendanceCode.trim(),
        today,
      )

      await checkInToSession(matchingSession.sessionId, user.uid)
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
  }, [session, user?.uid, attendanceCode, onClose, toast, fetchSummary, today])

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
  const dateDisplay = useMemo(() => {
    try {
      const [year, month, day] = today.split('-')
      return `${day}:${month}:${year}`
    } catch (error) {
      return 'Invalid Date'
    }
  }, [today])

  // Check if current time is within session window
  const isWithinSessionTime = useMemo(() => {
    if (!session) return false

    try {
      const now = new Date()

      // Convert Firestore Timestamps to Date objects
      let sessionStart: Date
      let sessionEnd: Date

      if (
        session.startsAt &&
        typeof session.startsAt === 'object' &&
        'toDate' in session.startsAt
      ) {
        // Firestore Timestamp
        sessionStart = (session.startsAt as any).toDate()
      } else {
        // Regular Date object or string
        sessionStart = new Date(session.startsAt)
      }

      if (
        session.endsAt &&
        typeof session.endsAt === 'object' &&
        'toDate' in session.endsAt
      ) {
        // Firestore Timestamp
        sessionEnd = (session.endsAt as any).toDate()
      } else {
        // Regular Date object or string
        sessionEnd = new Date(session.endsAt)
      }

      // Check if dates are valid
      if (isNaN(sessionStart.getTime()) || isNaN(sessionEnd.getTime())) {
        return false
      }

      return now >= sessionStart && now <= sessionEnd
    } catch (error) {
      return false
    }
  }, [session])

  // Loading state
  if (sessionLoading) {
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

            {session && checkedIn ? (
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
            ) : session ? (
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
                    isDisabled={checkedIn || !isWithinSessionTime}
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
                {classInfo.cohortId && classInfo.planId && (
                  <Text color="gray.400" fontSize="sm" mt={2}>
                    Cohort: {classInfo.cohortId} | Plan: {classInfo.planId}
                  </Text>
                )}
              </Box>
            )}

            {/* Session Info Alert */}
            {session && !isWithinSessionTime && (
              <Alert status="warning" borderRadius="lg" mb={4}>
                <AlertIcon />
                <Text fontSize="sm">
                  Check-in is only allowed during class time:{' '}
                  {(() => {
                    try {
                      const startTime =
                        session.startsAt &&
                        typeof session.startsAt === 'object' &&
                        'toDate' in session.startsAt
                          ? (session.startsAt as any).toDate()
                          : new Date(session.startsAt)
                      const endTime =
                        session.endsAt &&
                        typeof session.endsAt === 'object' &&
                        'toDate' in session.endsAt
                          ? (session.endsAt as any).toDate()
                          : new Date(session.endsAt)
                      return `${formatTime(startTime)} - ${formatTime(endTime)}`
                    } catch (error) {
                      return 'Invalid Time Range'
                    }
                  })()}
                </Text>
              </Alert>
            )}

            <HStack
              spacing={8}
              mt={session ? 0 : 16}
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
                  {session ? 'Absent (Past Days)' : 'Absent'}
                </Text>
                <Text
                  fontSize="3xl"
                  fontWeight="bold"
                  opacity={summaryLoading ? 0.5 : 1}
                >
                  {stats.absent}
                </Text>
                {session && !checkedIn && (
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
                  Please enter the daily attendance code provided by your
                  instructor to check in for today&apos;s class.
                </Text>

                <FormControl isInvalid={!!codeError}>
                  <FormLabel fontSize="sm" fontWeight="medium" color="gray.700">
                    Daily Attendance Code
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
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default AttendancePageV2
