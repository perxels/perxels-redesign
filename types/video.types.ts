export interface PortalVideo {
  id: string
  title: string
  videoSession: string       // Video session description/topic
  videoUrl: string           // YouTube/Vimeo URL or direct video file
  videoImage?: string        // Custom video thumbnail/image URL
  author: string             // Author name (not UID)
  datePosted: Date           // Auto generated date
  accessCode: string         // 6-8 character unique code
  createdBy: string          // Admin UID (for tracking who created it)
  updatedAt?: Date
  isActive: boolean          // Can be disabled without deleting
  category?: string          // Optional categorization
  duration?: number          // Video length in seconds
  viewCount: number          // Total views across all students
  maxAccess?: number         // Optional limit on how many students can access
}

export interface VideoAccess {
  id: string                 // Combination of videoId_studentId
  videoId: string
  studentId: string
  studentName: string        // For easy admin viewing
  studentEmail: string
  accessGrantedAt: Date
  lastWatchedAt?: Date
  watchCount: number
  progressPercentage?: number // Track viewing progress (0-100)
  isRevoked?: boolean        // Admin can revoke access
}

export interface VideoAccessRequest {
  videoId: string
  studentId: string
  accessCode: string
}

export interface VideoAccessResponse {
  success: boolean
  video?: PortalVideo
  error?: string
  message?: string
}

export interface VideoStats {
  totalVideos: number
  activeVideos: number
  totalViews: number
  totalStudentsWithAccess: number
  popularVideos: Array<{
    video: PortalVideo
    accessCount: number
    viewCount: number
  }>
} 