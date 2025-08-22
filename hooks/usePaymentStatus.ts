import { useState } from 'react'
import { doc, getDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'
import { SchoolFeeInfo, getRemainingBalance, getTotalPending, getNextInstallmentNumber, canAddInstallment } from '../types/school-fee.types'

interface PaymentStatusData {
  schoolFeeInfo: SchoolFeeInfo | null
  remainingBalance: number
  totalPending: number
  nextInstallmentNumber: number | null
  canAddInstallment: boolean
  hasSchoolFeeInfo: boolean
}

export const usePaymentStatus = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const getPaymentStatus = async (uid: string): Promise<{ success: boolean; data?: PaymentStatusData; error?: string }> => {
    setIsLoading(true)
    
    try {


      // Validate required fields
      if (!uid) {
        throw new Error('User ID is required')
      }

      // Verify user exists and get school fee info
      const userDoc = await getDoc(doc(portalDb, 'users', uid))
      if (!userDoc.exists()) {
        throw new Error('User not found')
      }

      const userData = userDoc.data()
      const schoolFeeInfo = userData?.schoolFeeInfo as SchoolFeeInfo | undefined

      if (!schoolFeeInfo) {

        return {
          success: true,
          data: {
            schoolFeeInfo: null,
            remainingBalance: 0,
            totalPending: 0,
            nextInstallmentNumber: null,
            canAddInstallment: false,
            hasSchoolFeeInfo: false,
          },
        }
      }

      // Calculate status information
      const remainingBalance = getRemainingBalance(schoolFeeInfo)
      const totalPending = getTotalPending(schoolFeeInfo)
      const nextInstallmentNumber = getNextInstallmentNumber(schoolFeeInfo)
      const canAddMore = canAddInstallment(schoolFeeInfo)

      const paymentStatusData: PaymentStatusData = {
        schoolFeeInfo,
        remainingBalance,
        totalPending,
        nextInstallmentNumber,
        canAddInstallment: canAddMore,
        hasSchoolFeeInfo: true,
      }


      return { success: true, data: paymentStatusData }

    } catch (error: any) {
      console.error('❌ Payment status error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to get payment status',
        status: 'error',
        duration: 5000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    getPaymentStatus,
    isLoading,
  }
}
