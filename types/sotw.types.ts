export interface SOTWImage {
  id: string
  url: string
  caption?: string
  uploadedAt: Date
}

export interface SOTWData {
  id: string
  studentId: string
  studentName: string
  studentEmail: string
  studentAvatar?: string
  cohort: string
  classPlan: string
  projectName?: string
  igLink?: string
  citation: string
  workHighlight: string
  workImages: SOTWImage[]
  selectedBy: string
  selectedByEmail: string
  selectedAt: Date
  weekStart: Date
  weekEnd: Date
  isActive: boolean
  likes: string[]
  comments: SOTWComment[]
}

export interface SOTWComment {
  id: string
  userId: string
  userName: string
  userAvatar?: string
  comment: string
  createdAt: Date
  isActive: boolean
}

export interface SOTWHistory extends SOTWData {
  archivedAt: Date
  totalLikes: number
  totalComments: number
}
