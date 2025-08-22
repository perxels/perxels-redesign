import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

// Initialize Firebase Admin SDK
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\n/g, '\n'),
    }),
  })
}

const db = getFirestore()
const auth = getAuth()

interface DeleteStudentRequest {
  studentId: string
  adminUserId: string
}

interface DeleteStudentResponse {
  success: boolean
  message?: string
  error?: string
  deletedCollections?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteStudentResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { studentId, adminUserId } = req.body as DeleteStudentRequest

    // Validate inputs
    if (!studentId || !adminUserId) {
      return res.status(400).json({
        success: false,
        error: 'Student ID and Admin User ID are required',
      })
    }

    // Verify admin permissions
    const adminUserDoc = await db.collection('users').doc(adminUserId).get()
    if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can delete students',
      })
    }

    const deletedCollections: string[] = []

    // 1. Delete user notifications (both student notifications and admin notifications about this student)
    try {
      // Delete notifications where userId matches the student (student's own notifications)
      const studentNotificationsQuery = db.collection('notifications').where('userId', '==', studentId)
      const studentNotificationsSnapshot = await studentNotificationsQuery.get()
      
      // Delete notifications where data.studentId matches the student (admin notifications about this student)
      const adminNotificationsQuery = db.collection('notifications').where('data.studentId', '==', studentId)
      const adminNotificationsSnapshot = await adminNotificationsQuery.get()
      
      const batch1 = db.batch()
      
      // Delete student's own notifications
      studentNotificationsSnapshot.docs.forEach(doc => {
        batch1.delete(doc.ref)
      })
      
      // Delete admin notifications about this student
      adminNotificationsSnapshot.docs.forEach(doc => {
        batch1.delete(doc.ref)
      })
      
      await batch1.commit()
      deletedCollections.push('notifications')
    } catch (error) {
      console.warn('Failed to delete notifications:', error)
    }

    // 2. Delete video access records
    try {
      const videoAccessQuery = db.collection('videoAccess').where('studentId', '==', studentId)
      const videoAccessSnapshot = await videoAccessQuery.get()
      const batch2 = db.batch()
      
      videoAccessSnapshot.docs.forEach(doc => {
        batch2.delete(doc.ref)
      })
      await batch2.commit()
      deletedCollections.push('videoAccess')
    } catch (error) {
      console.warn('Failed to delete video access:', error)
    }

    // 3. Delete ebook access records
    try {
      const ebookAccessQuery = db.collection('ebookAccess').where('studentId', '==', studentId)
      const ebookAccessSnapshot = await ebookAccessQuery.get()
      const batch3 = db.batch()
      
      ebookAccessSnapshot.docs.forEach(doc => {
        batch3.delete(doc.ref)
      })
      await batch3.commit()
      deletedCollections.push('ebookAccess')
    } catch (error) {
      console.warn('Failed to delete ebook access:', error)
    }

    // 4. Delete attendance records (checkins subcollection)
    try {
      // Get all attendance records
      const attendanceQuery = db.collection('attendance')
      const attendanceSnapshot = await attendanceQuery.get()
      
      const batch4 = db.batch()
      
      // For each attendance record, delete the student's checkin
      for (const attendanceDoc of attendanceSnapshot.docs) {
        const checkinRef = attendanceDoc.ref.collection('checkins').doc(studentId)
        batch4.delete(checkinRef)
      }
      
      await batch4.commit()
      deletedCollections.push('attendance')
    } catch (error) {
      console.warn('Failed to delete attendance records:', error)
    }

    // 5. Delete video comments (if they exist)
    try {
      const commentsQuery = db.collection('videoComments').where('studentId', '==', studentId)
      const commentsSnapshot = await commentsQuery.get()
      const batch5 = db.batch()
      
      commentsSnapshot.docs.forEach(doc => {
        batch5.delete(doc.ref)
      })
      await batch5.commit()
      deletedCollections.push('videoComments')
    } catch (error) {
      console.warn('Failed to delete video comments:', error)
    }

    // 6. Delete any other student-specific data
    try {
      // Delete school fee info (if stored separately)
      const schoolFeeQuery = db.collection('schoolFeeInfo').where('studentId', '==', studentId)
      const schoolFeeSnapshot = await schoolFeeQuery.get()
      const batch6 = db.batch()
      
      schoolFeeSnapshot.docs.forEach(doc => {
        batch6.delete(doc.ref)
      })
      await batch6.commit()
      deletedCollections.push('schoolFeeInfo')
    } catch (error) {
      console.warn('Failed to delete school fee info:', error)
    }

    // 7. Delete the main user document
    try {
      await db.collection('users').doc(studentId).delete()
      deletedCollections.push('users')
    } catch (error) {
      console.warn('Failed to delete user document:', error)
    }

    // 8. Delete the Firebase Auth account
    try {
      await auth.deleteUser(studentId)
      deletedCollections.push('firebaseAuth')
      console.log('✅ Firebase Auth account deleted successfully')
    } catch (error: any) {
      console.warn('Failed to delete Firebase Auth account:', error)
      // If user doesn't exist in Auth, that's fine - continue
      if (error.code !== 'auth/user-not-found') {
        throw error
      }
    }

    return res.status(200).json({
      success: true,
      message: 'Student deleted successfully',
      deletedCollections
    })

  } catch (error: any) {
    console.error('Error deleting student:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete student'
    })
  }
}
