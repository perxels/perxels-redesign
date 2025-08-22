import React, { useMemo, useState, useEffect } from 'react'
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
import { doc, getDoc, collection, query, where, getDocs } from 'firebase/firestore'
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

export const ClassesList = () => {
  const router = useRouter()
  const { classes, loading, error } = useClasses()
  const [classesWithSyllabus, setClassesWithSyllabus] = useState<ClassWithSyllabus[]>([])
  const [loadingSyllabus, setLoadingSyllabus] = useState(false)

  const searchQuery = (router.query.search as string) || ''

  // Calculate end date based on syllabus schedule
  const calculateEndDateFromSyllabus = (startDate: Date, syllabus: Syllabus): Date => {
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
  }

  // Fetch actual student count for a class
  const fetchActualStudentCount = async (cohortName: string): Promise<number> => {
    try {
      const studentsQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
        where('schoolFeeInfo.cohort', '==', cohortName)
      )
      
      const querySnapshot = await getDocs(studentsQuery)
      return querySnapshot.size
    } catch (err) {
      console.error('Error fetching student count for cohort:', cohortName, err)
      return 0
    }
  }

  // Fetch syllabus data and student counts for classes
  const fetchSyllabusData = async (classes: ClassData[]) => {
    setLoadingSyllabus(true)
    try {
      const classesWithSyllabusData: ClassWithSyllabus[] = []

      for (const klass of classes) {
        const classWithSyllabus: ClassWithSyllabus = { ...klass }

        // Fetch actual student count
        const actualStudentCount = await fetchActualStudentCount(klass.cohortName)
        classWithSyllabus.actualStudentCount = actualStudentCount

        if (klass.syllabusId) {
          try {
            const syllabusRef = doc(portalDb, 'syllabi', klass.syllabusId)
            const syllabusSnap = await getDoc(syllabusRef)
            
            if (syllabusSnap.exists()) {
              const syllabusData = syllabusSnap.data() as any
              const syllabus: Syllabus = {
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
              }

              // Calculate proper end date from syllabus
              classWithSyllabus.calculatedEndDate = calculateEndDateFromSyllabus(klass.startDate, syllabus)
              classWithSyllabus.syllabusName = syllabus.name
              classWithSyllabus.totalDays = syllabus.totalDays
            } else {
              // No syllabus found, use original end date
              classWithSyllabus.calculatedEndDate = klass.endDate
            }
          } catch (error) {
            console.error(`Error fetching syllabus for class ${klass.id}:`, error)
            // Use original end date as fallback
            classWithSyllabus.calculatedEndDate = klass.endDate
          }
        } else {
          // No syllabus assigned, use original end date
          classWithSyllabus.calculatedEndDate = klass.endDate
        }

        classesWithSyllabusData.push(classWithSyllabus)
      }

      setClassesWithSyllabus(classesWithSyllabusData)
    } catch (error) {
      console.error('Error fetching syllabus data:', error)
      // Fallback to original classes
      setClassesWithSyllabus(classes.map(klass => ({ ...klass, calculatedEndDate: klass.endDate })))
    } finally {
      setLoadingSyllabus(false)
    }
  }

  // Fetch syllabus data when classes change
  useEffect(() => {
    if (classes.length > 0) {
      fetchSyllabusData(classes)
    } else {
      setClassesWithSyllabus([])
    }
  }, [classes])

  const filteredClasses = useMemo(() => {
    if (!searchQuery) return classesWithSyllabus
    const queryLower = searchQuery.toLowerCase()
    return classesWithSyllabus.filter((c) =>
      [c.cohortName, c.branch || '', c.status, c.syllabusName || '']
        .join(' ')
        .toLowerCase()
        .includes(queryLower),
    )
  }, [classesWithSyllabus, searchQuery])

  const handleViewDetails = (classId: string) => {
    router.push(`/portal/admin/classes/${classId}`)
  }

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
        <Box
          key={klass.id}
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
                <Text fontSize="sm" color="gray.700" noOfLines={1}>
                  {klass.branch || 'Not specified'}
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
                onClick={() => handleViewDetails(klass.id)}
              >
                Details
              </Button>
            </Flex>

            <VStack spacing={2} align="stretch">
              <Flex justify="space-between" align="center">
                <Text fontSize="sm" color="gray.700" noOfLines={1} flex="1">
                  {klass.actualStudentCount !== undefined ? klass.actualStudentCount : klass.studentsCount} students
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
                  {klass.startDate?.toLocaleDateString() || '—'}{' '}
                  –{' '}
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
              <Text fontSize="sm" color="gray.700" noOfLines={1}>
                {klass.branch || 'Not specified'}
              </Text>
            </Box>

            {/* Dates */}
            <Box minW="200px">
              <Text fontSize="sm" color="gray.600">
                {klass.startDate?.toLocaleDateString() || '—'}{' '}
                –{' '}
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
              {klass.actualStudentCount !== undefined ? klass.actualStudentCount : klass.studentsCount} students
            </Text>

            {/* Syllabus Info */}
            {/* <Box minW="150px" textAlign="center">
              {klass.syllabusName ? (
                <VStack spacing={1}>
                  <Text fontSize="sm" color="gray.700" noOfLines={1}>
                    {klass.syllabusName}
                  </Text>
                  <Badge colorScheme="purple" variant="subtle" fontSize="xs">
                    {klass.totalDays} days
                  </Badge>
                </VStack>
              ) : (
                <Text fontSize="sm" color="gray.500">
                  No Syllabus
                </Text>
              )}
            </Box> */}

            {/* Status */}
            <Text minW="100px" fontWeight="bold" fontSize="md" color="gray.800" textAlign="center">
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
              onClick={() => handleViewDetails(klass.id)}
            >
              See Details
            </Button>
          </Flex>
        </Box>
      ))}
    </VStack>
  )
}



