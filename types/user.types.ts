// types/user.types.
export interface PortalUser {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: 'student' | 'admin' | 'facilitator'
  emailVerified: boolean
  isStudentActive?: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  schoolFeeInfo?: {
    cohort: string
    classPlan: string // classPlan ID
    paymentStatus: 'paid' | 'partial' | 'pending' | 'overdue'
    totalSchoolFee?: number
    totalApproved?: number
  }
  growthInfo?: any
  termsAgreed?: boolean
  createdAt?: Date

  // For students - track enrolled class plans
  enrolledClassPlans?: StudentEnrollment[]

  // For facilitators - track assigned class plans
  assignedClassPlans?: FacilitatorAssignment[]
}

export interface StudentEnrollment {
  cohortId: string
  classPlanId: string
  enrolledAt: Date
  status: 'active' | 'completed' | 'dropped'
  progress?: StudentProgress
}

export interface StudentProgress {
  classPlanId: string
  completedSessions: string[] // session IDs
  currentSession?: string
  overallProgress: number
  lastActivity?: Date
  assignments: StudentAssignment[]
}

export interface StudentAssignment {
  assignmentId: string
  sessionId: string
  title: string
  status: 'not-started' | 'in-progress' | 'submitted' | 'graded'
  submittedAt?: Date
  grade?: number
  feedback?: string
}

export interface FacilitatorAssignment {
  cohortId: string
  classPlanId: string
  assignedAt: Date
  assignedBy: string
  status: 'active' | 'inactive'
}
