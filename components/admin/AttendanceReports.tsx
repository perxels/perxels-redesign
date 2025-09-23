import React, { useState, useCallback, useEffect } from 'react'
import { VStack } from '@chakra-ui/react'
import { useToast } from '@chakra-ui/react'
import {
  getSessionsByFilters,
  getStudentsByCohortsAndPlans,
  getSessionCheckins,
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

interface Checkin {
  checkedIn: boolean
  studentId: string
  checkInTime?: string
}

interface ReportFilters {
  dateRange: { start: string; end: string }
  cohortId?: string
  planId?: string
  reportType: 'daily' | 'student' | 'session' | 'cohort'
}

interface Student {
  id: string
  fullName?: string
  email: string
  schoolFeeInfo?: {
    cohort?: string
    classPlan?: string
  }
  totalSessions?: number
  checkIns?: number
  sessions?: any[]
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
    setFilters((prev) => ({
      ...prev,
      dateRange: globalFilters.dateRange || prev.dateRange,
      cohortId: globalFilters.cohortId,
      planId: globalFilters.planId,
    }))
  }, [globalFilters])

  // Generate report data
  const generateReport = useCallback(async () => {
    if (!filters.dateRange?.start || !filters.dateRange?.end) {
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
      // 1. Get filtered sessions
      const sessionFilters: any = {
        dateRange: {
          start: filters.dateRange.start,
          end: filters.dateRange.end,
        },
      }

      if (filters.cohortId) sessionFilters.cohortId = filters.cohortId
      if (filters.planId) sessionFilters.planId = filters.planId

      const sessions = await getSessionsByFilters(sessionFilters)

      if (sessions.length === 0) {
        setReportData({
          totalSessions: 0,
          totalStudents: 0,
          totalCheckIns: 0,
          attendanceRate: 0,
          sessions: [],
          students: [],
          dailySummary: [],
          sessionDetails: [],
          cohortPerformance: [],
        })
        toast({
          title: 'No data found',
          description: 'No sessions match your filters',
          status: 'info',
          duration: 3000,
        })
        return
      }

      // 2. Get ALL checkins for these sessions in parallel (CRITICAL FIX)
      const sessionCheckins = await Promise.all(
        sessions.map((session) => getSessionCheckins(session.sessionId)),
      )

      // Create a map for quick lookup: sessionId -> checkins[]
      const checkinsMap = new Map<string, any[]>()
      sessions.forEach((session, index) => {
        checkinsMap.set(session.sessionId, sessionCheckins[index])
      })

      // 3. Get unique cohort-plan combinations to find relevant students
      // const cohortPlanSet = new Set()
      const cohortPlanSet = new Set<string>()
      sessions.forEach((session) => {
        cohortPlanSet.add(`${session.cohortId}-${session.planId}`)
      })

      // 4. Get students only for relevant cohorts/plans (not all students!)

      const cohortPlanArray = Array.from<string>(cohortPlanSet).map((combo) => {
        const [cohortId, planId] = combo.split('-')
        return { cohortId, planId }
      })

      const students = (await getStudentsByCohortsAndPlans(
        cohortPlanArray,
      )) as Student[]

      // 5. Create student map for efficient lookup
      const studentMap = new Map<string, any>()
      students.forEach((student) => {
        studentMap.set(student.id, {
          ...student,
          sessions: [],
          checkIns: 0,
          totalSessions: 0,
        })
      })

      // 6. Create cohort map for cohort performance data
      const cohortMap = new Map<string, any>()

      // 7. Process each session efficiently
      let totalCheckIns = 0

      for (const session of sessions) {
        const sessionCheckins = checkinsMap.get(session.sessionId) || []
        const checkedInStudentIds = new Set(
          sessionCheckins
            .filter((c: any) => c.checkedIn)
            .map((c: any) => c.studentId),
        )

        // Initialize cohort data if needed
        const cohortKey = `${session.cohortId}-${session.planId}`
        if (!cohortMap.has(cohortKey)) {
          cohortMap.set(cohortKey, {
            cohortId: session.cohortId,
            planId: session.planId,
            totalSessions: 0,
            totalStudents: 0,
            totalCheckIns: 0,
            sessions: [],
          })
        }

        const cohortData = cohortMap.get(cohortKey)
        if (!cohortData) continue
        cohortData.totalSessions++
        cohortData.sessions.push(session)

        // Process each student for this session
        for (const student of students) {
          // Only process students who belong to this session's cohort and plan
          if (
            student.schoolFeeInfo?.cohort === session.cohortId &&
            student.schoolFeeInfo?.classPlan === session.planId
          ) {
            // const studentData = studentMap.get(student.id)
            // studentData.totalSessions++
            const studentData = studentMap.get(student.id)
            if (!studentData) continue
            studentData.totalSessions++

            const isCheckedIn = checkedInStudentIds.has(student.id)
            if (isCheckedIn) {
              studentData.checkIns++
              totalCheckIns++
              cohortData.totalCheckIns++
            }

            studentData.sessions.push({
              sessionId: session.sessionId,
              date: session.date,
              checkedIn: isCheckedIn,
              checkInTime: sessionCheckins.find(
                (c: any) => c.studentId === student.id && c.checkedIn,
              )?.checkInTime,
              cohortId: session.cohortId,
              planId: session.planId,
            })
          }
        }
      }

      // Update cohort total students count
      cohortMap.forEach((cohortData: any) => {
        cohortData.totalStudents = students.filter(
          (s) =>
            s.schoolFeeInfo?.cohort === cohortData.cohortId &&
            s.schoolFeeInfo?.classPlan === cohortData.planId,
        ).length
      })

      const studentArray = Array.from(studentMap.values())
      const totalStudents = studentArray.length

      // 8. Generate report-specific data
      let dailySummary: any[] = []
      let sessionDetails: any[] = []
      let cohortPerformance: any[] = []

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

          // Count unique students for this date across all sessions
          const dateStudents = new Set()
          let dateCheckIns = 0

          studentArray.forEach((student) => {
            const hasSessionOnDate = student.sessions.some(
              (s) => s.date === session.date,
            )
            if (hasSessionOnDate) {
              dateStudents.add(student.id)
              if (
                student.sessions.some(
                  (s) => s.date === session.date && s.checkedIn,
                )
              ) {
                dateCheckIns++
              }
            }
          })

          dateData.totalStudents = dateStudents.size
          dateData.totalCheckIns = dateCheckIns
        })

        dailySummary = Array.from(dateMap.values())
      }

      if (filters.reportType === 'session') {
        sessionDetails = sessions.map((session) => {
          const sessionCheckins = checkinsMap.get(session.sessionId) || []
          const sessionStudents = studentArray.filter((student) =>
            student.sessions.some((s) => s.sessionId === session.sessionId),
          )

          const checkedInStudents = sessionStudents.filter((student) =>
            student.sessions.some(
              (s) => s.sessionId === session.sessionId && s.checkedIn,
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
            students: sessionStudents.map((student) => ({
              ...student,
              checkedIn: student.sessions.some(
                (s) => s.sessionId === session.sessionId && s.checkedIn,
              ),
              checkInTime: student.sessions.find(
                (s) => s.sessionId === session.sessionId,
              )?.checkInTime,
            })),
          }
        })
      }

      if (filters.reportType === 'cohort') {
        cohortPerformance = Array.from(cohortMap.values()).map(
          (cohort: any) => ({
            ...cohort,
            attendanceRate:
              cohort.totalStudents > 0 && cohort.totalSessions > 0
                ? (cohort.totalCheckIns /
                    (cohort.totalStudents * cohort.totalSessions)) *
                  100
                : 0,
          }),
        )
      }

      const attendanceRate =
        totalStudents > 0 && sessions.length > 0
          ? (totalCheckIns / (totalStudents * sessions.length)) * 100
          : 0

      setReportData({
        totalSessions: sessions.length,
        totalStudents,
        totalCheckIns,
        attendanceRate,
        sessions,
        students: studentArray,
        dailySummary,
        sessionDetails,
        cohortPerformance,
      })

      toast({
        title: 'Report generated successfully!',
        description: `Processed ${sessions.length} sessions and ${totalStudents} students`,
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
        onFiltersChange={(newFilters) =>
          setFilters((prev) => ({ ...prev, ...newFilters }))
        }
        onGenerateReport={generateReport}
        onExportCSV={exportToCSV}
        loading={loading}
        hasReportData={!!reportData}
        reportData={reportData || []}
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
