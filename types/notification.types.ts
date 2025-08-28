export interface AdminNotification {
  id?: string
  type: 'payment_submitted' | 'payment_approved' | 'payment_rejected' | 'student_registered'
  title: string
  message: string
  data: {
    studentId: string
    studentName: string
    studentEmail: string
    amount?: number
    installmentNumber?: number
    paymentReceiptUrl?: string
    cohort?: string
    classPlan?: string
    status?: 'pending' | 'approved' | 'rejected' // Payment status for payment_submitted notifications
    rejectionReason?: string // Reason for rejection if applicable
  }
  read: boolean
  createdAt: Date
  adminIds?: string[] // Array of admin IDs who should see this notification
}

export interface EmailNotificationData {
  to: string[]
  subject: string
  templateType: 'payment_submitted' | 'payment_approved' | 'payment_rejected'
  data: {
    adminName?: string
    studentName: string
    studentEmail: string
    amount: number
    installmentNumber: number
    paymentReceiptUrl: string
    cohort: string
    classPlan: string
    submittedAt: string
    rejectionReason?: string
  }
}

export interface NotificationPreferences {
  adminId: string
  emailNotifications: {
    paymentSubmitted: boolean
    paymentApproved: boolean
    paymentRejected: boolean
  }
  inAppNotifications: {
    paymentSubmitted: boolean
    paymentApproved: boolean
    paymentRejected: boolean
  }
}

// Notification status constants
export const NOTIFICATION_TYPES = {
  PAYMENT_SUBMITTED: 'payment_submitted' as const,
  PAYMENT_APPROVED: 'payment_approved' as const,
  PAYMENT_REJECTED: 'payment_rejected' as const,
  STUDENT_REGISTERED: 'student_registered' as const,
} as const

// Payment status constants
export const PAYMENT_STATUS = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
} as const

// Helper functions
export function createPaymentNotification(
  studentId: string,
  studentName: string,
  studentEmail: string,
  amount: number,
  installmentNumber: number,
  paymentReceiptUrl: string,
  cohort: string,
  classPlan: string,
  adminIds: string[]
): AdminNotification {
  return {
    type: NOTIFICATION_TYPES.PAYMENT_SUBMITTED,
    title: 'New Payment Submitted',
    message: `${studentName} has submitted installment ${installmentNumber} payment of ₦${amount.toLocaleString()}`,
    data: {
      studentId,
      studentName,
      studentEmail,
      amount,
      installmentNumber,
      paymentReceiptUrl,
      cohort,
      classPlan,
      status: PAYMENT_STATUS.PENDING,
    },
    read: false,
    createdAt: new Date(),
    adminIds,
  }
}

export function formatCurrency(amount: number): string {
  return `₦${amount.toLocaleString()}`
}

export function formatDate(date: Date | string | null | undefined): string {
  // Handle invalid dates gracefully
  let validDate: Date
  
  if (!date) {
    validDate = new Date()
  } else if (typeof date === 'string') {
    validDate = new Date(date)
  } else if (date instanceof Date) {
    validDate = date
  } else {
    validDate = new Date()
  }
  
  // Check if the date is valid
  if (isNaN(validDate.getTime())) {
    validDate = new Date()
  }
  
  return new Intl.DateTimeFormat('en-US', {
    year: 'numeric',
    month: 'long',
    day: 'numeric',
    hour: '2-digit',
    minute: '2-digit',
  }).format(validDate)
} 