import {
  collection,
  query,
  where,
  getDocs,
  doc,
  getDoc,
  writeBatch,
} from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig' // Adjust path

export interface DeleteFacilitatorResult {
  success: boolean
  error?: string
  deletedCollections?: string[]
}

export interface DeletionSummary {
  userProfile: number // Always 1
  authAccount: number // Always 1
  assignedItems: number
}

/**
 * INITIATES complete facilitator deletion via a secure API route.
 * This is the only function the client should call.
 */
export async function deleteFacilitatorCompletely(
  facilitatorId: string,
  adminUserId: string, // Pass admin ID for verification on the server
): Promise<DeleteFacilitatorResult> {
  try {
    const response = await fetch('/api/delete-facilitator', {
      // NOTE: We will create this API route
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
      body: JSON.stringify({
        facilitatorId,
        adminUserId, // Let the server verify who is making this request
      }),
    })

    const result = await response.json()

    if (!response.ok) {
      return {
        success: false,
        error: result.error || 'Failed to delete facilitator',
      }
    }

    return {
      success: true,
      deletedCollections: result.deletedCollections || [],
    }
  } catch (error: any) {
    console.error('Error calling delete API:', error)
    return {
      success: false,
      error:
        error.message ||
        'Network error. Could not connect to deletion service.',
    }
  }
}

/**
 * Calculates what will be deleted (for the summary modal)
 * This only counts Firestore data. The Auth account deletion is a given.
 */
export async function getFacilitatorDeletionSummary(
  facilitatorId: string,
): Promise<DeletionSummary> {
  const summary: DeletionSummary = {
    userProfile: 1, // The document in the 'users' collection
    authAccount: 1, // The account in Firebase Auth (handled by API)
    assignedItems: 0,
  }

  try {
    // 1. Get the user document using getDoc (for a single document)
    const userDocRef = doc(portalDb, 'users', facilitatorId)
    const userDocSnap = await getDoc(userDocRef)

    // 2. Check if it exists and count the assignments
    if (userDocSnap.exists()) {
      const data = userDocSnap.data()
      // Count the number of objects in the 'assigned' array
      summary.assignedItems = data?.assigned?.length || 0
    }

    return summary
  } catch (error) {
    console.error('Error getting facilitator deletion summary:', error)
    // Return the base summary (profile + auth) even if counting fails
    return summary
  }
}

/**
 * OPTIONAL: Client-side cleanup of Firestore data.
 * WARNING: This should ideally be called FROM THE API ROUTE, not the client.
 * It's included here for reference if your API route uses similar logic.
 */
async function _deleteFacilitatorFirestoreData(
  facilitatorId: string,
): Promise<string[]> {
  const deletedCollections: string[] = []
  const batch = writeBatch(portalDb)

  try {
    // 1. Delete the main user document
    const userDocRef = doc(portalDb, 'users', facilitatorId)
    batch.delete(userDocRef)
    deletedCollections.push('users')

    // 2. Delete assignments (example - if stored in a separate collection)
    // const assignmentsQuery = query(collection(portalDb, 'assignments'), where('facilitatorId', '==', facilitatorId));
    // const assignmentsSnapshot = await getDocs(assignmentsQuery);
    // assignmentsSnapshot.forEach((doc) => {
    //   batch.delete(doc.ref);
    // });
    // if (assignmentsSnapshot.size > 0) {
    //   deletedCollections.push('assignments');
    // }

    // 3. Add cleanup for other facilitator-related data...

    await batch.commit()
    return deletedCollections
  } catch (error) {
    console.error('Error in Firestore cleanup:', error)
    throw new Error('Failed to clean up facilitator data in database.')
  }
}
