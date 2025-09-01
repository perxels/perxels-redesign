import {
  HStack,
  Spinner,
  Alert,
  AlertIcon,
  Button,
  Flex,
  Text,
  Box,
} from '@chakra-ui/react'
import React, { useEffect, useState, useCallback } from 'react'
import { StatsCard } from '../../dashboard/school-fees/stats-card'
import {
  collection,
  getDocs,
  query,
  orderBy,
  where,
  limit,
} from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'
import { useClasses } from '../../../../hooks/useClasses'

export interface SchoolFeesFilterState {
  branch: string
  classType: string
  classPlan: string
}

interface Stats {
  totalSchoolFees: number
  totalOwing: number
  totalApproved: number
}

interface SchoolFeesStatsProps {
  filters: SchoolFeesFilterState
}

export const SchoolFeesStats = ({ filters }: SchoolFeesStatsProps) => {
  const [stats, setStats] = useState<Stats | null>(null)
  const [loading, setLoading] = useState(false)
  const [error, setError] = useState<string | null>(null)
  const [isRefreshing, setIsRefreshing] = useState(false)
  
  // Get classes for classType filtering
  const { classes } = useClasses({ status: 'active' })

  const fetchStats = useCallback(
    async (isRefresh = false) => {
      if (isRefresh) {
        setIsRefreshing(true)
      } else {
        setLoading(true)
      }
      setError(null)

      try {
        // Build optimized query with filters at database level
        let usersQuery = query(
          collection(portalDb, 'users'),
          orderBy('fullName'),
        )

        // Add branch filter to reduce data transfer
        if (filters.branch && filters.branch !== 'all') {
          // Handle special case for "Fully Online Class"
          if (filters.branch === 'Fully Online Class') {
            usersQuery = query(usersQuery, where('branch', '==', 'Fully Online Class'))
          } else {
            usersQuery = query(usersQuery, where('branch', '==', filters.branch))
          }
        }

        // Add class plan filter if specified
        if (filters.classPlan) {
          usersQuery = query(
            usersQuery,
            where('schoolFeeInfo.classPlan', '==', filters.classPlan),
          )
        }

        const snapshot = await getDocs(usersQuery)

        let totalSchoolFees = 0
        let totalOwing = 0
        let totalApproved = 0
        let studentCount = 0

        // Get valid class names for filtering
        const validClassNames = classes.map(c => c.cohortName)

        snapshot.forEach((doc) => {
          const data = doc.data()
          const fee = data.schoolFeeInfo

          if (!fee) return

          // Apply classType filter (cohort matching)
          if (filters.classType && filters.classType !== 'all') {
            const studentCohort = fee.cohort || ''
            if (studentCohort !== filters.classType) {
              return // Skip this student if cohort doesn't match
            }
          }

          const totalFee = fee.totalSchoolFee || 0
          const totalApprovedAmount = fee.totalApproved || 0

          // Only count if there's actual fee data
          if (totalFee > 0) {
            totalSchoolFees += totalFee
            totalApproved += totalApprovedAmount

            if (totalApprovedAmount < totalFee) {
              totalOwing += totalFee - totalApprovedAmount
            }

            studentCount++
          }
        })

        setStats({
          totalSchoolFees,
          totalOwing,
          totalApproved,
        })
      } catch (e: any) {
        console.error('Error fetching stats:', e)
        setError(e.message || 'Failed to fetch stats')
        setStats(null)
      } finally {
        if (isRefreshing) {
          setIsRefreshing(false)
        } else {
          setLoading(false)
        }
      }
    },
    [filters, classes],
  )

  useEffect(() => {
    fetchStats()
  }, [fetchStats])

  function formatNaira(n: number) {
    return `₦${n.toLocaleString()}`
  }

  if (loading)
    return (
      <HStack>
        <Spinner />
      </HStack>
    )
  if (error)
    return (
      <Alert status="error">
        <AlertIcon />
        {error}
      </Alert>
    )
  if (!stats) return null

  // Get filter context for display
  const getFilterContext = () => {
    const contextParts = []
    if (filters.branch && filters.branch !== 'all') {
      contextParts.push(`Branch: ${filters.branch}`)
    }
    if (filters.classPlan) {
      contextParts.push(`Class Plan: ${filters.classPlan}`)
    }
    if (filters.classType && filters.classType !== 'all') {
      contextParts.push(`Class: ${filters.classType}`)
    }
    return contextParts.length > 0 ? contextParts.join(' • ') : 'All Students'
  }

  return (
    <Box mb={8}>
      {/* Header with filter context and refresh button */}
      <Flex justify="space-between" align="center" mb={6} wrap="wrap" gap={4}>
        <Box>
          <Text fontSize="xl" fontWeight="bold" color="gray.800">
            School Fees Overview
          </Text>
          <Text fontSize="sm" color="gray.600">
            {getFilterContext()}
            {loading && (
              <Text as="span" color="blue.500" ml={2}>
                • Calculating...
              </Text>
            )}
          </Text>
        </Box>

        <Button
          variant="outline"
          colorScheme="blue"
          size="sm"
          onClick={() => fetchStats(true)}
          isLoading={isRefreshing}
        >
          Refresh Stats
        </Button>
      </Flex>

      {/* Stats Cards */}
      <HStack spacing={6} flexWrap="wrap">
        <StatsCard
          title="Total School Fees"
          amount={formatNaira(stats.totalSchoolFees)}
          color="brand.purple.100"
          w={['100%', '350px']}
        />
        <StatsCard
          title="Total Approved"
          amount={formatNaira(stats.totalApproved)}
          color="brand.green.100"
          w={['100%', '350px']}
        />
        <StatsCard
          title="Total Owing"
          amount={formatNaira(stats.totalOwing)}
          color="brand.yellow.100"
          w={['100%', '350px']}
        />
      </HStack>
    </Box>
  )
}
