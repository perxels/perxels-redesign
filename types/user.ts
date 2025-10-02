export type UserRole = 'student' | 'admin' | 'facilitator'

export interface User {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  address: string
  guardianName: string
  guardianPhone: string
  role: UserRole
  emailVerified: boolean
  createdAt: Date
  updatedAt?: Date
  assignedCohorts?: string[]
  assignedClassPlans?: string[]
  isActive?: boolean
}

export interface FacilitatorData {
  id: string
  uid: string
  email: string
  fullName: string
  phone: string
  role: string
  emailVerified: boolean
  registrationComplete?: boolean
  createdAt: any
  createdBy: string
  profession?: string
  termsAgreed?: boolean
  termsAgreedAt?: any
  gender?: string
  pictureUrl?: string
  address?: string
  assignments: Assignment[]
  isActive: boolean
}

export interface Assignment {
  assignmentId: string
  cohort: string
  classPlan: string
  assignedAt: Date | any
  assignedBy: string
  assignedByName: string
  updatedAt?: any
}
export interface StudentData {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: string
  emailVerified: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  createdAt: any
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  gender?: string
  occupation?: string
  owingStatus?: string
  address?: string
  guardianName?: string
  guardianPhone?: string
}

interface Student {
  isStudentActive: boolean
  studentActivatedAt?: Date // Keep your existing field
  studentDeactivatedAt?: Date // Add this for deactivation timestamp
  deactivationReason?: string // Reason for deactivation
  lastStatusUpdatedAt?: Date // Track any status change
}
