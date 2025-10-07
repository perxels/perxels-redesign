export interface Test {
  testId: string
  testName: string
  testDescription?: string
  accessCode: string
  status: 'active' | 'inactive' | 'draft'
  createdAt: any
  createdBy: string
  updatedAt: any
  updatedBy?: string
  duration: number // in minutes
  passingScore: number
  maxAttempts: number
  participants: string[] // array of student IDs who have accessed the test
  totalParticipants: number
  isActive: boolean
  allowRetakes?: boolean
  // Test security settings
  shuffleQuestions?: boolean
  shuffleOptions?: boolean
  maxTabSwitches?: number // 0 = disabled, 1+ = number of allowed switches
  analytics?: {
    totalAttempts: number
    totalParticipants: number
    averageScore: number
    passRate: number
    attempts: TestAttempt[]
    results: TestResult[]
  }
}

export interface Question {
  questionId: string
  testId: string
  questionText: string
  options: string[]
  correctAnswer: string
  points: number
  order: number
  createdAt: any
}

export interface TestAttempt {
  attemptId: string
  studentId: string
  testId: string
  accessCodeUsed: string
  startedAt: any
  submittedAt?: any
  answers: {
    [questionId: string]: string
  }
  score?: number
  totalPoints: number
  percentage?: number
  status: 'in-progress' | 'submitted' | 'graded'
  timeSpent?: number // in seconds
  passed: boolean
  passingScore: number
  // Security tracking
  tabSwitchCount?: number
  wasAutoSubmitted?: boolean
  autoSubmitReason?: string
  wasShuffled?: boolean
}

export interface TestResult {
  studentId: string
  testId: string
  latestAttemptId?: string
  bestScore?: number
  bestPercentage?: number
  attemptsCount: number
  lastAttemptDate?: any
  testName: string
  passed: boolean
  accessCodeUsed: string
}

export interface TestParticipant {
  studentId: string
  studentName: string
  studentEmail: string
  accessedAt: any
  attempts: number
  bestScore?: number
  bestPercentage?: number
  passed: boolean
  lastAttemptDate?: any
  cohort?: string
  classPlan?: string
}
export interface StudentRemark {
  remarkId: string
  testId: string
  studentId: string
  addedBy: string // admin/facilitator ID
  addedByName: string // admin/facilitator name
  remark: string
  createdAt: any
  updatedAt?: any
  isVisibleToStudent?: boolean
}
