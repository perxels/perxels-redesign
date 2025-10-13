import {
  doc,
  updateDoc,
  getDoc,
  collection,
  addDoc,
  query,
  where,
  getDocs,
} from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import {
  PaymentInstallment,
  SchoolFeeInfo,
  calculateOverallStatus,
  getNextInstallmentNumber,
} from '../../types/school-fee.types'
import {
  sendPaymentNotificationEmail,
  generatePaymentApprovedHtml,
  generatePaymentRejectedHtml,
  sendStudentHtmlEmail,
  generateAdmittedHtml,
  generateRejectedHtml,
  sendAdmissionEmail,
  ONBOARDING_FILES,
} from './email.utils'

interface ReviewInstallmentParams {
  uid: string // student uid
  installmentNumber: 1 | 2 | 3 | 4
  adminUid: string
  action: 'approve' | 'reject'
  rejectionReason?: string
}

interface ReviewInstallmentResult {
  success: boolean
  message?: string
  error?: string
  newOverallStatus?: string
  notificationData?: {
    uid: string
    studentEmail: string
    studentName: string
    cohort: string
    classPlan: string
    amount: number
    installmentNumber: number
    action: 'approve' | 'reject'
    rejectionReason?: string
    isFirstApproval: boolean
  }
}

interface AddInstallmentParams {
  uid: string
  amount: number
  paymentReceiptUrl: string
}

interface AddInstallmentResult {
  success: boolean
  message?: string
  error?: string
  installmentNumber?: number
  notificationData?: {
    studentName: string
    studentEmail: string
    amount: number
    installmentNumber: number
    paymentReceiptUrl: string
    cohort: string
    classPlan: string
  }
}

export async function reviewPaymentInstallment(
  params: ReviewInstallmentParams,
): Promise<ReviewInstallmentResult> {
  try {
    const { uid, installmentNumber, adminUid, action, rejectionReason } = params
    // Validate required fields
    if (!uid || !installmentNumber || !adminUid || !action) {
      return {
        success: false,
        error:
          'Student UID, installment number, admin UID, and action are required',
      }
    }

    if (action === 'reject' && !rejectionReason) {
      return {
        success: false,
        error: 'Rejection reason is required when rejecting a payment',
      }
    }

    // Verify student exists and get current school fee info
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'Student not found',
      }
    }

    const userData = userDoc.data()

    // Verify admin exists and has admin role
    const adminDoc = await getDoc(doc(portalDb, 'users', adminUid))
    if (!adminDoc.exists()) {
      return {
        success: false,
        error: 'Admin not found',
      }
    }

    const adminData = adminDoc.data()
    if (adminData?.role !== 'admin') {
      return {
        success: false,
        error: 'Only admins can review payment installments',
      }
    }

    const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    if (
      !schoolFeeInfo ||
      !schoolFeeInfo.payments ||
      schoolFeeInfo.payments.length === 0
    ) {
      return {
        success: false,
        error: 'No school fee information found for this student',
      }
    }

    // Find the installment to review - look for the most recent pending payment
    // If rejecting, we want to find the pending payment to reject
    // If approving, we want to find the pending payment to approve
    let installmentIndex = -1

    if (action === 'reject') {
      // For rejection, find the most recent pending payment with this installment number
      const pendingPayments = schoolFeeInfo.payments
        .map((payment, index) => ({ payment, index }))
        .filter(
          ({ payment }) =>
            payment.installmentNumber === installmentNumber &&
            payment.status === 'pending',
        )
        .sort(
          (a, b) =>
            new Date(b.payment.submittedAt).getTime() -
            new Date(a.payment.submittedAt).getTime(),
        )

      if (pendingPayments.length > 0) {
        installmentIndex = pendingPayments[0].index
      }
    } else {
      // For approval, find any pending payment with this installment number
      installmentIndex = schoolFeeInfo.payments.findIndex(
        (payment) =>
          payment.installmentNumber === installmentNumber &&
          payment.status === 'pending',
      )
    }

    if (installmentIndex === -1) {
      return {
        success: false,
        error: `Installment ${installmentNumber} not found`,
      }
    }

    const targetInstallment = schoolFeeInfo.payments[installmentIndex]

    // Check if installment is already reviewed
    // Allow re-rejecting already rejected payments, but prevent re-approving approved ones
    if (targetInstallment.status === 'approved') {
      return {
        success: false,
        error: `Installment ${installmentNumber} has already been approved and cannot be changed`,
      }
    }

    // Allow rejecting already rejected payments (for updating rejection reason)
    if (targetInstallment.status === 'rejected' && action === 'approve') {
      return {
        success: false,
        error: `Installment ${installmentNumber} has already been rejected and cannot be approved`,
      }
    }

    // Update the installment
    const updatedInstallment: PaymentInstallment = {
      ...targetInstallment,
      status: action === 'approve' ? 'approved' : 'rejected',
      reviewedAt: new Date(),
      reviewedBy: adminUid,
      ...(action === 'reject' && { rejectionReason }),
    }

    // Update payments array
    const updatedPayments = [...schoolFeeInfo.payments]
    updatedPayments[installmentIndex] = updatedInstallment

    // Calculate new totals
    const totalApproved = updatedPayments
      .filter((payment) => payment.status === 'approved')
      .reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate total submitted from valid payments (approved + pending, exclude rejected)
    const totalSubmitted = updatedPayments
      .filter(
        (payment) =>
          payment.status === 'approved' || payment.status === 'pending',
      )
      .reduce((sum, payment) => sum + payment.amount, 0)

    // Calculate new overall status
    const newOverallStatus = calculateOverallStatus(
      updatedPayments,
      schoolFeeInfo.totalSchoolFee,
    )

    // Update school fee info
    const updatedSchoolFeeInfo: SchoolFeeInfo = {
      ...schoolFeeInfo,
      payments: updatedPayments,
      totalApproved,
      totalSubmitted, // Update total submitted to exclude rejected payments
      overallStatus: newOverallStatus,
      updatedAt: new Date(),
    }

    // Update user document
    try {
      await updateDoc(doc(portalDb, 'users', uid), {
        schoolFeeInfo: updatedSchoolFeeInfo,
        schoolFeeInfoUpdatedAt: new Date(),
      })
    } catch (dbError) {
      throw new Error(`Failed to update payment status in database: ${dbError}`)
    }

    // Return data needed for server-side notification/email processing
    const studentEmail = userData?.email || ''
    const studentName = userData?.fullName || 'Student'
    const cohort = schoolFeeInfo.cohort
    const classPlan = schoolFeeInfo.classPlan
    const amount = targetInstallment.amount

    // Check if this is the first approved payment
    const previouslyApprovedCount = schoolFeeInfo.payments.filter(
      (p) => p.status === 'approved',
    ).length
    const isFirstApproval =
      previouslyApprovedCount === 0 && action === 'approve'

    const actionWord = action === 'approve' ? 'approved' : 'rejected'
    return {
      success: true,
      message: `Installment ${installmentNumber} has been ${actionWord} successfully`,
      newOverallStatus,
      notificationData: {
        uid,
        studentEmail,
        studentName,
        cohort,
        classPlan,
        amount,
        installmentNumber,
        action,
        rejectionReason,
        isFirstApproval,
      },
    }
  } catch (error: any) {
    console.error('Review payment installment error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to review payment installment',
    }
  }
}

export async function addPaymentInstallment(
  params: AddInstallmentParams,
): Promise<AddInstallmentResult> {
  try {
    const { uid, amount, paymentReceiptUrl } = params

    // Validate required fields
    if (!uid || !amount || !paymentReceiptUrl) {
      return {
        success: false,
        error: 'User ID, amount, and payment receipt URL are required',
      }
    }

    if (amount <= 0) {
      return {
        success: false,
        error: 'Payment amount must be greater than 0',
      }
    }

    // Verify user exists and get current school fee info
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return {
        success: false,
        error: 'User not found',
      }
    }

    const userData = userDoc.data()
    const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    if (
      !schoolFeeInfo ||
      !schoolFeeInfo.payments ||
      schoolFeeInfo.payments.length === 0
    ) {
      return {
        success: false,
        error:
          'No initial school fee information found. Please submit your first installment first.',
      }
    }

    // Use the helper function to find the next available installment number
    // This properly handles rejected payments and ensures we only count valid slots

    const nextInstallmentNumber = getNextInstallmentNumber(schoolFeeInfo)

    if (!nextInstallmentNumber) {
      return {
        success: false,
        error:
          'Maximum of 4 installments allowed. You have already submitted all allowed payments.',
      }
    }

    // Calculate total submitted amount from valid payments only (exclude rejected payments)
    const validPayments = schoolFeeInfo.payments.filter(
      (payment) =>
        payment.status === 'approved' || payment.status === 'pending',
    )
    const totalSubmittedFromValidPayments = validPayments.reduce(
      (sum, payment) => sum + payment.amount,
      0,
    )

    // Check if total submitted amount (including this new payment) exceeds total school fee
    const newTotalSubmitted = totalSubmittedFromValidPayments + amount
    // Old check that did not account for rejected payments
    // if (newTotalSubmitted > schoolFeeInfo.totalSchoolFee) {
    //   return {
    //     success: false,
    //     error: `Payment amount exceeds remaining balance. Remaining: ₦${schoolFeeInfo.totalSchoolFee - totalSubmittedFromValidPayments}`,
    //   }
    // }
    // New check that correctly accounts for rejected payments
    if (newTotalSubmitted > schoolFeeInfo.totalSchoolFee) {
      const remainingBalance =
        schoolFeeInfo.totalSchoolFee - totalSubmittedFromValidPayments
      return {
        success: false,
        error: `Payment amount exceeds remaining balance. Remaining: ₦${remainingBalance.toLocaleString()}`,
      }
    }

    // Create new installment
    const newInstallment: PaymentInstallment = {
      installmentNumber: nextInstallmentNumber,
      amount: Number(amount),
      paymentReceiptUrl,
      status: 'pending',
      submittedAt: new Date(),
    }

    // Update school fee info
    const updatedPayments = [...schoolFeeInfo.payments, newInstallment]
    const updatedSchoolFeeInfo: SchoolFeeInfo = {
      ...schoolFeeInfo,
      payments: updatedPayments,
      totalSubmitted: newTotalSubmitted, // This now correctly excludes rejected payments
      updatedAt: new Date(),
    }

    // Update user document
    await updateDoc(doc(portalDb, 'users', uid), {
      schoolFeeInfo: updatedSchoolFeeInfo,
      schoolFeeInfoUpdatedAt: new Date(),
    })

    // Return data needed for server-side notification processing
    const studentName = `${userData.fullName}`.trim() || 'Unknown Student'
    const studentEmail = userData?.email || ''

    return {
      success: true,
      message: `Installment ${nextInstallmentNumber} submitted successfully and is pending admin approval`,
      installmentNumber: nextInstallmentNumber,
      notificationData: {
        studentName,
        studentEmail,
        amount: Number(amount),
        installmentNumber: nextInstallmentNumber,
        paymentReceiptUrl,
        cohort: schoolFeeInfo.cohort,
        classPlan: schoolFeeInfo.classPlan,
      },
    }
  } catch (error: any) {
    console.error('Add payment installment error:', error)
    return {
      success: false,
      error: error?.message || 'Failed to add payment installment',
    }
  }
}
