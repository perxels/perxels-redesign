import React, { useState, useCallback, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {
  getSessionsByFilters,
  getAllSessions,
  getAllStudents,
  didStudentCheckInToSession,
} from '../../lib/utils/attendance-v2.utils'
import {
  ReportFilters,
  ReportSummary,
  DailySummaryReport,
  SessionDetailsReport,
  CohortPerformanceReport,
  StudentHistoryReport,
  LoadingState,
  EmptyState,
} from './reports'

interface ReportFilters {
  dateRange: { start: string; end: string }
  cohortId?: string
  planId?: string
  reportType: 'daily' | 'student' | 'session' | 'cohort'
}

interface AttendanceReportData {
  totalSessions: number
  totalStudents: number
  totalCheckIns: number
  attendanceRate: number
  sessions: any[]
  students: any[]
  dailySummary?: any[]
  sessionDetails?: any[]
  cohortPerformance?: any[]
}

interface AttendanceReportsProps {
  globalFilters: {
    dateRange?: { start: string; end: string }
    cohortId?: string
    planId?: string
  }
}

export function AttendanceReports({ globalFilters }: AttendanceReportsProps) {
  const [loading, setLoading] = useState(false)
  const [reportData, setReportData] = useState<AttendanceReportData | null>(
    null,
  )
  const [filters, setFilters] = useState<ReportFilters>({
    dateRange: globalFilters.dateRange || {
      start: new Date(Date.now() - 30 * 24 * 60 * 60 * 1000)
        .toISOString()
        .split('T')[0], // 30 days ago
      end: new Date().toISOString().split('T')[0], // today
    },
    cohortId: globalFilters.cohortId,
    planId: globalFilters.planId,
    reportType: 'daily',
  })

  const toast = useToast()

  // Sync with global filters changes
  useEffect(() => {
    setFilters(prev => ({
      ...prev,
      dateRange: globalFilters.dateRange || prev.dateRange,
      cohortId: globalFilters.cohortId,
      planId: globalFilters.planId,
    }))
  }, [globalFilters])

  // Generate report data
  const generateReport = useCallback(async () => {
    if (!filters.dateRange.start || !filters.dateRange.end) {
      toast({
        title: 'Date range required',
        description: 'Please select both start and end dates',
        status: 'warning',
        duration: 3000,
      })
      return
    }

    setLoading(true)
    try {
      let sessions: any[] = []
      let students: any[] = []
      let totalCheckIns = 0
      let totalStudents = 0
      let dailySummary: any[] = []
      let sessionDetails: any[] = []
      let cohortPerformance: any[] = []

      // Get sessions based on filters
      const sessionFilters: any = {
        dateRange: {
          start: filters.dateRange.start,
          end: filters.dateRange.end,
        },
      }

      if (filters.cohortId) sessionFilters.cohortId = filters.cohortId
      if (filters.planId) sessionFilters.planId = filters.planId

      // Get all sessions and students
      const allSessions = await getAllSessions()
      sessions = await getSessionsByFilters(sessionFilters)
      const allStudents = await getAllStudents()

      // Process sessions and students
      const studentMap = new Map()
      const cohortMap = new Map()

      for (const session of sessions) {
        const sessionStudents = allStudents.filter(
          (student) =>
            student.schoolFeeInfo?.cohort === session.cohortId &&
            student.schoolFeeInfo?.classPlan === session.planId,
        )

        // Initialize cohort data
        if (!cohortMap.has(session.cohortId)) {
          cohortMap.set(session.cohortId, {
            cohortId: session.cohortId,
            planId: session.planId,
            totalSessions: 0,
            totalStudents: sessionStudents.length,
            totalCheckIns: 0,
            sessions: [],
          })
        }

        const cohortData = cohortMap.get(session.cohortId)
        cohortData.totalSessions++
        cohortData.sessions.push(session)

        for (const student of sessionStudents) {
          if (!studentMap.has(student.id)) {
            studentMap.set(student.id, {
              ...student,
              sessions: [],
              checkIns: 0,
              totalSessions: 0,
            })
          }

          const studentData = studentMap.get(student.id)
          studentData.totalSessions++

          // Check if student checked in
          const checkinData = await didStudentCheckInToSession(
            session.sessionId,
            student.id,
          )
          if (checkinData?.checkedIn) {
            studentData.checkIns++
            totalCheckIns++
            cohortData.totalCheckIns++
          }

          studentData.sessions.push({
            sessionId: session.sessionId,
            date: session.date,
            checkedIn: checkinData?.checkedIn || false,
            checkInTime: checkinData?.checkInTime,
            cohortId: session.cohortId,
            planId: session.planId,
          })
        }
      }

      students = Array.from(studentMap.values())
      totalStudents = students.length

      // Generate report-specific data based on report type
      if (filters.reportType === 'daily') {
        const dateMap = new Map()
        sessions.forEach((session) => {
          if (!dateMap.has(session.date)) {
            dateMap.set(session.date, {
              date: session.date,
              sessions: [],
              totalStudents: 0,
              totalCheckIns: 0,
            })
          }
          const dateData = dateMap.get(session.date)
          dateData.sessions.push(session)
          dateData.totalStudents += students.length
          dateData.totalCheckIns += students.filter((s) =>
            s.sessions.some(
              (sess: any) => sess.date === session.date && sess.checkedIn,
            ),
          ).length
        })
        dailySummary = Array.from(dateMap.values())
      }

      if (filters.reportType === 'session') {
        sessionDetails = sessions.map((session) => {
          const sessionStudents = students.filter((s) =>
            s.sessions.some(
              (sess: any) => sess.sessionId === session.sessionId,
            ),
          )
          const checkedInStudents = sessionStudents.filter((s) =>
            s.sessions.some(
              (sess: any) =>
                sess.sessionId === session.sessionId && sess.checkedIn,
            ),
          )

          return {
            ...session,
            totalStudents: sessionStudents.length,
            checkedInStudents: checkedInStudents.length,
            attendanceRate:
              sessionStudents.length > 0
                ? (checkedInStudents.length / sessionStudents.length) * 100
                : 0,
            students: sessionStudents.map((s) => ({
              ...s,
              checkedIn:
                s.sessions.find(
                  (sess: any) => sess.sessionId === session.sessionId,
                )?.checkedIn || false,
              checkInTime: s.sessions.find(
                (sess: any) => sess.sessionId === session.sessionId,
              )?.checkInTime,
            })),
          }
        })
      }

      if (filters.reportType === 'cohort') {
        cohortPerformance = Array.from(cohortMap.values()).map((cohort) => ({
          ...cohort,
          attendanceRate:
            cohort.totalStudents > 0
              ? (cohort.totalCheckIns /
                  (cohort.totalStudents * cohort.totalSessions)) *
                100
              : 0,
        }))
      }

      const attendanceRate =
        totalStudents > 0
          ? (totalCheckIns / (totalStudents * sessions.length)) * 100
          : 0

      setReportData({
        totalSessions: sessions.length,
        totalStudents,
        totalCheckIns,
        attendanceRate,
        sessions,
        students,
        dailySummary,
        sessionDetails,
        cohortPerformance,
      })

      toast({
        title: 'Report generated successfully!',
        description: `Found ${sessions.length} sessions and ${totalStudents} students`,
        status: 'success',
        duration: 3000,
      })
    } catch (error) {
      console.error('Error generating report:', error)
      toast({
        title: 'Error generating report',
        description: 'Failed to generate attendance report. Please try again.',
        status: 'error',
        duration: 3000,
      })
    } finally {
      setLoading(false)
    }
  }, [filters, toast])

  // Export to CSV
  const exportToCSV = useCallback(() => {
    if (!reportData) return

    let csvContent =
      'Student ID,Student Name,Total Sessions,Check-ins,Attendance Rate\n'
    reportData.students.forEach((student) => {
      const attendanceRate =
        student.totalSessions > 0
          ? (student.checkIns / student.totalSessions) * 100
          : 0
      csvContent += `${student.id},${student.fullName || student.email},${
        student.totalSessions
      },${student.checkIns},${attendanceRate.toFixed(1)}%\n`
    })

    const blob = new Blob([csvContent], { type: 'text/csv' })
    const url = window.URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `attendance-report-${filters.dateRange.start}-to-${filters.dateRange.end}.csv`
    document.body.appendChild(a)
    a.click()
    document.body.removeChild(a)
    window.URL.revokeObjectURL(url)

    toast({
      title: 'Report exported successfully!',
      description: 'CSV file has been downloaded',
      status: 'success',
      duration: 3000,
    })
  }, [reportData, filters, toast])

  return (
    <VStack spacing={6} align="stretch">
      <ReportFilters
        filters={{ reportType: filters.reportType }}
        onFiltersChange={(newFilters) => setFilters(prev => ({ ...prev, ...newFilters }))}
        onGenerateReport={generateReport}
        onExportCSV={exportToCSV}
        loading={loading}
        hasReportData={!!reportData}
      />

      {loading && <LoadingState />}

      {reportData && !loading && (
        <VStack spacing={6} align="stretch">
          <ReportSummary reportData={reportData} />

          {filters.reportType === 'daily' && reportData.dailySummary && (
            <DailySummaryReport dailySummary={reportData.dailySummary} />
          )}

          {filters.reportType === 'session' && reportData.sessionDetails && (
            <SessionDetailsReport sessionDetails={reportData.sessionDetails} />
          )}

          {filters.reportType === 'cohort' && reportData.cohortPerformance && (
            <CohortPerformanceReport
              cohortPerformance={reportData.cohortPerformance}
            />
          )}

          {filters.reportType === 'student' && (
            <StudentHistoryReport students={reportData.students} />
          )}
        </VStack>
      )}

      {!reportData && !loading && (
        <EmptyState onGenerateReport={generateReport} />
      )}
    </VStack>
  )
}
