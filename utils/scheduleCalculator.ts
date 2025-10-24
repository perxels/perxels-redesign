import { CLASS_PLAN_CONFIGS } from '../constant/classPlans'
import { Syllabus, ScheduledDay } from '../types/syllabus.types'

interface ScheduleConfig {
  startDate: Date
  syllabus: Syllabus
  classPlan: string
  includeWeekends?: boolean
}

// Type guard to validate class plan configuration
const isValidClassPlanConfig = (classPlan: string): boolean => {
  const config =
    CLASS_PLAN_CONFIGS[classPlan as keyof typeof CLASS_PLAN_CONFIGS]
  return !!config?.defaultSchedule?.sessionDays?.length
}

// Get validated configuration with fallbacks
const getValidatedConfig = (classPlan: string) => {
  const config =
    CLASS_PLAN_CONFIGS[classPlan as keyof typeof CLASS_PLAN_CONFIGS]

  if (!config?.defaultSchedule?.sessionDays?.length) {
    return null
  }

  return {
    ...config,
    defaultSchedule: {
      sessionDays: config.defaultSchedule.sessionDays,
      sessionTime: config.defaultSchedule.sessionTime || '09:00',
      timezone: config.defaultSchedule.timezone || 'UTC',
    },
  }
}

export const calculateClassSchedule = ({
  startDate,
  syllabus,
  classPlan,
  includeWeekends = false,
}: ScheduleConfig): Record<string, ScheduledDay> => {
  const scheduledDays: Record<string, ScheduledDay> = {}
  const config = getValidatedConfig(classPlan)

  if (!config) {
    console.warn(`No valid configuration found for class plan: ${classPlan}`)
    return scheduledDays
  }

  const { sessionDays, sessionTime, timezone } = config.defaultSchedule
  let currentDate = new Date(startDate)

  // Convert session days to numbers with validation
  const sessionDayNumbers = sessionDays
    .map((day: string) => {
      const dayMap: Record<string, number> = {
        sunday: 0,
        monday: 1,
        tuesday: 2,
        wednesday: 3,
        thursday: 4,
        friday: 5,
        saturday: 6,
      }
      return dayMap[day.toLowerCase()]
    })
    .filter((day) => day !== undefined)

  if (sessionDayNumbers.length === 0) {
    console.warn('No valid session days found after conversion')
    return scheduledDays
  }

  // Schedule each day in the syllabus
  syllabus.weeks.forEach((week) => {
    week.days.forEach((day) => {
      const scheduledDate = findNextSessionDay(
        currentDate,
        sessionDayNumbers,
        includeWeekends,
      )

      // Set the session time
      const [hours, minutes] = sessionTime.split(':').map(Number)
      scheduledDate.setHours(hours, minutes, 0, 0)

      scheduledDays[day.id] = {
        scheduledDate: new Date(scheduledDate),
        isCompleted: false,
        notes: `Scheduled for ${config.name}`,
      }

      // Move current date forward for next scheduling
      currentDate = new Date(scheduledDate)
      currentDate.setDate(currentDate.getDate() + 1)
    })
  })

  return scheduledDays
}

const findNextSessionDay = (
  startDate: Date,
  sessionDays: number[],
  includeWeekends: boolean,
): Date => {
  let currentDate = new Date(startDate)
  let attempts = 0
  const maxAttempts = 14

  while (attempts < maxAttempts) {
    const dayOfWeek = currentDate.getDay()

    if (sessionDays.includes(dayOfWeek)) {
      return currentDate
    }

    currentDate.setDate(currentDate.getDate() + 1)
    attempts++
  }

  console.warn('Could not find valid session day, using fallback')
  return new Date(startDate)
}

export const calculateEndDate = (
  startDate: Date,
  syllabus: Syllabus,
  classPlan: string,
): Date => {
  if (!isValidClassPlanConfig(classPlan)) {
    return calculateEndDateForAllPlans(startDate, syllabus)
  }

  const config =
    CLASS_PLAN_CONFIGS[classPlan as keyof typeof CLASS_PLAN_CONFIGS]
  const totalDays = syllabus.totalDays
  const sessionsPerWeek = config!.defaultSchedule!.sessionDays!.length
  const estimatedWeeks = Math.ceil(totalDays / sessionsPerWeek)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + estimatedWeeks * 7)

  return endDate
}

export const calculateEndDateForAllPlans = (
  startDate: Date,
  syllabus: Syllabus,
): Date => {
  const sessionsPerWeek = 2
  const totalWeeks = Math.ceil(syllabus.totalDays / sessionsPerWeek)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + totalWeeks * 7)

  return endDate
}
