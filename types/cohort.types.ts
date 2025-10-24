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

export interface ClassPlan {
  id: string
  name: string
  schedulePattern: {
    daysOfWeek: number[] // 0=Sunday, 1=Monday, etc.
    frequency: 'weekly' | 'bi-weekly'
    sessionDuration: string
  }
  syllabus: Syllabus
  customizations?: {
    modifiedDays: string[]
    customSchedule: Record<string, any>
  }
}

export interface Cohort {
  id: string
  cohortName: string
  startDate: Date
  endDate: Date
  syllabusTemplateId: string
  classPlans: ClassPlan[]
  status: 'active' | 'inactive' | 'completed'
  createdAt: Date
  updatedAt: Date
  createdBy: string
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
