import React from 'react'
import {
  Box,
  VStack,
  HStack,
  Text,
  Button,
  Select,
  FormControl,
  FormLabel,
  Input,
  Grid,
  Card,
  CardBody,
} from '@chakra-ui/react'
import { useActiveClasses } from '../../../hooks/useClasses'
import { classPlans } from '../../../constant/adminConstants'
import { ExportToDocButton } from '../../ExportToDocButton'

interface ReportFiltersProps {
  filters: {
    reportType: 'daily' | 'student' | 'session' | 'cohort'
  }
  onFiltersChange: (filters: any) => void
  onGenerateReport: () => void
  onExportCSV: () => void
  loading: boolean
  hasReportData: boolean
}

export function ReportFilters({
  filters,
  onFiltersChange,
  onGenerateReport,
  onExportCSV,
  loading,
  hasReportData,
}: ReportFiltersProps) {
  const today = new Date().toISOString().split('T')[0]

  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardBody p={6}>
        <VStack spacing={6} align="stretch">
          {/* Header with Actions */}
          <HStack justify="space-between" align="center" wrap="wrap" gap={4}>
            <VStack align="start" spacing={1}>
              <Text fontSize="xl" fontWeight="bold" color="gray.700">
                Attendance Reports
              </Text>
              <Text fontSize="sm" color="gray.500">
                Generate comprehensive attendance analytics and insights
              </Text>
            </VStack>

            <HStack spacing={3}>
              <Button
                colorScheme="blue"
                onClick={onGenerateReport}
                isLoading={loading}
                loadingText="Generating..."
                size="md"
                px={6}
              >
                Generate Report
              </Button>

              {hasReportData && (
                <Button
                  variant="outline"
                  onClick={onExportCSV}
                  leftIcon={<span>📥</span>}
                  size="md"
                  px={6}
                >
                  Export CSV
                </Button>
              )}
            </HStack>
          </HStack>

          {/* Report-Specific Filters */}
          <Box bg="gray.50" p={4} borderRadius="md">
            <Text fontSize="sm" fontWeight="medium" color="gray.600" mb={3}>
              Report Options
            </Text>

            <Grid
              templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)' }}
              gap={4}
            >
              {/* Report Type */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Report Type
                </FormLabel>
                <Select
                  value={filters.reportType}
                  onChange={(e) =>
                    onFiltersChange({
                      ...filters,
                      reportType: e.target.value as any,
                    })
                  }
                  bg="white"
                  size="sm"
                >
                  <option value="daily">📊 Daily Summary</option>
                  <option value="student">👥 Student History</option>
                  <option value="session">📅 Session Details</option>
                  <option value="cohort">🏆 Cohort Performance</option>
                </Select>
              </FormControl>

              {/* Quick Actions */}
              <FormControl>
                <FormLabel fontSize="sm" fontWeight="medium">
                  Quick Actions
                </FormLabel>
                <HStack spacing={2}>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        dateRange: {
                          start: new Date(Date.now() - 7 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                          end: today,
                        },
                      })
                    }
                  >
                    Last 7 Days
                  </Button>
                  <Button
                    size="sm"
                    variant="outline"
                    onClick={() =>
                      onFiltersChange({
                        ...filters,
                        dateRange: {
                          start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
                            .toISOString()
                            .split('T')[0],
                          end: today,
                        },
                      })
                    }
                  >
                    Last 30 Days
                  </Button>
                </HStack>
              </FormControl>
            </Grid>
          </Box>
        </VStack>
      </CardBody>
    </Card>
  )
}
