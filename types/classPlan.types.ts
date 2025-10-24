// types/classPlan.types.ts

// This should be a union type of all the class plan keys
export type ClassPlanType =
  | 'lagos-lekki-weekdays'
  | 'lagos-lekki-weekend'
  | 'abuja-physical'
  | 'premium-online'
  | 'lagos-yaba-weekend'
  | 'lagos-yaba-weekday'
  | 'ibadan-weekday'
  | 'ibadan-weekend'
  | 'international'

// Interface for the schedule configuration
export interface ClassSchedule {
  sessionDays: string[] // e.g., ['wednesday', 'friday']
  sessionTime: string // e.g., '10:00'
  timezone: string // e.g., 'Africa/Lagos'
}

// Interface for the complete class plan configuration
export interface ClassPlanConfig {
  name: string
  location: string
  defaultSchedule: ClassSchedule
}

// Type for the CLASS_PLAN_CONFIGS object
export type ClassPlanConfigs = Record<ClassPlanType, ClassPlanConfig>
