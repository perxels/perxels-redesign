import type { NextApiRequest, NextApiResponse } from 'next'
import { collection, addDoc } from 'firebase/firestore'
import { portalDb } from '../../../portalFirebaseConfig'

interface CreateNotificationRequest {
  type: 'payment_submitted'
  userId: string // Changed from admin-specific fields
  title: string
  message: string
  data: {
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

interface CreateNotificationResponse {
  success: boolean
  message?: string
  error?: string
  notificationId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateNotificationResponse>,
) {
  console.log('🔍 create-notification API called with:', {
    method: req.method,
    body: req.body,
    headers: req.headers
  })

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      type,
      userId,
      title,
      message,
      data,
    } = req.body as CreateNotificationRequest

    console.log('📋 Parsed request body:', {
      type,
      userId,
      title,
      message,
      data
    })

    // Validate required fields
    if (!type || !userId || !title || !message || !data) {
      console.log('❌ Missing required fields:', {
        hasType: !!type,
        hasUserId: !!userId,
        hasTitle: !!title,
        hasMessage: !!message,
        hasData: !!data
      })
      return res.status(400).json({
        success: false,
        error: 'All notification fields are required',
      })
    }

    console.log('📝 Creating notification...')
    // Create simple notification
    const notification = {
      type,
      title,
      message,
      data,
      read: false,
      createdAt: new Date(),
      userId, // Simple user ID
    }

    console.log('💾 Saving notification to Firestore:', notification)

    // Save notification to Firestore
    const notificationRef = await addDoc(collection(portalDb, 'notifications'), notification)
    
    console.log('✅ Notification saved with ID:', notificationRef.id)

    const response = {
      success: true,
      message: 'Notification created successfully',
      notificationId: notificationRef.id,
    }

    console.log('✅ Returning response:', response)
    return res.status(200).json(response)

  } catch (error: any) {
    console.error('❌ Create notification API error:', {
      error: error.message,
      code: error.code,
      stack: error.stack
    })
    return res.status(500).json({
      success: false,
      error: 'Failed to create notification',
    })
  }
} 