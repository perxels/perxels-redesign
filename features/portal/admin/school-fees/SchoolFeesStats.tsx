import { HStack, Spinner, Alert, AlertIcon } from '@chakra-ui/react'
import React, { useEffect, useState } from 'react'
import { StatsCard } from '../../dashboard/school-fees/stats-card'
import { collection, getDocs, query, orderBy } from 'firebase/firestore'
import { portalDb } from '../../../../portalFirebaseConfig'

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

  useEffect(() => {
    async function fetchStats() {
      setLoading(true)
      setError(null)
      try {
        const usersQuery = query(collection(portalDb, 'users'), orderBy('fullName'))
        const snapshot = await getDocs(usersQuery)
        let totalSchoolFees = 0
        let totalOwing = 0
        let totalApproved = 0
        snapshot.forEach(doc => {
          const data = doc.data()
          const fee = data.schoolFeeInfo
          if (!fee) return
          const totalFee = fee.totalSchoolFee || 0
          const totalApprovedAmount = fee.totalApproved || 0
          // Filtering logic (same as list)
          if (
            (!filters.branch || filters.branch === 'all' || (data.branch && data.branch.toLowerCase() === String(filters.branch).toLowerCase())) &&
            (!filters.classPlan || (fee.classPlan && fee.classPlan.toLowerCase() === String(filters.classPlan).toLowerCase()))
          ) {
            totalSchoolFees += totalFee
            totalApproved += totalApprovedAmount
            if (totalApprovedAmount < totalFee) {
              totalOwing += (totalFee - totalApprovedAmount)
            }
          }
        })
        setStats({ totalSchoolFees, totalOwing, totalApproved })
      } catch (e: any) {
        setError(e.message || 'Failed to fetch stats')
        setStats(null)
      } finally {
        setLoading(false)
      }
    }
    fetchStats()
  }, [filters])

  function formatNaira(n: number) {
    return `₦${n.toLocaleString()}`
  }

  if (loading) return <HStack><Spinner /></HStack>
  if (error) return <Alert status="error"><AlertIcon />{error}</Alert>
  if (!stats) return null

  return (
    <HStack mb={8} spacing={6} flexWrap="wrap">
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
  )
}
