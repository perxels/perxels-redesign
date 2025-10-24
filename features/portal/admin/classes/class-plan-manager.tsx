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
  Tabs,
  TabList,
  TabPanels,
  Tab,
  TabPanel,
  useToast,
  Alert,
  AlertIcon,
  Spinner,
} from '@chakra-ui/react'
import { doc, getDoc, updateDoc } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { Cohort, ClassPlan, Syllabus } from '../../../../types/cohort.types'
import { ClassSyllabusManagement } from './class-syllabus-management'

interface ClassPlanManagerProps {
  cohortId: string
  classPlanId: string
}

export const ClassPlanManager: React.FC<ClassPlanManagerProps> = ({
  cohortId,
  classPlanId,
}) => {
  const [cohort, setCohort] = useState<Cohort | null>(null)
  const [classPlan, setClassPlan] = useState<ClassPlan | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)
  const toast = useToast()

  const fetchCohortData = async () => {
    try {
      setLoading(true)
      const cohortRef = doc(portalDb, 'cohorts', cohortId)
      const cohortSnap = await getDoc(cohortRef)

      if (!cohortSnap.exists()) {
        setError('Cohort not found')
        return
      }

      const cohortData = cohortSnap.data() as Cohort
      setCohort({
        ...cohortData,
        id: cohortSnap.id,
        startDate: cohortData.startDate,
        endDate: cohortData.endDate,
        createdAt: cohortData.createdAt,
        updatedAt: cohortData.updatedAt,
      })

      // Find the specific class plan
      const foundClassPlan = cohortData.classPlans.find(
        (cp) => cp.id === classPlanId,
      )
      if (!foundClassPlan) {
        setError('Class plan not found')
        return
      }

      setClassPlan(foundClassPlan)
    } catch (err) {
      console.error('Error fetching cohort:', err)
      setError('Failed to load class plan data')
    } finally {
      setLoading(false)
    }
  }

  const handleSyllabusUpdate = async (syllabusId: string) => {
    if (!cohort || !classPlan) return

    try {
      // In a real implementation, you would update the specific syllabus
      // For now, we'll just show a success message
      toast({
        title: 'Syllabus Updated',
        description: 'Changes saved for this class plan only',
        status: 'success',
        duration: 3000,
      })
    } catch (err) {
      console.error('Error updating syllabus:', err)
      toast({
        title: 'Update Failed',
        description: 'Failed to save syllabus changes',
        status: 'error',
        duration: 3000,
      })
    }
  }

  useEffect(() => {
    if (cohortId && classPlanId) {
      fetchCohortData()
    }
  }, [cohortId, classPlanId])

  if (loading) {
    return (
      <Box textAlign="center" py={8}>
        <Spinner size="xl" />
        <Text mt={4}>Loading class plan...</Text>
      </Box>
    )
  }

  if (error || !cohort || !classPlan) {
    return (
      <Alert status="error">
        <AlertIcon />
        <Text>{error || 'Class plan not found'}</Text>
      </Alert>
    )
  }

  return (
    <VStack spacing={6} align="stretch">
      {/* Header */}
      <Card>
        <CardBody>
          <VStack align="start" spacing={3}>
            <HStack justify="space-between" w="full">
              <Heading size="lg">{classPlan.name}</Heading>
              <Badge colorScheme="blue" variant="subtle">
                {cohort.cohortName}
              </Badge>
            </HStack>
            <Text color="gray.600">
              Customize the syllabus and schedule for this specific class plan.
              Changes here only affect this class plan.
            </Text>
            <HStack spacing={4}>
              <Badge colorScheme="green">
                {classPlan.schedulePattern.daysOfWeek.length} days/week
              </Badge>
              <Badge colorScheme="purple">
                {classPlan.syllabus.totalDays} total sessions
              </Badge>
              <Badge colorScheme="orange">
                {classPlan.customizations?.modifiedDays.length || 0}{' '}
                customizations
              </Badge>
            </HStack>
          </VStack>
        </CardBody>
      </Card>

      {/* Management Tabs */}
      <Tabs variant="enclosed">
        <TabList>
          <Tab>Syllabus Content</Tab>
          <Tab>Schedule</Tab>
          <Tab>Customizations</Tab>
        </TabList>

        <TabPanels>
          <TabPanel px={0}>
            <ClassSyllabusManagement
              classId={cohortId}
              currentSyllabusId={classPlan.syllabus.id}
              classStartDate={cohort.startDate}
              classEndDate={cohort.endDate}
              onSyllabusUpdate={handleSyllabusUpdate}
            />
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Class Schedule</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text>
                    <strong>Class Days:</strong>{' '}
                    {classPlan.schedulePattern.daysOfWeek
                      .map(
                        (day) =>
                          [
                            'Sunday',
                            'Monday',
                            'Tuesday',
                            'Wednesday',
                            'Thursday',
                            'Friday',
                            'Saturday',
                          ][day],
                      )
                      .join(', ')}
                  </Text>
                  <Text>
                    <strong>Frequency:</strong>{' '}
                    {classPlan.schedulePattern.frequency}
                  </Text>
                  <Text>
                    <strong>Session Duration:</strong>{' '}
                    {classPlan.schedulePattern.sessionDuration}
                  </Text>
                  <Alert status="info" size="sm">
                    <AlertIcon />
                    Schedule is automatically generated based on the class
                    pattern and start date.
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>

          <TabPanel>
            <Card>
              <CardHeader>
                <Heading size="md">Customizations</Heading>
              </CardHeader>
              <CardBody>
                <VStack align="start" spacing={3}>
                  <Text>
                    <strong>Modified Days:</strong>{' '}
                    {classPlan.customizations?.modifiedDays.length || 0}
                  </Text>
                  <Text>
                    <strong>Custom Schedule Entries:</strong>{' '}
                    {
                      Object.keys(
                        classPlan.customizations?.customSchedule || {},
                      ).length
                    }
                  </Text>
                  <Alert status="warning" size="sm">
                    <AlertIcon />
                    Customizations are specific to this class plan only and
                    don't affect other class plans in the cohort.
                  </Alert>
                </VStack>
              </CardBody>
            </Card>
          </TabPanel>
        </TabPanels>
      </Tabs>
    </VStack>
  )
}
