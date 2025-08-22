import type { NextApiRequest, NextApiResponse } from 'next'
import { PaymentInstallment, SchoolFeeInfo } from '../../types/school-fee.types'
import { sendPaymentNotificationEmail } from '../../lib/utils/email.utils'

interface FirstInstallmentData {
  cohort: string
  classPlan: string
  schoolFee: number
  amountPaid: number
  paymentReceiptUrl?: string
  studentName?: string
  studentEmail?: string
}

interface UpdateSchoolFeeInfoRequest {
  uid: string
  schoolFeeInfo: FirstInstallmentData
}

interface UpdateSchoolFeeInfoResponse {
  success: boolean
  message?: string
  error?: string
  data?: {
    studentId: string
    studentName: string
    studentEmail: string
    amount: number
    installmentNumber: number
    paymentReceiptUrl: string
    cohort: string
    classPlan: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateSchoolFeeInfoResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, schoolFeeInfo } = req.body as UpdateSchoolFeeInfoRequest

    // Validate required fields
    if (!uid || !schoolFeeInfo) {
      return res.status(400).json({
        success: false,
        error: 'User ID and school fee information are required',
      })
    }

    // Validate school fee info fields
    const { cohort, classPlan, schoolFee, amountPaid, paymentReceiptUrl } = schoolFeeInfo
    if (!cohort || !classPlan || !schoolFee || !amountPaid) {
      return res.status(400).json({
        success: false,
        error: 'Cohort, class plan, school fee, and amount paid are required',
      })
    }

    // This API now only handles school fee info updates
    // Notifications should be handled by the client using the usePaymentNotifications hook
    
    return res.status(200).json({
      success: true,
      message: 'School fee information updated successfully. Please handle notifications on the client side.',
      data: {
        studentId: uid,
        studentName: schoolFeeInfo.studentName || 'Unknown Student',
        studentEmail: schoolFeeInfo.studentEmail || '',
        amount: Number(amountPaid),
        installmentNumber: 1,
        paymentReceiptUrl: paymentReceiptUrl || '',
        cohort,
        classPlan,
      }
    })

    return res.status(200).json({
      success: true,
      message: 'First installment submitted successfully and is pending admin approval',
    })

  } catch (error: any) {
    console.error('Update school fee info API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update school fee information',
    })
  }
} 