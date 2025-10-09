import React, { useEffect, useState } from 'react'
import {
  Box,
  SimpleGrid,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  Card,
  CardBody,
  VStack,
  Heading,
  Spinner,
  Text,
} from '@chakra-ui/react'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { useFacilitator } from '../../../hooks/useFacilitator'
import { FacilitatorDashboardStats } from '../../../types/facilitator'
import { FacilitatorDashboardMenu } from './facilitator-dashboard-menu'
import { FacilitatorAlert } from './facilitator-alert'
import { AssignmentAlert } from './assignment-alert'

export const FacilitatorDashboard: React.FC = () => {
  const { portalUser } = usePortalAuth()
  const { getDashboardStats } = useFacilitator()
  const [stats, setStats] = useState<FacilitatorDashboardStats | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const loadStats = async () => {
      if (portalUser?.uid) {
        const dashboardStats = await getDashboardStats(portalUser.uid)
        setStats(dashboardStats)
        setLoading(false)
      }
    }

    loadStats()
  }, [portalUser?.uid, getDashboardStats])

  if (loading) {
    return (
      <Box textAlign="center" py={10}>
        <Spinner size="xl" color="brand.purple.500" />
        <Text mt={4}>Loading dashboard...</Text>
      </Box>
    )
  }

  return (
    <VStack w="full" align="stretch" spacing={8}>
      <Box>
        <Heading size="lg" mb={2}>
          Welcome back, {portalUser?.fullName}!
        </Heading>
        <Text color="gray.600">
          Here&apos;s an overview of your facilitator dashboard
        </Text>
      </Box>

      {/* Statistics Grid */}
      <SimpleGrid columns={{ base: 1, md: 2, lg: 4 }} spacing={6}>
        <Card bg="white" boxShadow="sm" borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Total Students</StatLabel>
              <StatNumber color="brand.purple.500">
                {stats?.totalStudents || 0}
              </StatNumber>
              <StatHelpText>Across all cohorts</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" boxShadow="sm" borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Attendance Rate</StatLabel>
              <StatNumber color="green.500">
                {stats?.attendanceRate || 0}%
              </StatNumber>
              <StatHelpText>This month</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" boxShadow="sm" borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Pending Assessments</StatLabel>
              <StatNumber color="orange.500">
                {stats?.pendingAssessments || 0}
              </StatNumber>
              <StatHelpText>Need grading</StatHelpText>
            </Stat>
          </CardBody>
        </Card>

        <Card bg="white" boxShadow="sm" borderRadius="xl">
          <CardBody>
            <Stat>
              <StatLabel color="gray.600">Active Cohorts</StatLabel>
              <StatNumber color="blue.500">
                {stats?.activeCohorts || 0}
              </StatNumber>
              <StatHelpText>Currently assigned</StatHelpText>
            </Stat>
          </CardBody>
        </Card>
      </SimpleGrid>

      {/* Profile Update Alert */}
      <FacilitatorAlert />

      {/* Assignment Alert */}
      <AssignmentAlert />

      {/* Dashboard Menu */}
      <FacilitatorDashboardMenu />
    </VStack>
  )
}
