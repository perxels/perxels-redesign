import type { NextApiRequest, NextApiResponse } from 'next'
import { getFirestore } from 'firebase-admin/firestore'
import { getAuth } from 'firebase-admin/auth'
import { initializeApp, cert, getApps } from 'firebase-admin/app'

// Initialize Firebase Admin SDK (You might already have this elsewhere)
if (!getApps().length) {
  initializeApp({
    credential: cert({
      projectId: process.env.FIREBASE_PROJECT_ID,
      clientEmail: process.env.FIREBASE_CLIENT_EMAIL,
      privateKey: process.env.FIREBASE_PRIVATE_KEY?.replace(/\\n/g, '\n'), // Fixed regex
    }),
  })
}

const db = getFirestore()
const auth = getAuth()

interface DeleteFacilitatorRequest {
  facilitatorId: string
  adminUserId: string
}

interface DeleteFacilitatorResponse {
  success: boolean
  message?: string
  error?: string
  deletedCollections?: string[]
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DeleteFacilitatorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { facilitatorId, adminUserId } = req.body as DeleteFacilitatorRequest

    // Validate inputs
    if (!facilitatorId || !adminUserId) {
      return res.status(400).json({
        success: false,
        error: 'Facilitator ID and Admin User ID are required',
      })
    }

    // Verify admin permissions
    const adminUserDoc = await db.collection('users').doc(adminUserId).get()
    if (!adminUserDoc.exists || adminUserDoc.data()?.role !== 'admin') {
      return res.status(403).json({
        success: false,
        error: 'Only administrators can delete facilitators',
      })
    }

    const deletedCollections: string[] = []

    // 1. CLEANUP: Remove facilitator from any cohorts they are assigned to
    // This is crucial to maintain data integrity in your cohorts
    try {
      // First, find all cohorts that reference this facilitator
      const cohortsQuery = db
        .collection('cohorts')
        .where('facilitators', 'array-contains', facilitatorId)
      const cohortsSnapshot = await cohortsQuery.get()

      const batch = db.batch()

      // For each cohort, remove this facilitator from the 'facilitators' array
      for (const cohortDoc of cohortsSnapshot.docs) {
        const cohortData = cohortDoc.data()
        const updatedFacilitators = (cohortData.facilitators || []).filter(
          (id: string) => id !== facilitatorId,
        )

        batch.update(cohortDoc.ref, { facilitators: updatedFacilitators })
      }

      await batch.commit()
      console.log(
        `✅ Removed facilitator from ${cohortsSnapshot.size} cohort(s)`,
      )
      deletedCollections.push('cohorts_updated')
    } catch (error) {
      console.warn('Failed to remove facilitator from cohorts:', error)
      // Don't fail the entire operation for this - it's cleanup
    }

    // 2. CLEANUP: Delete any facilitator-specific assignments
    // (This assumes you might have an 'assignments' subcollection or separate collection)
    try {
      // Example: If you have a collection for class plan assignments
      const assignmentsQuery = db
        .collection('classPlanAssignments')
        .where('facilitatorId', '==', facilitatorId)
      const assignmentsSnapshot = await assignmentsQuery.get()

      const batch = db.batch()
      assignmentsSnapshot.docs.forEach((doc) => {
        batch.delete(doc.ref)
      })

      await batch.commit()
      if (assignmentsSnapshot.size > 0) {
        deletedCollections.push('classPlanAssignments')
      }
    } catch (error) {
      console.warn('Failed to delete facilitator assignments:', error)
    }

    // 3. Delete the main user document from 'users' collection
    try {
      await db.collection('users').doc(facilitatorId).delete()
      deletedCollections.push('users')
      console.log('✅ User document deleted from Firestore')
    } catch (error: any) {
      console.warn('Failed to delete user document:', error)
      // If the document doesn't exist, we can still proceed
      if (error.code !== 'not-found') {
        throw error
      }
    }

    // 4. Delete the Firebase Auth account (THE CORE OPERATION)
    try {
      await auth.deleteUser(facilitatorId)
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
      message: 'Facilitator deleted successfully',
      deletedCollections,
    })
  } catch (error: any) {
    console.error('Error deleting facilitator:', error)
    return res.status(500).json({
      success: false,
      error: error.message || 'Failed to delete facilitator',
    })
  }
}
