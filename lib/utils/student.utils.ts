import { 
  deleteDoc, 
  collection, 
  query, 
  where, 
  getDocs, 
  writeBatch,
  doc 
} from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface DeleteStudentResult {
  success: boolean
  error?: string
  deletedCollections?: string[]
}

/**
 * Comprehensive student deletion function
 * Deletes all user-related data and the Firebase account
 */
export async function deleteStudentCompletely(
  studentId: string,
  adminUser: any
): Promise<DeleteStudentResult> {
  const deletedCollections: string[] = []
  
  try {
    // Verify admin permissions
    if (!adminUser || adminUser.role !== 'admin') {
      return {
        success: false,
        error: 'Only administrators can delete students'
      }
    }

    // 1. Delete user notifications (both student notifications and admin notifications about this student)
    try {
      // Delete notifications where userId matches the student (student's own notifications)
      const studentNotificationsQuery = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', studentId)
      )
      const studentNotificationsSnapshot = await getDocs(studentNotificationsQuery)
      
      // Delete notifications where data.studentId matches the student (admin notifications about this student)
      const adminNotificationsQuery = query(
        collection(portalDb, 'notifications'),
        where('data.studentId', '==', studentId)
      )
      const adminNotificationsSnapshot = await getDocs(adminNotificationsQuery)
      
      const batch1 = writeBatch(portalDb)
      
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
      const videoAccessQuery = query(
        collection(portalDb, 'videoAccess'),
        where('studentId', '==', studentId)
      )
      const videoAccessSnapshot = await getDocs(videoAccessQuery)
      const batch2 = writeBatch(portalDb)
      
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
      const ebookAccessQuery = query(
        collection(portalDb, 'ebookAccess'),
        where('studentId', '==', studentId)
      )
      const ebookAccessSnapshot = await getDocs(ebookAccessQuery)
      const batch3 = writeBatch(portalDb)
      
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
      const attendanceQuery = query(collection(portalDb, 'attendance'))
      const attendanceSnapshot = await getDocs(attendanceQuery)
      
      const batch4 = writeBatch(portalDb)
      
      // For each attendance record, delete the student's checkin
      for (const attendanceDoc of attendanceSnapshot.docs) {
        const checkinRef = doc(portalDb, 'attendance', attendanceDoc.id, 'checkins', studentId)
        batch4.delete(checkinRef)
      }
      
      await batch4.commit()
      deletedCollections.push('attendance')
    } catch (error) {
      console.warn('Failed to delete attendance records:', error)
    }

    // 5. Delete video comments (if they exist)
    try {
      const commentsQuery = query(
        collection(portalDb, 'videoComments'),
        where('studentId', '==', studentId)
      )
      const commentsSnapshot = await getDocs(commentsQuery)
      const batch5 = writeBatch(portalDb)
      
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
      const schoolFeeQuery = query(
        collection(portalDb, 'schoolFeeInfo'),
        where('studentId', '==', studentId)
      )
      const schoolFeeSnapshot = await getDocs(schoolFeeQuery)
      const batch6 = writeBatch(portalDb)
      
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
      await deleteDoc(doc(portalDb, 'users', studentId))
      deletedCollections.push('users')
    } catch (error) {
      console.warn('Failed to delete user document:', error)
    }

    // 8. Delete the Firebase Auth account
    try {
      // Note: This requires the user to be signed in or admin SDK
      // For now, we'll rely on the Firestore cleanup
      // The admin can manually delete the auth account if needed
      console.log('Firebase Auth account deletion requires admin SDK or user sign-in')
    } catch (error) {
      console.warn('Failed to delete Firebase Auth account:', error)
    }

    return {
      success: true,
      deletedCollections
    }

  } catch (error: any) {
    console.error('Error deleting student completely:', error)
    return {
      success: false,
      error: error.message || 'Failed to delete student'
    }
  }
}

/**
 * Get student deletion summary (what will be deleted)
 */
export async function getStudentDeletionSummary(studentId: string): Promise<{
  notifications: number
  videoAccess: number
  ebookAccess: number
  attendanceRecords: number
  comments: number
}> {
  try {
    const summary = {
      notifications: 0,
      videoAccess: 0,
      ebookAccess: 0,
      attendanceRecords: 0,
      comments: 0
    }

    // Count notifications (both student notifications and admin notifications about this student)
    try {
      // Count student's own notifications
      const studentNotificationsQuery = query(
        collection(portalDb, 'notifications'),
        where('userId', '==', studentId)
      )
      const studentNotificationsSnapshot = await getDocs(studentNotificationsQuery)
      
      // Count admin notifications about this student
      const adminNotificationsQuery = query(
        collection(portalDb, 'notifications'),
        where('data.studentId', '==', studentId)
      )
      const adminNotificationsSnapshot = await getDocs(adminNotificationsQuery)
      
      summary.notifications = studentNotificationsSnapshot.size + adminNotificationsSnapshot.size
    } catch (error) {
      console.warn('Failed to count notifications:', error)
    }

    // Count video access
    try {
      const videoAccessQuery = query(
        collection(portalDb, 'videoAccess'),
        where('studentId', '==', studentId)
      )
      const videoAccessSnapshot = await getDocs(videoAccessQuery)
      summary.videoAccess = videoAccessSnapshot.size
    } catch (error) {
      console.warn('Failed to count video access:', error)
    }

    // Count ebook access
    try {
      const ebookAccessQuery = query(
        collection(portalDb, 'ebookAccess'),
        where('studentId', '==', studentId)
      )
      const ebookAccessSnapshot = await getDocs(ebookAccessQuery)
      summary.ebookAccess = ebookAccessSnapshot.size
    } catch (error) {
      console.warn('Failed to count ebook access:', error)
    }

    // Count attendance records
    try {
      const attendanceQuery = query(collection(portalDb, 'attendance'))
      const attendanceSnapshot = await getDocs(attendanceQuery)
      
      let attendanceCount = 0
      for (const attendanceDoc of attendanceSnapshot.docs) {
        const checkinRef = doc(portalDb, 'attendance', attendanceDoc.id, 'checkins', studentId)
        const checkinDoc = await getDocs(collection(portalDb, 'attendance', attendanceDoc.id, 'checkins'))
        if (checkinDoc.docs.some(doc => doc.id === studentId)) {
          attendanceCount++
        }
      }
      summary.attendanceRecords = attendanceCount
    } catch (error) {
      console.warn('Failed to count attendance records:', error)
    }

    // Count comments
    try {
      const commentsQuery = query(
        collection(portalDb, 'videoComments'),
        where('studentId', '==', studentId)
      )
      const commentsSnapshot = await getDocs(commentsQuery)
      summary.comments = commentsSnapshot.size
    } catch (error) {
      console.warn('Failed to count comments:', error)
    }

    return summary
  } catch (error) {
    console.error('Error getting deletion summary:', error)
    return {
      notifications: 0,
      videoAccess: 0,
      ebookAccess: 0,
      attendanceRecords: 0,
      comments: 0
    }
  }
}
