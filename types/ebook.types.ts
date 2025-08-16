export interface PortalEbook {
  id: string
  title: string
  description: string
  author: string
  fileUrl: string           // Cloudinary or Firebase Storage URL
  fileName: string          // Original filename
  fileSize: number          // File size in bytes
  fileType: string          // PDF, EPUB, etc.
  thumbnailUrl?: string     // Optional cover image
  datePosted: Date          // Auto generated date
  accessCode: string        // 6-8 character unique code
  createdBy: string         // Admin UID
  updatedAt?: Date
  isActive: boolean         // Can be disabled without deleting
  category?: string         // Optional categorization
  downloadCount: number     // Total downloads across all students
  maxAccess?: number        // Optional limit on how many students can access
  tags?: string[]           // Optional tags for categorization
  pageCount?: number        // Number of pages (if applicable)
  language?: string         // Language of the ebook
  isbn?: string             // ISBN if available
}

export interface EbookAccess {
  id: string                // Combination of ebookId_studentId
  ebookId: string
  studentId: string
  studentName: string       // For easy admin viewing
  studentEmail: string
  accessGrantedAt: Date
  lastDownloadedAt?: Date
  downloadCount: number
  isRevoked?: boolean       // Admin can revoke access
}

export interface EbookAccessRequest {
  ebookId: string
  studentId: string
  accessCode: string
}

export interface EbookAccessResponse {
  success: boolean
  error?: string
  ebook?: PortalEbook
  message?: string
}

export interface EbookFormValues {
  title: string
  description: string
  author: string
  category?: string
  maxAccess?: number
  tags?: string[]
  pageCount?: number
  language?: string
  isbn?: string
}

export interface EbookUploadProgress {
  progress: number
  status: 'uploading' | 'processing' | 'complete' | 'error'
  message?: string
}
