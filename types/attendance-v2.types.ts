export interface DailyCode {
  code: string
  date: string // YYYY-MM-DD format
  createdBy: string
  createdAt: Date
  status: 'active' | 'expired'
  expiresAt?: Date
}

// Old Interface
// export interface Session {
//   sessionId: string
//   dailyCodeId: string // Reference to dailyCodes/{date}
//   cohortId: string
//   planId: string
//   date: string // YYYY-MM-DD format
//   startsAt: Date
//   endsAt: Date
//   status: 'scheduled' | 'open' | 'closed' | 'cancelled'
//   createdBy: string
//   createdAt: Date
// }

// types/attendance-v2.types.ts - UPDATE INTERFACES
export interface Session {
  sessionId: string
  dailyCodeId: string
  cohortId: string
  planId: string
  date: string // YYYY-MM-DD format
  startsAt: string | Date // Store as ISO string, parse as Date
  endsAt: string | Date // Store as ISO string, parse as Date
  status: 'scheduled' | 'open' | 'closed' | 'cancelled'
  createdBy: string
  createdAt: string | Date // Store as ISO string
}

// Helper type for creating sessions
export type SessionCreateData = Omit<Session, 'sessionId' | 'createdAt'> & {
  startsAt: Date
  endsAt: Date
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
