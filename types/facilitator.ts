export interface FacilitatorProfile {
  uid: string
  email: string
  fullName: string
  phone: string
  gender?: 'male' | 'female'
  profession?: string
  dateOfBirth?: string
  address?: string
  pictureUrl?: string
  isActive: boolean
  emailVerified: boolean
  registrationComplete: boolean
  createdAt: any
  updatedAt?: any
}

export interface FacilitatorFormData {
  fullName: string
  phone: string
  gender: string
  profession: string
  dateOfBirth?: string
  address: string
}

export interface FacilitatorDashboardStats {
  totalStudents: number
  attendanceRate: number
  pendingAssessments: number
  activeCohorts: number
}
