import { CLASS_PLAN_CONFIGS } from '../constant/classPlans'
import { Syllabus, ScheduledDay } from '../types/syllabus.types'

interface ScheduleConfig {
  startDate: Date
  syllabus: Syllabus
  classPlan: string
  includeWeekends?: boolean
}

export const calculateClassSchedule = ({
  startDate,
  syllabus,
  classPlan,
  includeWeekends = false,
}: ScheduleConfig): Record<string, ScheduledDay> => {
  const scheduledDays: Record<string, ScheduledDay> = {}
  const config =
    CLASS_PLAN_CONFIGS[classPlan as keyof typeof CLASS_PLAN_CONFIGS]

  if (!config) {
    console.warn(`No configuration found for class plan: ${classPlan}`)
    return scheduledDays
  }

  const { sessionDays, sessionTime, timezone } = config.defaultSchedule
  let currentDate = new Date(startDate)

  // Convert session days to numbers (0 = Sunday, 1 = Monday, etc.)
  const sessionDayNumbers = sessionDays.map((day: any) => {
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

  // Schedule each day in the syllabus
  syllabus.weeks.forEach((week) => {
    week.days.forEach((day) => {
      // Find the next available session day
      let scheduledDate = findNextSessionDay(
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
  const maxAttempts = 14 // Prevent infinite loop

  while (attempts < maxAttempts) {
    const dayOfWeek = currentDate.getDay()

    if (sessionDays.includes(dayOfWeek)) {
      return currentDate
    }

    currentDate.setDate(currentDate.getDate() + 1)
    attempts++
  }

  // Fallback: return the original date if no session day found
  console.warn('Could not find valid session day, using fallback')
  return new Date(startDate)
}

export const calculateEndDate = (
  startDate: Date,
  syllabus: Syllabus,
  classPlan: string,
): Date => {
  const config =
    CLASS_PLAN_CONFIGS[classPlan as keyof typeof CLASS_PLAN_CONFIGS]

  if (!config) {
    // Fallback calculation
    return calculateEndDateForAllPlans(startDate, syllabus)
  }

  const totalDays = syllabus.totalDays
  const sessionsPerWeek = config.defaultSchedule.sessionDays.length
  const estimatedWeeks = Math.ceil(totalDays / sessionsPerWeek)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + estimatedWeeks * 7)

  return endDate
}

export const calculateEndDateForAllPlans = (
  startDate: Date,
  syllabus: Syllabus,
): Date => {
  // Conservative estimate: 2 sessions per week
  const sessionsPerWeek = 2
  const totalWeeks = Math.ceil(syllabus.totalDays / sessionsPerWeek)

  const endDate = new Date(startDate)
  endDate.setDate(endDate.getDate() + totalWeeks * 7)

  return endDate
}
