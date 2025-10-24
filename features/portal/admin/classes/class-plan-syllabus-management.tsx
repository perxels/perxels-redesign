import React, { useState, useEffect } from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Badge,
  Select,
  useToast,
  Spinner,
  Alert,
  AlertIcon,
  SimpleGrid,
} from '@chakra-ui/react'
import { collection, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { ClassPlanSyllabus } from '../../../../types/syllabus.types'
import { ClassSyllabusManagement } from './class-syllabus-management'
import { CLASS_PLAN_CONFIGS } from '../../../../constant/classPlans'

interface ClassPlanSyllabusManagementProps {
  classId: string
  cohortName: string
}

export const ClassPlanSyllabusManagement: React.FC<
  ClassPlanSyllabusManagementProps
> = ({ classId, cohortName }) => {
  const [classPlanSyllabi, setClassPlanSyllabi] = useState<ClassPlanSyllabus[]>(
    [],
  )
  const [selectedClassPlan, setSelectedClassPlan] = useState<string>('')
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const toast = useToast()
  const { portalUser } = usePortalAuth()
  const isAdmin = portalUser?.role === 'admin'

  const fetchClassPlanSyllabi = async () => {
    if (!isAdmin) return

    try {
      setLoading(true)
      const q = query(
        collection(portalDb, 'classPlanSyllabi'),
        where('classId', '==', classId),
      )

      const querySnapshot = await getDocs(q)
      const syllabiData: ClassPlanSyllabus[] = []

      querySnapshot.forEach((doc) => {
        const data = doc.data()
        syllabiData.push({
          id: doc.id,
          ...data,
          startDate: data.startDate?.toDate(),
          endDate: data.endDate?.toDate(),
          createdAt: data.createdAt?.toDate(),
          updatedAt: data.updatedAt?.toDate(),
        } as ClassPlanSyllabus)
      })

      setClassPlanSyllabi(syllabiData)

      // Set default selection
      if (syllabiData.length > 0 && !selectedClassPlan) {
        setSelectedClassPlan(syllabiData[0].classPlan)
      }
    } catch (err) {
      console.error('Error fetching class plan syllabi:', err)
      setError('Failed to load class plan syllabi')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchClassPlanSyllabi()
  }, [classId, isAdmin])

  const getSelectedSyllabus = (): ClassPlanSyllabus | undefined => {
    return classPlanSyllabi.find((s) => s.classPlan === selectedClassPlan)
  }

  const selectedSyllabus = getSelectedSyllabus()

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" />
        <Text mt={4}>Loading class plan syllabi...</Text>
      </Box>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardHeader>
          <VStack align="start" spacing={4}>
            <Heading size="lg">Class Plan Syllabus Management</Heading>
            <Text color="gray.600">
              Manage syllabi for different class plans in {cohortName}
            </Text>

            {/* Class Plan Selector */}
            <Box w="full">
              <Text fontWeight="medium" mb={2}>
                Select Class Plan:
              </Text>
              <Select
                value={selectedClassPlan}
                onChange={(e) => setSelectedClassPlan(e.target.value)}
                bg="white"
                maxW="400px"
              >
                {classPlanSyllabi.map((syllabus) => (
                  <option key={syllabus.classPlan} value={syllabus.classPlan}>
                    {CLASS_PLAN_CONFIGS[
                      syllabus.classPlan as keyof typeof CLASS_PLAN_CONFIGS
                    ]?.name || syllabus.classPlan}
                  </option>
                ))}
              </Select>
            </Box>
          </VStack>
        </CardHeader>
      </Card>

      {/* Class Plan Overview */}
      <Card>
        <CardHeader>
          <Heading size="md">All Class Plans</Heading>
        </CardHeader>
        <CardBody>
          <SimpleGrid columns={{ base: 1, md: 2, lg: 3 }} spacing={4}>
            {classPlanSyllabi.map((syllabus) => {
              const config =
                CLASS_PLAN_CONFIGS[
                  syllabus.classPlan as keyof typeof CLASS_PLAN_CONFIGS
                ]
              return (
                <Card
                  key={syllabus.classPlan}
                  variant="outline"
                  cursor="pointer"
                  onClick={() => setSelectedClassPlan(syllabus.classPlan)}
                  borderColor={
                    selectedClassPlan === syllabus.classPlan
                      ? 'blue.500'
                      : 'gray.200'
                  }
                  bg={
                    selectedClassPlan === syllabus.classPlan
                      ? 'blue.50'
                      : 'white'
                  }
                >
                  <CardBody>
                    <VStack align="start" spacing={2}>
                      <Text fontWeight="semibold">{config?.name}</Text>
                      <Text fontSize="sm" color="gray.600">
                        {config?.location} •{' '}
                        {config?.defaultSchedule.sessionDays.join(', ')}
                      </Text>
                      <Badge colorScheme="blue">
                        {Object.keys(syllabus.scheduledDays).length} days
                        scheduled
                      </Badge>
                    </VStack>
                  </CardBody>
                </Card>
              )
            })}
          </SimpleGrid>
        </CardBody>
      </Card>

      {/* Selected Class Plan Syllabus */}
      {selectedSyllabus && (
        <ClassSyllabusManagement
          classId={classId}
          currentSyllabusId={selectedSyllabus.baseSyllabusId}
          classStartDate={selectedSyllabus.startDate}
          classEndDate={selectedSyllabus.endDate}
          classPlan={selectedClassPlan}
          classPlanSyllabusId={selectedSyllabus.id}
        />
      )}
    </VStack>
  )
}
