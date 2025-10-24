import { ClassPlanType, ClassSchedule } from '../types/classPlan.types'

export const CLASS_PLAN_CONFIGS: Record<
  ClassPlanType,
  { name: string; location: string; defaultSchedule: Partial<ClassSchedule> }
> = {
  'lagos-lekki-weekdays': {
    name: 'Lagos Lekki Weekdays Physical Class',
    location: 'Lagos Lekki',
    defaultSchedule: {
      sessionDays: ['wednesday', 'friday'],
      sessionTime: '10:00',
      timezone: 'Africa/Lagos',
    },
  },
  'lagos-lekki-weekend': {
    name: 'Lagos Lekki Weekend Physical Class',
    location: 'Lagos Lekki',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '09:00',
      timezone: 'Africa/Lagos',
    },
  },
  'abuja-physical': {
    name: 'Abuja Physical Class',
    location: 'Abuja',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '14:00',
      timezone: 'Africa/Lagos',
    },
  },
  'premium-online': {
    name: 'Premium Online Class',
    location: 'Online',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '18:00',
      timezone: 'Africa/Lagos',
    },
  },
  'lagos-yaba-weekend': {
    name: 'Lagos Yaba Weekend Class',
    location: 'Lagos Yaba',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '10:00',
      timezone: 'Africa/Lagos',
    },
  },
  'lagos-yaba-weekday': {
    name: 'Lagos Yaba Weekday Class',
    location: 'Lagos Yaba',
    defaultSchedule: {
      sessionDays: ['tuesday', 'thursday'],
      sessionTime: '16:00',
      timezone: 'Africa/Lagos',
    },
  },
  'ibadan-weekday': {
    name: 'Ibadan Weekday Physical Class',
    location: 'Ibadan',
    defaultSchedule: {
      sessionDays: ['wednesday', 'friday'],
      sessionTime: '15:00',
      timezone: 'Africa/Lagos',
    },
  },
  'ibadan-weekend': {
    name: 'Ibadan Weekend Physical Class',
    location: 'Ibadan',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '11:00',
      timezone: 'Africa/Lagos',
    },
  },
  international: {
    name: 'International Class',
    location: 'Online',
    defaultSchedule: {
      sessionDays: ['saturday', 'wednesday'],
      sessionTime: '14:00',
      timezone: 'UTC',
    },
  },
}

export const CLASS_PLAN_TYPES = Object.keys(
  CLASS_PLAN_CONFIGS,
) as ClassPlanType[]
