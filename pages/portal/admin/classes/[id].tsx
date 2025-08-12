import React, { useEffect, useState, useCallback, useMemo } from 'react'
import { useRouter } from 'next/router'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
import {
  VStack,
  Alert,
  AlertIcon,
  AlertDescription,
  HStack,
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  useToast,
  Skeleton,
} from '@chakra-ui/react'
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { ClassSyllabusManagement } from '../../../../features/portal/admin/classes/class-syllabus-management'
import { ClassStudentList } from '../../../../features/portal/admin/classes/class-student-list'
import { Syllabus } from '../../../../types/syllabus.types'

interface ClassData {
  id: string
  cohortName: string
  startDate?: any
  endDate?: any
  createdBy?: string
  createdAt?: any
  status?: 'active' | 'inactive' | 'completed'
  studentsCount?: number
  branch?: string
  description?: string
  syllabusId?: string
}

interface ClassStats {
  totalStudents: number
  courseWeeks: number
  courseDays: number
}

// Utility function for date formatting
const formatDate = (value?: any): string => {
  if (!value) return '—'
  try {
    const d = value?.toDate ? value.toDate() : new Date(value)
    return d.toLocaleDateString()
  } catch {
    return '—'
  }
}

// Utility function for converting Firestore timestamp to Date
const convertTimestamp = (timestamp: any): Date => {
  if (!timestamp) return new Date()
  return timestamp?.toDate ? timestamp.toDate() : new Date(timestamp)
}

const ClassDetailsPage = () => {
  const router = useRouter()
  const { id } = router.query
  const [klass, setKlass] = useState<ClassData | null>(null)
  const [syllabus, setSyllabus] = useState<Syllabus | null>(null)
  const [actualStudentCount, setActualStudentCount] = useState(0)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const [loadingStudents, setLoadingStudents] = useState(false)
  const toast = useToast()

  // Memoized class ID
  const classId = useMemo(() => {
    return typeof id === 'string' ? id : null
  }, [id])

  // Memoized stats
  const classStats = useMemo((): ClassStats => ({
    totalStudents: actualStudentCount,
    courseWeeks: syllabus?.totalWeeks || 0,
    courseDays: syllabus?.totalDays || 0,
  }), [actualStudentCount, syllabus])

  // Fetch class data
  const fetchClass = useCallback(async () => {
    if (!classId) return
    
    try {
      setLoading(true)
      setError(null)
      
      const ref = doc(portalDb, 'classes', classId)
      const snap = await getDoc(ref)
      
      if (!snap.exists()) {
        setError('Class not found')
        setKlass(null)
        return
      }
      
      const d = snap.data() as any
      const classData: ClassData = {
        id: snap.id,
        cohortName: d.cohortName,
        startDate: d.startDate,
        endDate: d.endDate,
        createdBy: d.createdBy,
        createdAt: d.createdAt,
        status: d.status || 'active',
        studentsCount: d.studentsCount || 0,
        branch: d.branch || 'Not specified',
        description: d.description || '',
        syllabusId: d.syllabusId || '',
      }
      
      setKlass(classData)
      
      // Fetch syllabus if syllabusId exists
      if (d.syllabusId) {
        await fetchSyllabus(d.syllabusId)
      }
      
    } catch (e) {
      console.error('Error fetching class:', e)
      setError('Failed to load class details')
    } finally {
      setLoading(false)
    }
  }, [classId])

  // Fetch syllabus data
  const fetchSyllabus = useCallback(async (syllabusId: string) => {
    try {
      const syllabusRef = doc(portalDb, 'syllabi', syllabusId)
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
          createdAt: convertTimestamp(syllabusData.createdAt),
          updatedAt: convertTimestamp(syllabusData.updatedAt),
          createdBy: syllabusData.createdBy,
          isActive: syllabusData.isActive,
          version: syllabusData.version,
        })
      }
    } catch (syllabusError) {
      console.error('Error fetching syllabus:', syllabusError)
    }
  }, [])

  // Fetch actual student count
  const fetchActualStudentCount = useCallback(async () => {
    if (!klass?.cohortName) return
    
    try {
      setLoadingStudents(true)
      const studentsQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
        where('schoolFeeInfo.cohort', '==', klass.cohortName)
      )
      
      const querySnapshot = await getDocs(studentsQuery)
      setActualStudentCount(querySnapshot.size)
    } catch (err) {
      console.error('Error fetching student count:', err)
      // Fallback to the stored count if query fails
      setActualStudentCount(klass.studentsCount || 0)
    } finally {
      setLoadingStudents(false)
    }
  }, [klass?.cohortName, klass?.studentsCount])

  // Main effect to fetch class data
  useEffect(() => {
    fetchClass()
  }, [fetchClass])

  // Effect to fetch student count when class data is available
  useEffect(() => {
    if (klass?.cohortName) {
      fetchActualStudentCount()
    }
  }, [fetchActualStudentCount])

  // Loading skeleton component
  const LoadingSkeleton = () => (
    <VStack w="full" align="stretch" spacing={6}>
      <HStack spacing={4}>
        {[1, 2, 3].map((i) => (
          <Stat key={i}>
            <StatLabel>
              <Skeleton height="16px" width="100px" />
            </StatLabel>
            <StatNumber>
              <Skeleton height="32px" width="60px" />
            </StatNumber>
            <StatHelpText>
              <Skeleton height="12px" width="120px" />
            </StatHelpText>
          </Stat>
        ))}
      </HStack>
      <Skeleton height="400px" />
    </VStack>
  )

  // Stats component
  const StatsCards = () => (
    <HStack spacing={4}>
      <Stat>
        <StatLabel>Total Students</StatLabel>
        <StatNumber>
          {loadingStudents ? (
            <Skeleton height="32px" width="60px" />
          ) : (
            classStats.totalStudents
          )}
        </StatNumber>
        <StatHelpText>Enrolled in this class</StatHelpText>
      </Stat>
      {syllabus && (
        <>
          <Stat>
            <StatLabel>Course Weeks</StatLabel>
            <StatNumber>{classStats.courseWeeks}</StatNumber>
            <StatHelpText>Total course duration</StatHelpText>
          </Stat>
          <Stat>
            <StatLabel>Course Days</StatLabel>
            <StatNumber>{classStats.courseDays}</StatNumber>
            <StatHelpText>Total class sessions</StatHelpText>
          </Stat>
        </>
      )}
    </HStack>
  )

  // Main content component
  const MainContent = () => (
    <Tabs variant="enclosed" colorScheme="purple" defaultIndex={syllabus ? 1 : 0}>
      <TabList>
        <Tab>Students</Tab>
        <Tab>Syllabus</Tab>
      </TabList>

      <TabPanels>
        {/* Students Tab */}
        <TabPanel px={0}>
          <ClassStudentList
            classId={klass!.id}
            cohortName={klass!.cohortName}
          />
        </TabPanel>

        {/* Syllabus Tab */}
        <TabPanel px={0} py={0}>
          <ClassSyllabusManagement
            classId={klass!.id}
            currentSyllabusId={klass!.syllabusId}
            classStartDate={convertTimestamp(klass!.startDate)}
            classEndDate={convertTimestamp(klass!.endDate)}
            onSyllabusUpdate={(syllabusId) => {
              // Refresh the page to get updated data
              window.location.reload()
            }}
          />
        </TabPanel>
      </TabPanels>
    </Tabs>
  )

  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        {loading ? (
          <LoadingSkeleton />
        ) : error ? (
          <Alert status="error">
            <AlertIcon />
            <AlertDescription>{error}</AlertDescription>
          </Alert>
        ) : !klass ? (
          <Alert status="info">
            <AlertIcon />
            <AlertDescription>Class not found</AlertDescription>
          </Alert>
        ) : (
          <VStack w="full" align="stretch" spacing={6}>
            <StatsCards />
            <MainContent />
          </VStack>
        )}
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default ClassDetailsPage


