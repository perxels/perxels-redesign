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
} from '@chakra-ui/react'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { Syllabus } from '../../../types/syllabus.types'
import { MdCheckCircle, MdAccessTime, MdComputer, MdSchool, MdAssignment, MdLink, MdCalendarToday } from 'react-icons/md'

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

const StudentSyllabusPage = () => {
  const router = useRouter()
  const { user, portalUser } = usePortalAuth()
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [classData, setClassData] = useState<ClassData | null>(null)
  const [scheduledDays, setScheduledDays] = useState<Record<string, ScheduledDay>>({})
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  // Fetch student's class and syllabus
  const fetchStudentSyllabus = async () => {
    if (!user?.uid || !portalUser) return

    try {
      setLoading(true)
      setError(null)

      // Get student's cohort from their profile
      const studentCohort = portalUser.schoolFeeInfo?.cohort
      
      if (!studentCohort) {
        setError('You are not assigned to any class yet. Please contact your administrator.')
        return
      }

      // Find the class for this cohort
      const classesQuery = query(
        collection(portalDb, 'classes'),
        where('cohortName', '==', studentCohort.toUpperCase())
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

      // Fetch scheduled days
      const savedScheduledDays = classDoc.data().scheduledDays || {}
      const convertedScheduledDays: Record<string, ScheduledDay> = {}
      
      Object.keys(savedScheduledDays).forEach(dayId => {
        const dayData = savedScheduledDays[dayId]
        convertedScheduledDays[dayId] = {
          scheduledDate: dayData.scheduledDate?.toDate() || new Date(),
          isCompleted: dayData.isCompleted || false,
          notes: dayData.notes || ''
        }
      })
      
      setScheduledDays(convertedScheduledDays)

      // Fetch syllabus if available
      if (classData.syllabusId) {
        const syllabusRef = doc(portalDb, 'syllabi', classData.syllabusId)
        const syllabusSnap = await getDoc(syllabusRef)

        if (syllabusSnap.exists()) {
          const syllabusData = syllabusSnap.data() as any
          setSyllabus({
            id: syllabusSnap.id,
            name: syllabusData.name,
            description: syllabusData.description,
            totalWeeks: syllabusData.totalWeeks,
            totalDays: syllabusData.totalDays,
            weeks: syllabusData.weeks,
            createdAt: syllabusData.createdAt?.toDate() || new Date(),
            updatedAt: syllabusData.updatedAt?.toDate() || new Date(),
            createdBy: syllabusData.createdBy,
            isActive: syllabusData.isActive,
            version: syllabusData.version,
          })
        } else {
          setError('Syllabus not found for your class')
        }
      } else {
        setError('No syllabus has been assigned to your class yet')
      }

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
      case 'completed': return 'green'
      case 'overdue': return 'red'
      case 'scheduled': return 'blue'
      default: return 'gray'
    }
  }

  const getStatusText = (status: string) => {
    switch (status) {
      case 'completed': return 'Completed'
      case 'overdue': return 'Overdue'
      case 'scheduled': return 'Scheduled'
      default: return 'Not Scheduled'
    }
  }

  const formatScheduledDate = (date: Date) => {
    return date.toLocaleDateString('en-US', {
      weekday: 'short',
      year: 'numeric',
      month: 'short',
      day: 'numeric',
    })
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
        <VStack w="full" align="stretch" spacing={6}>
          {error ? (
            <Alert status="error">
              <AlertIcon />
              <AlertDescription>{error}</AlertDescription>
            </Alert>
          ) : syllabus ? (
            <>
              {/* Syllabus Header */}
              <Card>
                <CardHeader>
                  <VStack align="start" spacing={3}>
                    <HStack justify="space-between" w="full">
                      <Heading size="lg">{syllabus.name}</Heading>
                      <HStack spacing={2}>
                        <Badge colorScheme="purple" variant="subtle">v{syllabus.version}</Badge>
                        <Badge colorScheme="green" variant="subtle">Active</Badge>
                      </HStack>
                    </HStack>
                    <Text color="gray.600" fontSize="lg">{syllabus.description}</Text>
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
                        <Text>Cohort: <strong>{classData.cohortName}</strong></Text>
                        <Text>Start Date: <strong>{formatDate(classData.startDate)}</strong></Text>
                        <Text>End Date: <strong>{formatDate(classData.endDate)}</strong></Text>
                      </HStack>
                    )}
                  </VStack>
                </CardHeader>
              </Card>

              {/* Syllabus Content */}
              <Card>
                <CardHeader>
                  <Heading size="md">Course Content</Heading>
                </CardHeader>
                <CardBody>
                  <VStack spacing={4} align="stretch">
                    {/* Full Syllabus List */}
                    <VStack spacing={6} align="stretch">
                      {syllabus.weeks.map((week, weekIndex) => (
                        <Card key={week.id || weekIndex} variant="outline">
                          <CardHeader>
                            <HStack justify="space-between" align="center">
                              <VStack align="start" spacing={1}>
                                <Heading size="md">{week.title}</Heading>
                                <Text fontSize="sm" color="gray.600">
                                  {week.days.length} days • Week {week.weekNumber}
                                </Text>
                              </VStack>
                              <Badge colorScheme="blue" variant="subtle">
                                {week.days.length} days
                              </Badge>
                            </HStack>
                          </CardHeader>
                          <CardBody>
                            <VStack spacing={4} align="stretch">
                              {week.days.map((day, dayIndex) => {
                                const status = getDayStatus(day)
                                const scheduled = getScheduledDay(day.id)
                                
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
                                      <HStack justify="space-between" align="start">
                                        <VStack align="start" spacing={1} flex="1">
                                          <Text fontWeight="bold" fontSize="lg" color="purple.600">
                                            Day {day.dayNumber}: {day.title}
                                          </Text>
                                          <Text fontSize="sm" color="gray.700">
                                            {day.content}
                                          </Text>
                                          <HStack spacing={2} mt={2}>
                                            {day.duration && (
                                              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                                                <HStack spacing={1}>
                                                  <MdAccessTime />
                                                  <Text>{day.duration}</Text>
                                                </HStack>
                                              </Badge>
                                            )}
                                            {/* Show class type if available */}
                                            {(day as any).classType && (
                                              <Badge 
                                                colorScheme={(day as any).classType === 'online' ? 'blue' : 'orange'} 
                                                variant="subtle" 
                                                fontSize="xs"
                                              >
                                                <HStack spacing={1}>
                                                  {(day as any).classType === 'online' ? <MdComputer /> : <MdSchool />}
                                                  <Text>{(day as any).classType}</Text>
                                                </HStack>
                                              </Badge>
                                            )}
                                          </HStack>
                                        </VStack>
                                        <VStack align="end" spacing={2}>
                                          <Badge colorScheme={getStatusColor(status)} variant="subtle">
                                            {getStatusText(status)}
                                          </Badge>
                                        </VStack>
                                      </HStack>

                                      {/* Scheduled Date Display */}
                                      {scheduled && (
                                        <Box p={3} bg="blue.50" borderRadius="md" border="1px solid" borderColor="blue.200">
                                          <HStack spacing={2} align="center">
                                            <MdCalendarToday color="#3182CE" />
                                            <Text fontSize="sm" fontWeight="medium" color="blue.700">
                                              Scheduled for: {formatScheduledDate(scheduled.scheduledDate)}
                                            </Text>
                                            {scheduled.isCompleted && (
                                              <Badge colorScheme="green" variant="subtle" size="sm">
                                                Completed
                                              </Badge>
                                            )}
                                          </HStack>
                                          {scheduled.notes && (
                                            <Text fontSize="xs" color="blue.600" mt={1} ml={6}>
                                              Note: {scheduled.notes}
                                            </Text>
                                          )}
                                        </Box>
                                      )}

                                      {/* Assignments */}
                                      {day.assignments && day.assignments.length > 0 && (
                                        <Box>
                                          <Text fontWeight="semibold" fontSize="sm" color="gray.700" mb={2}>
                                            <HStack spacing={1}>
                                              <MdAssignment />
                                              <Text>Assignments</Text>
                                            </HStack>
                                          </Text>
                                          <List spacing={1}>
                                            {day.assignments.map((assignment, idx) => (
                                              <ListItem key={idx} fontSize="sm" color="gray.600">
                                                <ListIcon as={MdCheckCircle} color="green.500" />
                                                {assignment}
                                              </ListItem>
                                            ))}
                                          </List>
                                        </Box>
                                      )}

                                      {/* Resources */}
                                      {day.resources && day.resources.length > 0 && (
                                        <Box>
                                          <Text fontWeight="semibold" fontSize="sm" color="gray.700" mb={2}>
                                            <HStack spacing={1}>
                                              <MdLink />
                                              <Text>Resources</Text>
                                            </HStack>
                                          </Text>
                                          <List spacing={1}>
                                            {day.resources.map((resource, idx) => (
                                              <ListItem key={idx} fontSize="sm" color="blue.600">
                                                <ListIcon as={MdLink} color="blue.500" />
                                                <a href={resource} target="_blank" rel="noopener noreferrer">
                                                  {resource}
                                                </a>
                                              </ListItem>
                                            ))}
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
            </>
          ) : (
            <Alert status="info">
              <AlertIcon />
              <AlertDescription>No syllabus available for your class yet.</AlertDescription>
            </Alert>
          )}
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentSyllabusPage
