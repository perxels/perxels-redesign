import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { SchoolFeeInfo, getRemainingBalance, getTotalPending, getNextInstallmentNumber, canAddInstallment } from '../../types/school-fee.types'

interface GetPaymentStatusRequest {
  uid: string
}

interface PaymentStatusResponse {
  success: boolean
  data?: {
    schoolFeeInfo: SchoolFeeInfo | null
    remainingBalance: number
    totalPending: number
    nextInstallmentNumber: number | null
    canAddInstallment: boolean
    hasSchoolFeeInfo: boolean
  }
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<PaymentStatusResponse>,
) {
  if (req.method !== 'GET') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid } = req.query as { uid: string }

    // Validate required fields
    if (!uid) {
      return res.status(400).json({
        success: false,
        error: 'User ID is required',
      })
    }

    // Verify user exists and get school fee info
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    const userData = userDoc.data()
    const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

    if (!schoolFeeInfo) {
      return res.status(200).json({
        success: true,
        data: {
          schoolFeeInfo: null,
          remainingBalance: 0,
          totalPending: 0,
          nextInstallmentNumber: null,
          canAddInstallment: false,
          hasSchoolFeeInfo: false,
        },
      })
    }

    // Calculate status information
    const remainingBalance = getRemainingBalance(schoolFeeInfo)
    const totalPending = getTotalPending(schoolFeeInfo)
    const nextInstallmentNumber = getNextInstallmentNumber(schoolFeeInfo)
    const canAddMore = canAddInstallment(schoolFeeInfo)

    return res.status(200).json({
      success: true,
      data: {
        schoolFeeInfo,
        remainingBalance,
        totalPending,
        nextInstallmentNumber,
        canAddInstallment: canAddMore,
        hasSchoolFeeInfo: true,
      },
    })

  } catch (error: any) {
    console.error('Get payment status API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to get payment status',
    })
  }
} 