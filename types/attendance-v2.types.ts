export interface DailyCode {
  code: string
  date: string // YYYY-MM-DD format
  createdBy: string
  createdAt: Date
  status: 'active' | 'expired'
  expiresAt?: Date
}

export interface Session {
  sessionId: string
  dailyCodeId: string // Reference to dailyCodes/{date}
  cohortId: string
  planId: string
  date: string // YYYY-MM-DD format
  startsAt: Date
  endsAt: Date
  status: 'scheduled' | 'open' | 'closed' | 'cancelled'
  createdBy: string
  createdAt: Date
}

export interface SessionCheckin {
  studentId: string
  checkedIn: boolean
  checkInTime: Date | null
}

export interface AttendanceSummary {
  sessionId: string
  cohortId: string
  planId: string
  date: string
  totalStudents: number
  presentCount: number
  absentCount: number
  attendanceRate: number
}

// Admin dashboard filters
export interface AttendanceFilters {
  dateRange?: {
    start: string
    end: string
  }
  cohortId?: string
  planId?: string
  status?: 'active' | 'expired' | 'all'
}

// Bulk operations
export interface BulkOperation {
  type: 'delete' | 'expire' | 'export'
  items: string[] // IDs of daily codes or sessions
}
