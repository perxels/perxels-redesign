export interface Attendance {
  attendanceId: string
  date: string // ISO date string
  code: string
  classId: string
  createdAt: Date
}

export interface Checkin {
  studentId: string
  checkedIn: boolean
  checkInTime: Date | null
} 