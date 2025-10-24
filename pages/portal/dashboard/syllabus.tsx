// pages/portal/dashboard/syllabus.tsx
import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { StudentAuthGuard } from '../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../features/portal/dashboard/dashboard-layout'
import {
  Box,
  VStack,
  Text,
  Spinner,
  Alert,
  AlertIcon,
  AlertDescription,
  Card,
  CardHeader,
  CardBody,
  Heading,
  Badge,
  HStack,
  List,
  ListItem,
  ListIcon,
  useToast,
  Tabs,
  TabList,
  Tab,
  TabPanels,
  TabPanel,
} from '@chakra-ui/react'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { ClassPlanSyllabus, Syllabus } from '../../../types/syllabus.types'
import {
  MdCheckCircle,
  MdAccessTime,
  MdComputer,
  MdSchool,
  MdAssignment,
  MdLink,
  MdCalendarToday,
} from 'react-icons/md'
import StudentStatusGuard from '../../../components/StudentStatusGuard'
import { StudentSyllabusView } from '../../../features/portal/dashboard/syllabus/student-syllabus-view'

interface ClassData {
  id: string
  cohortName: string
  startDate?: any
  endDate?: any
  syllabusId?: string
}

interface ScheduledDay {
  scheduledDate: Date
  isCompleted: boolean
  notes?: string
}

// Add this utility function at the top
const convertToDate = (date: any): Date => {
  if (!date) return new Date()

  // If it's a Firestore timestamp
  if (date.toDate && typeof date.toDate === 'function') {
    return date.toDate()
  }

  // If it's already a Date object
  if (date instanceof Date) {
    return date
  }

  // If it's a string or number
  try {
    return new Date(date)
  } catch {
    return new Date()
  }
}

// Date formatting function
const formatDateSafely = (date: any): string => {
  try {
    const dateObj = convertToDate(date)
    return dateObj.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
  } catch (error) {
    console.error('Error formatting date:', error)
    return 'Invalid Date'
  }
}

const StudentSyllabusPage = () => {
  const router = useRouter()
  const { user, portalUser } = usePortalAuth()
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [classPlanSyllabus, setClassPlanSyllabus] =
    useState<ClassPlanSyllabus | null>(null)
  const [scheduledDays, setScheduledDays] = useState<
    Record<string, ScheduledDay>
  >({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Fetch student's class plan syllabus
  const fetchStudentSyllabus = async () => {
    if (!user?.uid || !portalUser) return

    try {
      setLoading(true)
      setError(null)

      // Get student's cohort and class plan from their profile
      const studentCohort = portalUser.schoolFeeInfo?.cohort
      const studentClassPlan = portalUser.schoolFeeInfo?.classPlan

      if (!studentCohort || !studentClassPlan) {
        setError(
          'You are not assigned to any class plan yet. Please contact your administrator.',
        )
        return
      }

      // Find the class for this cohort
      const classesQuery = query(
        collection(portalDb, 'classes'),
        where('cohortName', '==', studentCohort.toUpperCase()),
      )
      const classesSnapshot = await getDocs(classesQuery)

      if (classesSnapshot.empty) {
        setError(`No class found for cohort: ${studentCohort}`)
        return
      }

      const classDoc = classesSnapshot.docs[0]
      const classData: ClassData = {
        id: classDoc.id,
        cohortName: classDoc.data().cohortName,
        startDate: classDoc.data().startDate,
        endDate: classDoc.data().endDate,
        syllabusId: classDoc.data().syllabusId,
      }

      setClassData(classData)

      // Find the class plan syllabus for this student's class plan
      const classPlanSyllabiQuery = query(
        collection(portalDb, 'classPlanSyllabi'),
        where('classId', '==', classDoc.id),
        where('classPlan', '==', studentClassPlan),
      )

      const classPlanSyllabiSnapshot = await getDocs(classPlanSyllabiQuery)

      if (classPlanSyllabiSnapshot.empty) {
        setError(`No syllabus found for your class plan: ${studentClassPlan}`)
        return
      }

      const classPlanSyllabusDoc = classPlanSyllabiSnapshot.docs[0]
      const classPlanSyllabusData = classPlanSyllabusDoc.data()

      // Convert scheduled days dates
      const convertedScheduledDays: Record<string, any> = {}
      Object.keys(classPlanSyllabusData.scheduledDays || {}).forEach((key) => {
        const dayData = classPlanSyllabusData.scheduledDays[key]
        convertedScheduledDays[key] = {
          ...dayData,
          scheduledDate: convertToDate(dayData.scheduledDate),
        }
      })

      const classPlanSyllabus: ClassPlanSyllabus = {
        id: classPlanSyllabusDoc.id,
        classId: classPlanSyllabusData.classId,
        cohortName: classPlanSyllabusData.cohortName,
        classPlan: classPlanSyllabusData.classPlan,
        baseSyllabusId: classPlanSyllabusData.baseSyllabusId,
        syllabus: classPlanSyllabusData.syllabus,
        startDate: convertToDate(classPlanSyllabusData.startDate),
        endDate: convertToDate(classPlanSyllabusData.endDate),
        scheduledDays: convertedScheduledDays,
        createdAt: convertToDate(classPlanSyllabusData.createdAt),
        updatedAt: convertToDate(classPlanSyllabusData.updatedAt),
        createdBy: classPlanSyllabusData.createdBy,
        isActive: classPlanSyllabusData.isActive,
      }

      setClassPlanSyllabus(classPlanSyllabus)
      setSyllabus(classPlanSyllabusData.syllabus)
    } catch (err) {
      console.error('Error fetching syllabus:', err)
      setError('Failed to load syllabus. Please try again.')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchStudentSyllabus()
  }, [user?.uid, portalUser])

  const formatDate = (date: any): string => {
    if (!date) return '—'
    try {
      const d = date?.toDate ? date.toDate() : new Date(date)
      return d.toLocaleDateString()
    } catch {
      return '—'
    }
  }

  const getScheduledDay = (dayId: string): ScheduledDay | null => {
    return scheduledDays[dayId] || null
  }

  const getDayStatus = (day: any) => {
    const scheduled = getScheduledDay(day.id)
    if (!scheduled) return 'unscheduled'
    if (scheduled.isCompleted) return 'completed'
    if (scheduled.scheduledDate < new Date()) return 'overdue'
    return 'scheduled'
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'completed':
        return 'green'
      case 'overdue':
        return 'red'
      case 'scheduled':
        return 'blue'
      default:
        return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed':
        return 'Completed'
      case 'overdue':
        return 'Overdue'
      case 'scheduled':
        return 'Scheduled'
      default:
        return 'Not Scheduled'
    }
  }

  if (loading) {
    return (
      <StudentAuthGuard>
        <DashboardLayout>
          <VStack spacing={4} py={8}>
            <Spinner size="xl" color="purple.500" />
            <Text color="gray.500">Loading your syllabus...</Text>
          </VStack>
        </DashboardLayout>
      </StudentAuthGuard>
    )
  }

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <StudentStatusGuard>
          <VStack w="full" align="stretch" spacing={6}>
            {error ? (
              <Alert status="error">
                <AlertIcon />
                <AlertDescription>{error}</AlertDescription>
              </Alert>
            ) : syllabus && classPlanSyllabus ? (
              <>
                {/* Syllabus Header */}

                <Card>
                  <CardHeader>
                    <VStack align="start" spacing={3}>
                      <HStack justify="space-between" w="full">
                        <Heading size="lg">{syllabus.name}</Heading>
                        <HStack spacing={2}>
                          <Badge colorScheme="purple" variant="subtle">
                            v{syllabus.version}
                          </Badge>
                          <Badge colorScheme="green" variant="subtle">
                            Active
                          </Badge>
                          <Badge colorScheme="blue" variant="subtle">
                            {classPlanSyllabus.classPlan}
                          </Badge>
                        </HStack>
                      </HStack>
                      <Text color="gray.600" fontSize="lg">
                        {syllabus.description}
                      </Text>
                      <HStack spacing={4}>
                        <Badge colorScheme="blue" variant="subtle">
                          <HStack spacing={1}>
                            <MdAccessTime />
                            <Text>{syllabus.totalWeeks} Weeks</Text>
                          </HStack>
                        </Badge>
                        <Badge colorScheme="green" variant="subtle">
                          <HStack spacing={1}>
                            <MdSchool />
                            <Text>{syllabus.totalDays} Days</Text>
                          </HStack>
                        </Badge>
                      </HStack>
                      {classData && (
                        <HStack spacing={4} fontSize="sm" color="gray.600">
                          <Text>
                            Cohort: <strong>{classData.cohortName}</strong>
                          </Text>
                          <Text>
                            Start Date:{' '}
                            <strong>{formatDate(classData.startDate)}</strong>
                          </Text>
                          <Text>
                            End Date:{' '}
                            <strong>{formatDate(classData.endDate)}</strong>
                          </Text>
                        </HStack>
                      )}
                    </VStack>
                  </CardHeader>
                </Card>
                {/* Progress and Content Tabs */}
                <Tabs variant="enclosed" colorScheme="purple">
                  <TabList>
                    <Tab>Progress Overview</Tab>
                    <Tab>Course Content</Tab>
                  </TabList>

                  <TabPanels>
                    {/* Progress Tab */}
                    <TabPanel px={0}>
                      <StudentSyllabusView
                        classPlanSyllabusId={classPlanSyllabus.id}
                        studentId={user?.uid || ''}
                      />
                    </TabPanel>

                    {/* Course Content Tab */}
                    <TabPanel px={0}>
                      <Card>
                        <CardHeader>
                          <Heading size="md">Course Content</Heading>
                        </CardHeader>
                        <CardBody>
                          <VStack spacing={4} align="stretch">
                            {/* Full Syllabus List */}
                            <VStack spacing={6} align="stretch">
                              {syllabus.weeks.map((week, weekIndex) => (
                                <Card
                                  key={week.id || weekIndex}
                                  variant="outline"
                                >
                                  <CardHeader>
                                    <HStack
                                      justify="space-between"
                                      align="center"
                                    >
                                      <VStack align="start" spacing={1}>
                                        <Heading size="md">
                                          {week.title}
                                        </Heading>
                                        <Text fontSize="sm" color="gray.600">
                                          {week.days.length} days • Week{' '}
                                          {week.weekNumber}
                                        </Text>
                                      </VStack>
                                      <Badge
                                        colorScheme="blue"
                                        variant="subtle"
                                      >
                                        {week.days.length} days
                                      </Badge>
                                    </HStack>
                                  </CardHeader>
                                  <CardBody>
                                    <VStack spacing={4} align="stretch">
                                      {week.days.map((day, dayIndex) => {
                                        const scheduled =
                                          classPlanSyllabus.scheduledDays[
                                            day.id
                                          ]
                                        const status = scheduled?.isCompleted
                                          ? 'completed'
                                          : scheduled?.scheduledDate <
                                            new Date()
                                          ? 'overdue'
                                          : scheduled
                                          ? 'scheduled'
                                          : 'unscheduled'

                                        return (
                                          <Box
                                            key={day.id || dayIndex}
                                            p={4}
                                            border="1px solid"
                                            borderColor="gray.200"
                                            borderRadius="lg"
                                            bg="white"
                                          >
                                            <VStack spacing={4} align="stretch">
                                              {/* Day Header */}
                                              <HStack
                                                justify="space-between"
                                                align="start"
                                              >
                                                <VStack
                                                  align="start"
                                                  spacing={1}
                                                  flex="1"
                                                >
                                                  <Text
                                                    fontWeight="bold"
                                                    fontSize="lg"
                                                    color="purple.600"
                                                  >
                                                    Day {day.dayNumber}:{' '}
                                                    {day.title}
                                                  </Text>
                                                  <Text
                                                    fontSize="sm"
                                                    color="gray.700"
                                                    whiteSpace="pre-line"
                                                    lineHeight="1.5"
                                                  >
                                                    {day.content}
                                                  </Text>
                                                  <HStack spacing={2} mt={2}>
                                                    {day.duration && (
                                                      <Badge
                                                        colorScheme="purple"
                                                        variant="subtle"
                                                        fontSize="xs"
                                                      >
                                                        <HStack spacing={1}>
                                                          <MdAccessTime />
                                                          <Text>
                                                            {day.duration}
                                                          </Text>
                                                        </HStack>
                                                      </Badge>
                                                    )}
                                                    {day.isOnline && (
                                                      <Badge
                                                        colorScheme="blue"
                                                        variant="subtle"
                                                        fontSize="xs"
                                                      >
                                                        Online
                                                      </Badge>
                                                    )}
                                                    {day.isPhysical && (
                                                      <Badge
                                                        colorScheme="green"
                                                        variant="subtle"
                                                        fontSize="xs"
                                                      >
                                                        Physical
                                                      </Badge>
                                                    )}
                                                  </HStack>
                                                </VStack>
                                                <VStack align="end" spacing={2}>
                                                  <Badge
                                                    colorScheme={
                                                      status === 'completed'
                                                        ? 'green'
                                                        : status === 'overdue'
                                                        ? 'red'
                                                        : status === 'scheduled'
                                                        ? 'blue'
                                                        : 'gray'
                                                    }
                                                    variant="subtle"
                                                  >
                                                    {status === 'completed'
                                                      ? 'Completed'
                                                      : status === 'overdue'
                                                      ? 'Overdue'
                                                      : status === 'scheduled'
                                                      ? 'Scheduled'
                                                      : 'Not Scheduled'}
                                                  </Badge>
                                                </VStack>
                                              </HStack>

                                              {/* Scheduled Date Display */}
                                              {scheduled && (
                                                <Box
                                                  p={3}
                                                  bg="blue.50"
                                                  borderRadius="md"
                                                  border="1px solid"
                                                  borderColor="blue.200"
                                                >
                                                  <HStack
                                                    spacing={2}
                                                    align="center"
                                                  >
                                                    <MdCalendarToday color="#3182CE" />
                                                    <Text
                                                      fontSize="sm"
                                                      fontWeight="medium"
                                                      color="blue.700"
                                                    >
                                                      Scheduled for:{' '}
                                                      {formatDateSafely(
                                                        scheduled.scheduledDate,
                                                      )}
                                                    </Text>
                                                    {scheduled.isCompleted && (
                                                      <Badge
                                                        colorScheme="green"
                                                        variant="subtle"
                                                        size="sm"
                                                      >
                                                        Completed
                                                      </Badge>
                                                    )}
                                                  </HStack>
                                                  {scheduled.notes && (
                                                    <Text
                                                      fontSize="xs"
                                                      color="blue.600"
                                                      mt={1}
                                                      ml={6}
                                                    >
                                                      Note: {scheduled.notes}
                                                    </Text>
                                                  )}
                                                </Box>
                                              )}

                                              {/* Assignments */}
                                              {day.assignments &&
                                                day.assignments.length > 0 && (
                                                  <Box>
                                                    <Text
                                                      fontWeight="semibold"
                                                      fontSize="sm"
                                                      color="gray.700"
                                                      mb={2}
                                                    >
                                                      <HStack spacing={1}>
                                                        <MdAssignment />
                                                        <Text>Assignments</Text>
                                                      </HStack>
                                                    </Text>
                                                    <List spacing={1}>
                                                      {day.assignments.map(
                                                        (assignment, idx) => (
                                                          <ListItem
                                                            key={idx}
                                                            fontSize="sm"
                                                            color="gray.600"
                                                          >
                                                            <ListIcon
                                                              as={MdCheckCircle}
                                                              color="green.500"
                                                            />
                                                            {assignment}
                                                          </ListItem>
                                                        ),
                                                      )}
                                                    </List>
                                                  </Box>
                                                )}

                                              {/* Resources */}
                                              {day.resources &&
                                                day.resources.length > 0 && (
                                                  <Box>
                                                    <Text
                                                      fontWeight="semibold"
                                                      fontSize="sm"
                                                      color="gray.700"
                                                      mb={2}
                                                    >
                                                      <HStack spacing={1}>
                                                        <MdLink />
                                                        <Text>Resources</Text>
                                                      </HStack>
                                                    </Text>
                                                    <List spacing={1}>
                                                      {day.resources.map(
                                                        (resource, idx) => (
                                                          <ListItem
                                                            key={idx}
                                                            fontSize="sm"
                                                            color="blue.600"
                                                          >
                                                            <ListIcon
                                                              as={MdLink}
                                                              color="blue.500"
                                                            />
                                                            <a
                                                              href={resource}
                                                              target="_blank"
                                                              rel="noopener noreferrer"
                                                            >
                                                              {resource}
                                                            </a>
                                                          </ListItem>
                                                        ),
                                                      )}
                                                    </List>
                                                  </Box>
                                                )}
                                            </VStack>
                                          </Box>
                                        )
                                      })}
                                    </VStack>
                                  </CardBody>
                                </Card>
                              ))}
                            </VStack>
                          </VStack>
                        </CardBody>
                      </Card>
                    </TabPanel>
                  </TabPanels>
                </Tabs>
              </>
            ) : (
              <Alert status="info">
                <AlertIcon />
                <AlertDescription>
                  No syllabus available for your class yet.
                </AlertDescription>
              </Alert>
            )}
          </VStack>
        </StudentStatusGuard>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentSyllabusPage
