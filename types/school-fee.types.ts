export interface PaymentInstallment {
  installmentNumber: 1 | 2 | 3 | 4
  amount: number
  paymentReceiptUrl: string
  status: 'pending' | 'approved' | 'rejected'
  submittedAt: Date
  reviewedAt?: Date
  reviewedBy?: string // admin uid
  rejectionReason?: string
}

export interface SchoolFeeInfo {
  cohort: string
  classPlan: string
  totalSchoolFee: number
  payments: PaymentInstallment[]
  totalSubmitted: number
  totalApproved: number
  overallStatus: 'pending' | 'partial' | 'completed' | 'rejected'
  createdAt: Date
  updatedAt: Date
}

// Legacy interface for backward compatibility
export interface LegacySchoolFeeInfo {
  cohort: string
  classPlan: string
  schoolFee: number
  amountPaid: number
  paymentReceiptUrl: string
}

// Payment status utilities
export const PAYMENT_STATUSES = {
  PENDING: 'pending' as const,
  APPROVED: 'approved' as const,
  REJECTED: 'rejected' as const,
} as const

export const OVERALL_STATUSES = {
  PENDING: 'pending' as const,
  PARTIAL: 'partial' as const,
  COMPLETED: 'completed' as const,
  REJECTED: 'rejected' as const,
} as const

// Helper functions
export function calculateOverallStatus(
  payments: PaymentInstallment[], 
  totalSchoolFee: number
): 'pending' | 'partial' | 'completed' | 'rejected' {
  const approvedPayments = payments.filter(p => p.status === PAYMENT_STATUSES.APPROVED)
  const rejectedPayments = payments.filter(p => p.status === PAYMENT_STATUSES.REJECTED)
  const pendingPayments = payments.filter(p => p.status === PAYMENT_STATUSES.PENDING)

  // If any payment is rejected, overall status depends on other payments
  if (rejectedPayments.length > 0) {
    // If all payments are rejected, overall status is rejected
    if (rejectedPayments.length === payments.length) {
      return OVERALL_STATUSES.REJECTED
    }
    // If there are approved payments, check if total approved amount equals school fee
    const totalApproved = approvedPayments.reduce((sum, payment) => sum + payment.amount, 0)
    if (totalApproved >= totalSchoolFee) {
      return OVERALL_STATUSES.COMPLETED
    }
    // If there are pending payments, status is pending
    if (pendingPayments.length > 0) {
      return OVERALL_STATUSES.PENDING
    }
    // Otherwise partial (some approved, some rejected, but not enough to complete)
    return OVERALL_STATUSES.PARTIAL
  }

  // No rejected payments
  const totalApproved = approvedPayments.reduce((sum, payment) => sum + payment.amount, 0)
  
  // If total approved amount equals or exceeds school fee, completed
  if (totalApproved >= totalSchoolFee) {
    return OVERALL_STATUSES.COMPLETED
  }

  // If there are pending payments, status is pending
  if (pendingPayments.length > 0) {
    return OVERALL_STATUSES.PENDING
  }

  // If there are approved payments but not enough to complete, partial
  if (approvedPayments.length > 0) {
    return OVERALL_STATUSES.PARTIAL
  }

  // Default to pending
  return OVERALL_STATUSES.PENDING
}

export function getRemainingBalance(schoolFeeInfo: SchoolFeeInfo): number {
  return Math.max(0, schoolFeeInfo.totalSchoolFee - schoolFeeInfo.totalApproved)
}

export function getTotalPending(schoolFeeInfo: SchoolFeeInfo): number {
  return schoolFeeInfo.payments
    .filter(payment => payment.status === PAYMENT_STATUSES.PENDING)
    .reduce((sum, payment) => sum + payment.amount, 0)
}

export function getNextInstallmentNumber(schoolFeeInfo: SchoolFeeInfo): 1 | 2 | 3 | 4 | null {
  // Find the next available installment number (1, 2, 3, or 4) that doesn't exist yet
  // Only consider valid payments (approved and pending), exclude rejected payments
  for (let i = 1; i <= 4; i++) {
    const existingValidInstallment = schoolFeeInfo.payments.find(payment => 
      payment.installmentNumber === i && 
      (payment.status === 'approved' || payment.status === 'pending')
    )
    if (!existingValidInstallment) {
      return i as 1 | 2 | 3 | 4
    }
  }
  return null
}

export function canAddInstallment(schoolFeeInfo: SchoolFeeInfo): boolean {
  // Check if there's an available installment slot (1, 2, 3, or 4) that doesn't exist yet
  // Only consider valid payments (approved and pending), exclude rejected payments
  for (let i = 1; i <= 4; i++) {
    const existingValidInstallment = schoolFeeInfo.payments.find(payment => 
      payment.installmentNumber === i && 
      (payment.status === 'approved' || payment.status === 'pending')
    )
    if (!existingValidInstallment) {
      return true // Found an available slot
    }
  }
  return false // All 4 slots are taken by valid payments
}

export function getPaymentSuggestions(totalSchoolFee: number, amountAlreadyPaid: number = 0): number[] {
  const remaining = totalSchoolFee - amountAlreadyPaid
  if (remaining <= 0) return []

  const suggestions = [
    remaining, // Full payment
    Math.ceil(remaining * 0.5), // 50%
    Math.ceil(remaining * 0.33), // ~33%
  ]

  // Remove duplicates and filter out amounts that are too small
  return Array.from(new Set(suggestions))
    .filter(amount => amount >= 1000) // Minimum 1000 naira
    .sort((a, b) => b - a) // Sort descending
} 