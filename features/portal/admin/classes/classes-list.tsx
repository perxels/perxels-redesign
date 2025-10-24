import React, { useMemo, useState, useEffect, useCallback } from 'react'
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
  Skeleton,
} from '@chakra-ui/react'
import { useRouter } from 'next/router'
import { useClasses } from '../../../../hooks/useClasses'
import {
  doc,
  getDoc,
  collection,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { Syllabus } from '../../../../types/syllabus.types'

// Import ClassData interface from useClasses
interface ClassData {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
  branch?: string
  paymentStatus?: 'pending' | 'partial' | 'completed' | 'overdue'
  syllabusId?: string
}

interface ClassWithSyllabus extends ClassData {
  calculatedEndDate?: Date
  syllabusName?: string
  totalDays?: number
  actualStudentCount?: number
}

// Memoized ClassItem component to prevent unnecessary re-renders
const ClassItem = React.memo<{
  klass: ClassWithSyllabus
  onViewDetails: (id: string) => void
}>(function ClassItem({ klass, onViewDetails }) {
  return (
    <Box
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
              {klass.cohortName}
            </Text>
          </Box>
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
            onClick={() => onViewDetails(klass.id)}
          >
            Details
          </Button>
        </Flex>

        <VStack spacing={2} align="stretch">
          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.700" noOfLines={1} flex="1">
              {klass.actualStudentCount !== undefined
                ? klass.actualStudentCount
                : klass.studentsCount}{' '}
              students
            </Text>
            <Badge
              colorScheme={
                klass.status === 'active'
                  ? 'green'
                  : klass.status === 'completed'
                  ? 'blue'
                  : 'gray'
              }
              variant="subtle"
              fontSize="xs"
            >
              {klass.status}
            </Badge>
          </Flex>

          <Flex justify="space-between" align="center">
            <Text fontSize="sm" color="gray.600" noOfLines={1} flex="1">
              {klass.startDate?.toLocaleDateString() || '—'} –{' '}
              {klass.calculatedEndDate?.toLocaleDateString() || '—'}
              {klass.syllabusName && klass.calculatedEndDate && (
                <Badge ml={2} colorScheme="blue" variant="subtle" fontSize="xs">
                  Calculated
                </Badge>
              )}
            </Text>
          </Flex>

          {/* Syllabus Info (Mobile) */}
          {klass.syllabusName && (
            <Flex justify="space-between" align="center">
              <Text fontSize="xs" color="gray.500" noOfLines={1} flex="1">
                {klass.syllabusName}
              </Text>
              <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                {klass.totalDays} days
              </Badge>
            </Flex>
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
        {/* Name */}
        <Box minW="200px">
          <Text fontWeight="bold" fontSize="md" mb={1} noOfLines={1}>
            {klass.cohortName}
          </Text>
        </Box>

        {/* Dates */}
        <Box minW="200px">
          <Text fontSize="sm" color="gray.600">
            {klass.startDate?.toLocaleDateString() || '—'} –{' '}
            {klass.calculatedEndDate?.toLocaleDateString() || '—'}
          </Text>
          {klass.syllabusName && klass.calculatedEndDate && (
            <Badge colorScheme="blue" variant="subtle" fontSize="xs" mt={1}>
              Calculated from Syllabus
            </Badge>
          )}
        </Box>

        {/* Students Count */}
        <Text minW="120px" fontSize="sm" color="gray.700" textAlign="center">
          {klass.actualStudentCount !== undefined
            ? klass.actualStudentCount
            : klass.studentsCount}{' '}
          students
        </Text>

        {/* Status */}
        <Text
          minW="100px"
          fontWeight="bold"
          fontSize="md"
          color="gray.800"
          textAlign="center"
        >
          {klass.status}
        </Text>

        {/* See Details Button */}
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
          minW="90px"
          onClick={() => onViewDetails(klass.id)}
        >
          See Details
        </Button>
      </Flex>
    </Box>
  )
})

export const ClassesList = () => {
  const router = useRouter()
  const { classes, loading, error } = useClasses()
  const [classesWithSyllabus, setClassesWithSyllabus] = useState<
    ClassWithSyllabus[]
  >([])
  const [loadingSyllabus, setLoadingSyllabus] = useState(false)

  const searchQuery = (router.query.search as string) || ''

  // Memoized calculation to avoid recalculating on every render
  const calculateEndDateFromSyllabus = useCallback(
    (startDate: Date, syllabus: Syllabus): Date => {
      if (!syllabus || !syllabus.totalDays) {
        return startDate // Fallback to start date if no syllabus
      }

      let currentDate = new Date(startDate)
      let daysScheduled = 0

      // Schedule each day, skipping weekends
      while (daysScheduled < syllabus.totalDays) {
        // Skip weekends (Saturday = 6, Sunday = 0)
        while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
          currentDate.setDate(currentDate.getDate() + 1)
        }

        daysScheduled++

        // Move to next day (skip weekends)
        if (daysScheduled < syllabus.totalDays) {
          currentDate.setDate(currentDate.getDate() + 1)
          while (currentDate.getDay() === 0 || currentDate.getDay() === 6) {
            currentDate.setDate(currentDate.getDate() + 1)
          }
        }
      }

      return currentDate
    },
    [],
  )

  // Optimized: Fetch all student counts in one batch query
  const fetchAllStudentCounts = useCallback(
    async (cohortNames: string[]): Promise<Record<string, number>> => {
      try {
        const counts: Record<string, number> = {}

        if (cohortNames.length === 0) return counts

        // Fetch all students at once and group by cohort
        const studentsQuery = query(
          collection(portalDb, 'users'),
          where('role', '==', 'student'),
        )

        const querySnapshot = await getDocs(studentsQuery)

        // Count students per cohort
        querySnapshot.docs.forEach((doc) => {
          const data = doc.data()
          const cohort = data.schoolFeeInfo?.cohort?.toUpperCase()
          if (
            cohort &&
            cohortNames.map((c) => c.toUpperCase()).includes(cohort)
          ) {
            counts[cohort] = (counts[cohort] || 0) + 1
          }
        })

        // Ensure all cohorts have a count (even if 0)
        cohortNames.forEach((cohortName) => {
          const upperCohort = cohortName.toUpperCase()
          if (!(upperCohort in counts)) {
            counts[upperCohort] = 0
          }
        })

        return counts
      } catch (err) {
        console.error('Error fetching student counts:', err)
        return {}
      }
    },
    [],
  )

  // Optimized: Fetch syllabus data and student counts in parallel
  const fetchSyllabusData = useCallback(
    async (classes: ClassData[]) => {
      setLoadingSyllabus(true)
      try {
        // 1. Fetch all student counts in one batch query
        const cohortNames = classes.map((c) => c.cohortName)
        const studentCounts = await fetchAllStudentCounts(cohortNames)

        // 2. Get unique syllabus IDs
        const syllabusIds = Array.from(
          new Set(classes.map((c) => c.syllabusId).filter(Boolean)),
        )

        // 3. Fetch all syllabi in parallel
        const syllabusPromises = syllabusIds.map(async (syllabusId) => {
          try {
            const syllabusRef = doc(portalDb, 'syllabi', syllabusId!)
            const syllabusSnap = await getDoc(syllabusRef)

            if (syllabusSnap.exists()) {
              const syllabusData = syllabusSnap.data() as any
              return {
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
              } as Syllabus
            }
            return null
          } catch (error) {
            console.error(`Error fetching syllabus ${syllabusId}:`, error)
            return null
          }
        })

        const syllabusResults = await Promise.all(syllabusPromises)
        const syllabusMap = new Map<string, Syllabus>()

        syllabusResults.forEach((syllabus, index) => {
          if (syllabus) {
            const syllabusId = syllabusIds[index]
            if (syllabusId) {
              syllabusMap.set(syllabusId, syllabus)
            }
          }
        })

        // 4. Process all classes with fetched data
        const classesWithSyllabusData: ClassWithSyllabus[] = classes.map(
          (klass) => {
            const classWithSyllabus: ClassWithSyllabus = { ...klass }

            // Set actual student count from batch query
            const cohortUpper = klass.cohortName.toUpperCase()
            classWithSyllabus.actualStudentCount =
              studentCounts[cohortUpper] || 0

            // Set syllabus data if available
            if (klass.syllabusId && syllabusMap.has(klass.syllabusId)) {
              const syllabus = syllabusMap.get(klass.syllabusId)!
              classWithSyllabus.calculatedEndDate =
                calculateEndDateFromSyllabus(klass.startDate, syllabus)
              classWithSyllabus.syllabusName = syllabus.name
              classWithSyllabus.totalDays = syllabus.totalDays
            } else {
              // No syllabus assigned or not found, use original end date
              classWithSyllabus.calculatedEndDate = klass.endDate
            }

            return classWithSyllabus
          },
        )

        setClassesWithSyllabus(classesWithSyllabusData)
      } catch (error) {
        console.error('Error fetching syllabus data:', error)
        // Fallback to original classes
        setClassesWithSyllabus(
          classes.map((klass) => ({
            ...klass,
            calculatedEndDate: klass.endDate,
          })),
        )
      } finally {
        setLoadingSyllabus(false)
      }
    },
    [fetchAllStudentCounts, calculateEndDateFromSyllabus],
  )

  // Fetch syllabus data when classes change
  useEffect(() => {
    if (classes.length > 0) {
      fetchSyllabusData(classes)
    } else {
      setClassesWithSyllabus([])
    }
  }, [classes, fetchSyllabusData])

  const filteredClasses = useMemo(() => {
    // Always sort by class name (cohortName) alphabetically
    const sortedClasses = [...classesWithSyllabus].sort((a, b) =>
      a.cohortName.localeCompare(b.cohortName),
    )

    if (!searchQuery) return sortedClasses
    const queryLower = searchQuery.toLowerCase()
    return sortedClasses.filter((c) =>
      [c.cohortName, c.branch || '', c.status, c.syllabusName || '']
        .join(' ')
        .toLowerCase()
        .includes(queryLower),
    )
  }, [classesWithSyllabus, searchQuery])

  const handleViewDetails = useCallback(
    (classId: string) => {
      router.push(`/portal/admin/classes/${classId}`)
    },
    [router],
  )

  if (loading || loadingSyllabus)
    return (
      <Box textAlign="center" py={12}>
        <Spinner size="lg" color="purple.500" />
        <Text mt={4} color="gray.600">
          {loading ? 'Loading classes...' : 'Calculating class schedules...'}
        </Text>
      </Box>
    )

  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        <AlertDescription>{error}</AlertDescription>
      </Alert>
    )

  if (filteredClasses.length === 0)
    return (
      <Alert status="info">
        <AlertIcon />
        <AlertDescription>
          {classesWithSyllabus.length === 0
            ? 'No classes found. Create a class to get started.'
            : 'No classes match your current search.'}
        </AlertDescription>
      </Alert>
    )

  return (
    <VStack spacing={4} py={4} align="stretch" w="full">
      {filteredClasses.map((klass) => (
        <ClassItem
          key={klass.id}
          klass={klass}
          onViewDetails={handleViewDetails}
        />
      ))}
    </VStack>
  )
}
