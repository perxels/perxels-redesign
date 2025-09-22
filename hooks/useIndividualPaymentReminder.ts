import { useState } from 'react'
import { addDoc, collection } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'
import { createPaymentReminderNotificationPayload } from '../lib/utils/notification-templates'

export const useIndividualPaymentReminder = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const sendIndividualReminder = async (student: any) => {
    setIsLoading(true)

    try {
      const fee = student.schoolFeeInfo
      if (!fee) {
        throw new Error('No payment information found for this student')
      }

      const totalFee = fee.totalSchoolFee || 0
      const totalPaid = fee.totalApproved || 0
      const outstandingAmount = totalFee - totalPaid

      // Create notification payload
      const notificationPayload = createPaymentReminderNotificationPayload(
        student.uid, // Correct student ID
        student.fullName,
        fee.cohort || '',
        fee.classPlan || '',
        totalFee,
        totalPaid,
        outstandingAmount,
      )

      // Add notification to Firestore
      await addDoc(collection(portalDb, 'notifications'), notificationPayload)

      toast({
        title: 'Reminder Sent!',
        description: `Payment reminder sent to ${student.fullName}`,
        status: 'success',
        duration: 3000,
        isClosable: true,
      })

      return { success: true }
    } catch (error: any) {
      console.error('❌ Failed to send reminder:', error)
      toast({
        title: 'Failed to Send Reminder',
        description: error.message || 'Please try again',
        status: 'error',
        duration: 3000,
        isClosable: true,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendIndividualReminder,
    isLoading,
  }
}
