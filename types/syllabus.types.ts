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

export interface ClassPlanSyllabus {
  id: string
  classId: string
  cohortName: string
  classPlan: string
  baseSyllabusId: string // Reference to the template syllabus
  syllabus: Syllabus // Customized syllabus for this class plan
  startDate: Date
  endDate: Date
  scheduledDays: Record<string, ScheduledDay>
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
}

export interface CreateClassPlanSyllabusData {
  classId: string
  cohortName: string
  classPlan: string
  baseSyllabusId: string
  startDate: Date
  endDate: Date
}

export interface UpdateClassPlanSyllabusData {
  syllabus?: Partial<Syllabus>
  scheduledDays?: Record<string, ScheduledDay>
  isActive?: boolean
}

export interface ClassPlanSyllabus {
  id: string
  classId: string
  cohortName: string
  classPlan: string // e.g., 'lagos-lekki-weekdays', 'ibadan-weekend'
  baseSyllabusId: string // Reference to the template
  syllabus: Syllabus // Customized copy for this class plan
  startDate: Date
  endDate: Date
  scheduledDays: Record<string, ScheduledDay> // Use the interface here
  createdAt: Date
  updatedAt: Date
  createdBy: string
  isActive: boolean
}

export interface ClassPlanType {
  id: string
  name: string
  location: string
  sessionDays: string[] // ['wednesday', 'friday'] etc.
  sessionTime: string
  timezone: string
}

export interface ScheduledDay {
  scheduledDate: Date
  isCompleted: boolean
  notes?: string
}
