import { useState } from 'react'
import { collection, addDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'

interface CreateNotificationData {
  type: string
  title: string
  message: string
  htmlContent?: string
  userId: string
  data?: any
  read?: boolean
}

export const useNotificationCreation = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const createNotification = async (notificationData: CreateNotificationData) => {
    setIsLoading(true)
    
    try {


      const { type, title, message, htmlContent, userId, data, read = false } = notificationData

      // Validate required fields
      if (!type || !title || !userId) {
        throw new Error('Type, title, and user ID are required')
      }

      // Create notification in Firestore
      const notificationPayload = {
        type,
        title,
        message: message || '',
        htmlContent: htmlContent || '',
        read,
        createdAt: new Date(),
        userId,
        data: data || {},
      }

      const notificationRef = await addDoc(collection(portalDb, 'notifications'), notificationPayload)



      toast({
        title: 'Success',
        description: 'Notification created successfully',
        status: 'success',
        duration: 3000,
      })

      return { 
        success: true, 
        notificationId: notificationRef.id,
        message: 'Notification created successfully'
      }

    } catch (error: any) {
      console.error('❌ Notification creation error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to create notification',
        status: 'error',
        duration: 5000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    createNotification,
    isLoading,
  }
}
