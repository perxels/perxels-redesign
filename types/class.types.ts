export interface SyllabusDay {
  id: string
  dayNumber: number
  title: string
  content: string
  assignments?: string[]
  resources?: string[]
  duration?: string
  isOnline?: boolean
  isPhysical?: boolean
  order: number
}

export interface SyllabusWeek {
  id: string
  weekNumber: number
  title: string
  days: SyllabusDay[]
  order: number
}

export interface Syllabus {
  id: string
  name: string
  description: string
  totalWeeks: number
  totalDays: number
  weeks: SyllabusWeek[]
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
  version: string
}

// Enhanced ClassData interface - adding class plan support
export interface ClassData {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  createdBy: string
  createdAt: any
  status: 'active' | 'inactive' | 'completed'
  studentsCount: number
  branch?: string
  paymentStatus?: 'pending' | 'partial' | 'completed' | 'overdue'
  syllabusId?: string

  // New fields for enhanced functionality
  classPlan?: string // e.g., "Lagos Lekki Weekdays Physical Class"
  schedulePattern?: {
    daysOfWeek: number[]
    frequency: 'weekly' | 'bi-weekly'
    sessionDuration: string
  }
  isCohortClass?: boolean // Flag to identify if this is part of a cohort
  parentCohortId?: string // Reference to parent cohort if this is a class plan
  customizations?: {
    modifiedDays: string[]
    customSchedule: Record<string, any>
  }
}

export interface SyllabusTemplate {
  id: string
  name: string
  description: string
  totalWeeks: number
  totalDays: number
  classPattern: {
    sessionsPerWeek: number
    recommendedDays: number[]
    totalSessions: number
  }
  weeks: SyllabusWeek[]
  isActive: boolean
  version: string
}
