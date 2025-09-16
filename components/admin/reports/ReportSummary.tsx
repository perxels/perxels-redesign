import React from 'react'
import {
  Box,
  Grid,
  Card,
  CardBody,
  CardHeader,
  Heading,
  Stat,
  StatLabel,
  StatNumber,
  StatHelpText,
  StatArrow,
} from '@chakra-ui/react'

interface ReportSummaryProps {
  reportData: {
    totalSessions: number
    totalStudents: number
    totalCheckIns: number
    attendanceRate: number
  }
}

export function ReportSummary({ reportData }: ReportSummaryProps) {
  return (
    <Card bg="white" shadow="sm" borderRadius="lg">
      <CardHeader pb={4}>
        <Heading size="md" color="gray.700">📊 Summary Overview</Heading>
      </CardHeader>
      <CardBody pt={0}>
        <Grid templateColumns={{ base: '1fr', md: 'repeat(2, 1fr)', lg: 'repeat(4, 1fr)' }} gap={6}>
          <Box bg="blue.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="blue.400">
            <Stat>
              <StatLabel fontSize="sm" color="blue.600" fontWeight="medium">Total Sessions</StatLabel>
              <StatNumber fontSize="2xl" color="blue.700">{reportData.totalSessions}</StatNumber>
              <StatHelpText fontSize="xs" color="blue.500">
                Sessions in selected period
              </StatHelpText>
            </Stat>
          </Box>
          
          <Box bg="green.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="green.400">
            <Stat>
              <StatLabel fontSize="sm" color="green.600" fontWeight="medium">Total Students</StatLabel>
              <StatNumber fontSize="2xl" color="green.700">{reportData.totalStudents}</StatNumber>
              <StatHelpText fontSize="xs" color="green.500">
                Students enrolled
              </StatHelpText>
            </Stat>
          </Box>
          
          <Box bg="purple.50" p={4} borderRadius="lg" borderLeft="4px" borderColor="purple.400">
            <Stat>
              <StatLabel fontSize="sm" color="purple.600" fontWeight="medium">Total Check-ins</StatLabel>
              <StatNumber fontSize="2xl" color="purple.700">{reportData.totalCheckIns}</StatNumber>
              <StatHelpText fontSize="xs" color="purple.500">
                Successful check-ins
              </StatHelpText>
            </Stat>
          </Box>
          
          <Box bg={reportData.attendanceRate >= 80 ? "green.50" : reportData.attendanceRate >= 60 ? "yellow.50" : "red.50"} 
               p={4} borderRadius="lg" 
               borderLeft="4px" 
               borderColor={reportData.attendanceRate >= 80 ? "green.400" : reportData.attendanceRate >= 60 ? "yellow.400" : "red.400"}>
            <Stat>
              <StatLabel fontSize="sm" color={reportData.attendanceRate >= 80 ? "green.600" : reportData.attendanceRate >= 60 ? "yellow.600" : "red.600"} fontWeight="medium">
                Attendance Rate
              </StatLabel>
              <StatNumber fontSize="2xl" color={reportData.attendanceRate >= 80 ? "green.700" : reportData.attendanceRate >= 60 ? "yellow.700" : "red.700"}>
                {reportData.attendanceRate.toFixed(1)}%
              </StatNumber>
              <StatHelpText fontSize="xs" color={reportData.attendanceRate >= 80 ? "green.500" : reportData.attendanceRate >= 60 ? "yellow.500" : "red.500"}>
                <StatArrow type={reportData.attendanceRate >= 80 ? 'increase' : 'decrease'} />
                {reportData.attendanceRate >= 80 ? 'Excellent' : reportData.attendanceRate >= 60 ? 'Good' : 'Needs Improvement'}
              </StatHelpText>
            </Stat>
          </Box>
        </Grid>
      </CardBody>
    </Card>
  )
}
