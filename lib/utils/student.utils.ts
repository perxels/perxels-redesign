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
  try {
    // Verify admin permissions
    if (!adminUser || adminUser.role !== 'admin') {
      return {
        success: false,
        error: 'Only administrators can delete students'
      }
    }

    // Call the API endpoint that handles complete deletion including Firebase Auth
    const response = await fetch('/api/delete-student', {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        studentId,
        adminUserId: adminUser.uid
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to delete student'
      }
    }

    return {
      success: true,
      deletedCollections: result.deletedCollections || []
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
