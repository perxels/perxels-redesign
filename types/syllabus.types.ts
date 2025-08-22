export interface SyllabusDay {
  id: string
  dayNumber: number
  title: string
  content: string
  assignments?: string[]
  resources?: string[]
  duration?: string // e.g., "2 hours", "3 hours"
  isOnline?: boolean
  isPhysical?: boolean
  order: number
  scheduledDate?: Date // When this day will be taught
  isCompleted?: boolean // Whether this day has been completed
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

export interface ClassSyllabus {
  id: string
  classId: string
  syllabusId: string
  syllabus: Syllabus
  startDate: Date
  endDate: Date
  currentWeek?: number
  currentDay?: number
  scheduledDays: {
    [dayId: string]: {
      scheduledDate: Date
      isCompleted: boolean
      notes?: string
    }
  }
  progress: {
    completedWeeks: number[]
    completedDays: string[]
    totalProgress: number // percentage
  }
  createdAt: Date
  updatedAt: Date
}

export interface CreateSyllabusFormData {
  name: string
  description: string
  weeks: {
    weekNumber: number
    title: string
    order: number
    days: Omit<SyllabusDay, 'id'>[]
  }[]
}

export interface UpdateSyllabusFormData {
  name?: string
  description?: string
  weeks?: {
    weekNumber: number
    title: string
    order: number
    days: Omit<SyllabusDay, 'id'>[]
  }[]
  isActive?: boolean
}
