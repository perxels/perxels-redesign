import React from 'react'
import {
  Box,
  HStack,
  Text,
  Select,
  VStack,
} from '@chakra-ui/react'
import { CustomDatePicker } from '../../components'
import { AttendanceFilters } from '../../types/attendance-v2.types'
import { format } from 'date-fns'

interface AttendanceFiltersProps {
  filters: AttendanceFilters
  onFiltersChange: (filters: AttendanceFilters) => void
  classes: Array<{ cohortName: string }>
  classesLoading: boolean
}

export function AttendanceFiltersComponent({ 
  filters, 
  onFiltersChange, 
  classes, 
  classesLoading 
}: AttendanceFiltersProps) {
  return (
    <Box bg="white" p={4} borderRadius="lg" boxShadow="sm" mb={6}>
      <HStack spacing={4} wrap="wrap">
        <Box minW="200px">
          <Text fontSize="sm" fontWeight="medium" mb={2}>Date Range</Text>
          <CustomDatePicker
            name="dateRange"
            value={filters.dateRange?.start ? new Date(filters.dateRange.start) : null}
            onChange={(date) => onFiltersChange({
              ...filters,
              dateRange: date ? {
                start: format(date, 'yyyy-MM-dd'),
                end: filters.dateRange?.end || format(date, 'yyyy-MM-dd')
              } : undefined
            })}
            width="100%"
            placeholder="Start date"
          />
        </Box>
        
        <Box minW="200px">
          <Text fontSize="sm" fontWeight="medium" mb={2}>End Date</Text>
          <CustomDatePicker
            name="endDate"
            value={filters.dateRange?.end ? new Date(filters.dateRange.end) : null}
            onChange={(date) => onFiltersChange({
              ...filters,
              dateRange: filters.dateRange ? {
                ...filters.dateRange,
                end: date ? format(date, 'yyyy-MM-dd') : filters.dateRange.start
              } : undefined
            })}
            width="100%"
            placeholder="End date"
          />
        </Box>

        <Box minW="200px">
          <Text fontSize="sm" fontWeight="medium" mb={2}>Cohort</Text>
          <Select
            placeholder="All cohorts"
            value={filters.cohortId || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              cohortId: e.target.value || undefined
            })}
          >
            {classes.map(cls => (
              <option key={cls.cohortName} value={cls.cohortName}>
                {cls.cohortName}
              </option>
            ))}
          </Select>
        </Box>

        <Box minW="200px">
          <Text fontSize="sm" fontWeight="medium" mb={2}>Status</Text>
          <Select
            placeholder="All statuses"
            value={filters.status || ''}
            onChange={(e) => onFiltersChange({
              ...filters,
              status: e.target.value as any || undefined
            })}
          >
            <option value="active">Active</option>
            <option value="expired">Expired</option>
            <option value="all">All</option>
          </Select>
        </Box>
      </HStack>
    </Box>
  )
}
