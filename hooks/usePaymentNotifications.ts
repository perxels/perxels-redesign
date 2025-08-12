import { useState } from 'react'
import { collection, addDoc, query, where, getDocs } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'

interface PaymentNotificationData {
  studentId: string
  studentName: string
  studentEmail: string
  amount: number
  installmentNumber: number
  paymentReceiptUrl: string
  cohort: string
  classPlan: string
}

interface NotificationPayload {
  type: 'payment_submitted'
  userId: string
  title: string
  message: string
  data: PaymentNotificationData
}

export const usePaymentNotifications = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const sendPaymentNotification = async (paymentData: PaymentNotificationData) => {
    setIsLoading(true)
    
    try {
      console.log('🔍 Starting payment notification process...', paymentData)

      // 1. Get all admin users from Firestore
      const adminUsersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'admin')
      )
      
      const adminUsersSnapshot = await getDocs(adminUsersQuery)
      const adminUsers = adminUsersSnapshot.docs
      
      if (adminUsers.length === 0) {
        console.warn('⚠️ No admin users found')
        toast({
          title: 'Warning',
          description: 'No admin users found for notification',
          status: 'warning',
          duration: 3000,
        })
        return { success: false, error: 'No admin users found' }
      }

      console.log(`✅ Found ${adminUsers.length} admin users`)

      // 2. Extract admin emails for email notification
      const adminEmails = adminUsers.map(doc => doc.data().email).filter(Boolean)
      
      // 3. Create notification for each admin
      const notificationPromises = adminUsers.map(async (adminDoc) => {
        const adminId = adminDoc.id
        
        const notificationPayload: NotificationPayload = {
          type: 'payment_submitted',
          userId: adminId,
          title: 'Payment Submitted',
          message: `${paymentData.studentName} has submitted installment ${paymentData.installmentNumber} payment of ₦${Number(paymentData.amount).toLocaleString()}`,
          data: {
            studentId: paymentData.studentId,
            studentName: paymentData.studentName,
            studentEmail: paymentData.studentEmail,
            amount: Number(paymentData.amount),
            installmentNumber: paymentData.installmentNumber,
            paymentReceiptUrl: paymentData.paymentReceiptUrl,
            cohort: paymentData.cohort,
            classPlan: paymentData.classPlan,
          },
        }

        // Create notification in Firestore
        const notificationRef = await addDoc(collection(portalDb, 'notifications'), {
          type: notificationPayload.type,
          title: notificationPayload.title,
          message: notificationPayload.message,
          data: notificationPayload.data,
          read: false,
          createdAt: new Date(),
          userId: notificationPayload.userId,
        })

        console.log(`✅ Notification created for admin ${adminId}:`, notificationRef.id)
        return notificationRef.id
      })

      // Wait for all notifications to be created
      const notificationIds = await Promise.all(notificationPromises)
      console.log(`✅ Created ${notificationIds.length} notifications`)

      // 4. Send email notification via API
      if (adminEmails.length > 0) {
        const emailResponse = await fetch('/api/send-payment-installment-notification', {
          method: 'POST',
          headers: {
            'Content-Type': 'application/json',
          },
          body: JSON.stringify({
            ...paymentData,
            adminEmails, // Pass admin emails to server
          }),
        })

        if (!emailResponse.ok) {
          console.error('❌ Failed to send email notification:', emailResponse.statusText)
          toast({
            title: 'Email Error',
            description: 'Failed to send email notification',
            status: 'error',
            duration: 3000,
          })
        } else {
          console.log('✅ Email notification sent successfully')
          toast({
            title: 'Success',
            description: 'Payment notification sent to admins',
            status: 'success',
            duration: 3000,
          })
        }
      }

      return { success: true, notificationIds }

    } catch (error: any) {
      console.error('❌ Payment notification error:', error)
      toast({
        title: 'Error',
        description: 'Failed to send payment notification',
        status: 'error',
        duration: 3000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    sendPaymentNotification,
    isLoading,
  }
}
