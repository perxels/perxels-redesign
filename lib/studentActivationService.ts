import {
  collection,
  getDocs,
  query,
  where,
  writeBatch,
  serverTimestamp,
  Timestamp,
  doc,
  updateDoc,
} from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'

const BATCH_SIZE = 500

interface ActivationResult {
  success: boolean
  activated: number
  skipped: number
  errors: string[]
  duration: number
}

interface StudentData {
  uid: string
  role: string
  onboardingComplete: boolean
  createdAt: any
  isStudentActive?: boolean
  studentActivatedAt?: any
  deactivationReason?: string
  studentDeactivatedAt?: any
}

export class StudentActivationService {
  static async activateEligibleStudents(): Promise<ActivationResult> {
    const startTime = Date.now()
    const errors: string[] = []
    let activatedCount = 0
    let skippedCount = 0

    try {
      // Query for eligible students based on your schema
      const usersQuery = query(
        collection(portalDb, 'users'),
        where('role', '==', 'student'),
        where('onboardingComplete', '==', true),
      )

      const querySnapshot = await getDocs(usersQuery)

      if (querySnapshot.empty) {
        return {
          success: true,
          activated: 0,
          skipped: 0,
          errors: ['No eligible students found'],
          duration: Date.now() - startTime,
        }
      }

      // Process in batches
      const batches = []
      let currentBatch = writeBatch(portalDb)
      let operationCount = 0

      for (const doc of querySnapshot.docs) {
        const userData = doc.data() as StudentData

        // Skip if already properly activated with timestamp
        if (userData.isStudentActive && userData.studentActivatedAt) {
          skippedCount++
          continue
        }
        // SAFER: Only activate if not explicitly deactivated
        // Incase User has been DeActivated..
        const shouldActivate =
          !userData.isStudentActive && !userData.studentDeactivatedAt

        if (!shouldActivate) {
          skippedCount++
          continue
        }

        // Determine activation date (use createdAt as onboardingCompletedAt doesn't exist)
        const activationDate = userData.createdAt?.seconds
          ? new Timestamp(
              userData.createdAt.seconds,
              userData.createdAt.nanoseconds,
            )
          : serverTimestamp()

        // Prepare update data
        const updateData: any = {
          isStudentActive: true,
          studentActivatedAt: activationDate,
          lastUpdated: serverTimestamp(),
        }

        // Clear deactivation fields if they exist
        if (userData.deactivationReason !== undefined) {
          updateData.deactivationReason = null
        }
        if (userData.studentDeactivatedAt !== undefined) {
          updateData.studentDeactivatedAt = null
        }

        currentBatch.update(doc.ref, updateData)
        operationCount++
        activatedCount++

        // Commit batch when reaching limit
        if (operationCount >= BATCH_SIZE) {
          batches.push(currentBatch.commit())
          currentBatch = writeBatch(portalDb)
          operationCount = 0
        }
      }

      // Commit final batch
      if (operationCount > 0) {
        batches.push(currentBatch.commit())
      }

      // Execute all batches
      if (batches.length > 0) {
        await Promise.all(batches)
      }

      const duration = Date.now() - startTime

      return {
        success: true,
        activated: activatedCount,
        skipped: skippedCount,
        errors,
        duration,
      }
    } catch (error) {
      console.error('Bulk activation error:', error)
      const duration = Date.now() - startTime

      return {
        success: false,
        activated: activatedCount,
        skipped: skippedCount,
        errors: [this.getErrorMessage(error)],
        duration,
      }
    }
  }

  // New method to handle individual student activation/deactivation
  static async updateStudentStatus(
    studentId: string,
    isActive: boolean,
    reason?: string,
  ): Promise<boolean> {
    try {
      const updateData: any = {
        isStudentActive: isActive,
        lastUpdated: serverTimestamp(),
      }

      if (isActive) {
        // Activating - set activation date and clear deactivation fields
        updateData.studentActivatedAt = serverTimestamp()
        updateData.deactivationReason = null
        updateData.studentDeactivatedAt = null
      } else {
        // Deactivating - set deactivation date and reason
        updateData.studentDeactivatedAt = serverTimestamp()
        if (reason) {
          updateData.deactivationReason = reason
        }
      }

      await updateDoc(doc(portalDb, 'users', studentId), updateData)
      return true
    } catch (error) {
      console.error('Error updating student status:', error)
      return false
    }
  }

  private static getErrorMessage(error: unknown): string {
    if (error instanceof Error) {
      return error.message
    }
    return 'Unknown error occurred during bulk activation'
  }

  // Preview function
  static async previewActivation(): Promise<{
    eligible: number
    alreadyActive: number
    totalStudents: number
  }> {
    const usersQuery = query(
      collection(portalDb, 'users'),
      where('role', '==', 'student'),
      where('onboardingComplete', '==', true),
    )

    const querySnapshot = await getDocs(usersQuery)
    let eligible = 0
    let alreadyActive = 0

    querySnapshot.forEach((doc) => {
      const userData = doc.data() as StudentData
      if (userData.isStudentActive && userData.studentActivatedAt) {
        alreadyActive++
      } else {
        eligible++
      }
    })

    return {
      eligible,
      alreadyActive,
      totalStudents: querySnapshot.size,
    }
  }
}
