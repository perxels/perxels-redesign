import { useState, useEffect } from 'react'
import { usePortalAuth } from './usePortalAuth'
import { SchoolFeeInfo, getRemainingBalance, getTotalPending } from '../types/school-fee.types'
import { doc, getDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

interface PaymentStats {
  totalSchoolFee: number
  amountPaid: number
  amountOwing: number
  totalPending: number
  overallStatus: string
  hasPayments: boolean
}

interface UsePaymentDataReturn {
  schoolFeeInfo: SchoolFeeInfo | null
  paymentStats: PaymentStats
  loading: boolean
  error: string | null
  refetch: () => Promise<void>
}

export function usePaymentData(): UsePaymentDataReturn {
  const { portalUser } = usePortalAuth()
  const [schoolFeeInfo, setSchoolFeeInfo] = useState<SchoolFeeInfo | null>(null)
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const fetchPaymentData = async () => {
    if (!portalUser?.uid) {
      setLoading(false)
      return
    }

    try {
      setLoading(true)
      setError(null)

      // Fetch schoolFeeInfo directly from Firestore
      const userDocRef = doc(portalDb, 'users', portalUser.uid)
      const userDocSnap = await getDoc(userDocRef)
      if (!userDocSnap.exists()) {
        throw new Error('User not found')
      }
      const userData = userDocSnap.data()
      setSchoolFeeInfo(userData.schoolFeeInfo || null)
    } catch (err: any) {
      console.error('Error fetching payment data:', err)
      setError(err.message || 'Failed to load payment data')
    } finally {
      setLoading(false)
    }
  }

  useEffect(() => {
    fetchPaymentData()
  }, [portalUser])

  const paymentStats: PaymentStats = {
    totalSchoolFee: schoolFeeInfo?.totalSchoolFee || 0,
    amountPaid: schoolFeeInfo?.totalApproved || 0,
    amountOwing: schoolFeeInfo ? getRemainingBalance(schoolFeeInfo) : 0,
    totalPending: schoolFeeInfo ? getTotalPending(schoolFeeInfo) : 0,
    overallStatus: schoolFeeInfo?.overallStatus || 'pending',
    hasPayments: Boolean(schoolFeeInfo?.payments?.length)
  }

  return {
    schoolFeeInfo,
    paymentStats,
    loading,
    error,
    refetch: fetchPaymentData
  }
} 