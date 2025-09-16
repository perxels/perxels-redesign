import { useState, useEffect, useCallback } from 'react'
import { useToast } from '@chakra-ui/react'
import {
  getAllDailyCodes,
  getSessionsByFilters,
  deleteDailyCode,
  deleteMultipleSessions,
  expireDailyCode,
} from '../lib/utils/attendance-v2.utils'
import { DailyCode, Session, AttendanceFilters } from '../types/attendance-v2.types'

export function useAttendanceData(filters: AttendanceFilters) {
  const [dailyCodes, setDailyCodes] = useState<DailyCode[]>([])
  const [sessions, setSessions] = useState<Session[]>([])
  const [loading, setLoading] = useState(true)
  const toast = useToast()

  const fetchData = useCallback(async () => {
    setLoading(true)
    try {
      const [codesData, sessionsData] = await Promise.all([
        getAllDailyCodes(filters),
        getSessionsByFilters(filters)
      ])
      setDailyCodes(codesData)
      setSessions(sessionsData)
    } catch (error) {
      console.error('Error fetching data:', error)
      toast({
        title: 'Error loading data',
        description: 'Failed to fetch attendance data',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  useEffect(() => {
    fetchData()
  }, [fetchData])

  return { dailyCodes, sessions, loading, refetch: fetchData }
}

export function useBulkOperations(activeTab: number, selectedItems: string[], onSuccess: () => void) {
  const toast = useToast()

  const handleBulkDelete = useCallback(async () => {
    if (selectedItems.length === 0) return
    
    try {
      if (activeTab === 0) {
        // Delete daily codes
        await Promise.all(selectedItems.map(date => deleteDailyCode(date)))
        toast({
          title: 'Daily codes deleted',
          description: `Deleted ${selectedItems.length} daily code(s)`,
          status: 'success',
          duration: 3000,
        })
      } else {
        // Delete sessions
        await deleteMultipleSessions(selectedItems)
        toast({
          title: 'Sessions deleted',
          description: `Deleted ${selectedItems.length} session(s)`,
          status: 'success',
          duration: 3000,
        })
      }
      
      onSuccess()
    } catch (error) {
      toast({
        title: 'Error deleting items',
        description: 'Failed to delete selected items',
        status: 'error',
        duration: 3000,
      })
    }
  }, [activeTab, selectedItems, onSuccess, toast])

  const handleBulkExpire = useCallback(async () => {
    if (selectedItems.length === 0) return
    
    try {
      await Promise.all(selectedItems.map(date => expireDailyCode(date)))
      toast({
        title: 'Daily codes expired',
        description: `Expired ${selectedItems.length} daily code(s)`,
        status: 'success',
        duration: 3000,
      })
      
      onSuccess()
    } catch (error) {
      toast({
        title: 'Error expiring codes',
        description: 'Failed to expire selected codes',
        status: 'error',
        duration: 3000,
      })
    }
  }, [selectedItems, onSuccess, toast])

  return { handleBulkDelete, handleBulkExpire }
}
