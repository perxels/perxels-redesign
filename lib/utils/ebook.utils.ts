import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy, updateDoc, increment, serverTimestamp, deleteDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { PortalEbook, EbookAccess, EbookAccessRequest, EbookAccessResponse } from '../../types/ebook.types'

/**
 * Generate a unique 6-character access code
 */
export function generateAccessCode(): string {
  const chars = 'ABCDEFGHIJKLMNOPQRSTUVWXYZ0123456789'
  let result = ''
  for (let i = 0; i < 6; i++) {
    result += chars.charAt(Math.floor(Math.random() * chars.length))
  }
  return result
}

/**
 * Check if an access code is unique
 */
export async function isAccessCodeUnique(code: string): Promise<boolean> {
  const q = query(
    collection(portalDb, 'portalEbooks'),
    where('accessCode', '==', code.toUpperCase()),
    where('isActive', '==', true)
  )
  const snapshot = await getDocs(q)
  return snapshot.empty
}

/**
 * Generate a guaranteed unique access code
 */
export async function generateUniqueAccessCode(): Promise<string> {
  let code = generateAccessCode()
  let attempts = 0
  const maxAttempts = 10

  while (!(await isAccessCodeUnique(code)) && attempts < maxAttempts) {
    code = generateAccessCode()
    attempts++
  }

  if (attempts >= maxAttempts) {
    throw new Error('Unable to generate unique access code')
  }

  return code
}

/**
 * Create a new ebook
 */
// Helper function to remove undefined values from objects
function removeUndefinedValues(obj: any): any {
  const cleaned: any = {}
  for (const [key, value] of Object.entries(obj)) {
    if (value !== undefined) {
      cleaned[key] = value
    }
  }
  return cleaned
}

export async function createEbook(ebook: Omit<PortalEbook, 'id' | 'accessCode' | 'datePosted' | 'downloadCount'>): Promise<PortalEbook> {
  const accessCode = await generateUniqueAccessCode()
  
  const newEbook: PortalEbook = {
    ...ebook,
    id: '', // Will be set by Firestore
    accessCode: accessCode.toUpperCase(),
    datePosted: new Date(),
    downloadCount: 0,
    isActive: true,
  }

  const ebookRef = doc(collection(portalDb, 'portalEbooks'))
  
  // Clean the data before saving to Firestore
  const cleanedEbook = removeUndefinedValues({
    ...newEbook,
    id: ebookRef.id,
    datePosted: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })
  
  await setDoc(ebookRef, cleanedEbook)

  return { ...newEbook, id: ebookRef.id }
}

/**
 * Get an ebook by its access code
 */
export async function getEbookByAccessCode(accessCode: string): Promise<PortalEbook | null> {
  const q = query(
    collection(portalDb, 'portalEbooks'),
    where('accessCode', '==', accessCode.toUpperCase()),
    where('isActive', '==', true)
  )
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as PortalEbook
}

/**
 * Get all ebooks (admin only)
 */
export async function getAllEbooks(): Promise<PortalEbook[]> {
  const q = query(
    collection(portalDb, 'portalEbooks'),
    orderBy('datePosted', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalEbook))
}

/**
 * Get ebooks accessible to a specific student
 */
export async function getStudentEbooks(studentId: string): Promise<PortalEbook[]> {
  // Get all ebook access records for this student
  const accessQuery = query(
    collection(portalDb, 'ebookAccess'),
    where('studentId', '==', studentId),
    where('isRevoked', '!=', true)
  )
  const accessSnapshot = await getDocs(accessQuery)
  
  if (accessSnapshot.empty) {
    return []
  }

  // Get the ebook IDs
  const ebookIds = accessSnapshot.docs.map(doc => doc.data().ebookId)
  
  // Fetch the actual ebooks (in batches of 10 due to Firestore 'in' limit)
  const ebooks: PortalEbook[] = []
  const batchSize = 10
  
  for (let i = 0; i < ebookIds.length; i += batchSize) {
    const batchIds = ebookIds.slice(i, i + batchSize)
    const ebooksQuery = query(
      collection(portalDb, 'portalEbooks'),
      where('__name__', 'in', batchIds),
      where('isActive', '==', true)
    )
    const ebooksSnapshot = await getDocs(ebooksQuery)
    ebooks.push(...ebooksSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalEbook)))
  }

  return ebooks.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime())
}

/**
 * Get all ebooks with access status for a student
 */
export async function getAllEbooksWithAccessStatus(studentId: string): Promise<Array<PortalEbook & { hasAccess: boolean }>> {
  try {
    // Get all active ebooks
    const allEbooks = await getAllEbooks()
    const activeEbooks = allEbooks.filter(ebook => ebook.isActive)
    
    // Get student's ebook access records
    const accessQuery = query(
      collection(portalDb, 'ebookAccess'),
      where('studentId', '==', studentId),
      where('isRevoked', '!=', true)
    )
    const accessSnapshot = await getDocs(accessQuery)
    
    // Create a set of ebook IDs the student has access to
    const accessibleEbookIds = new Set(
      accessSnapshot.docs.map(doc => doc.data().ebookId)
    )
    
    // Return ebooks with access status
    return activeEbooks.map(ebook => ({
      ...ebook,
      hasAccess: accessibleEbookIds.has(ebook.id)
    }))
  } catch (error) {
    console.error('Error getting ebooks with access status:', error)
    return []
  }
}

/**
 * Grant ebook access to a student using access code
 */
export async function grantEbookAccess(request: EbookAccessRequest): Promise<EbookAccessResponse> {
  try {
    // Find ebook by access code
    const ebook = await getEbookByAccessCode(request.accessCode)
    
    if (!ebook) {
      return {
        success: false,
        error: 'Invalid access code. Please check and try again.'
      }
    }

    // Check if student already has access
    const existingAccess = await getEbookAccess(ebook.id, request.studentId)
    if (existingAccess && !existingAccess.isRevoked) {
      return {
        success: true,
        ebook,
        message: 'You already have access to this ebook!'
      }
    }

    // Check access limits
    if (ebook.maxAccess) {
      const currentAccess = await getEbookAccessCount(ebook.id)
      if (currentAccess >= ebook.maxAccess) {
        return {
          success: false,
          error: 'This ebook has reached its maximum access limit.'
        }
      }
    }

    // Get student info
    const studentDoc = await getDoc(doc(portalDb, 'users', request.studentId))
    if (!studentDoc.exists()) {
      return {
        success: false,
        error: 'Student not found.'
      }
    }

    const studentData = studentDoc.data()
    
    // Create access record
    const accessId = `${ebook.id}_${request.studentId}`
    const accessRecord: EbookAccess = {
      id: accessId,
      ebookId: ebook.id,
      studentId: request.studentId,
      studentName: studentData.fullName || 'Unknown',
      studentEmail: studentData.email || '',
      accessGrantedAt: new Date(),
      downloadCount: 0,
      isRevoked: false
    }

    const accessRef = doc(portalDb, 'ebookAccess', accessId)
    await setDoc(accessRef, {
      ...accessRecord,
      accessGrantedAt: serverTimestamp()
    })

    return {
      success: true,
      ebook,
      message: 'Access granted successfully! You can now download this ebook.'
    }
  } catch (error) {
    console.error('Error granting ebook access:', error)
    return {
      success: false,
      error: 'An error occurred while granting access. Please try again.'
    }
  }
}

/**
 * Get ebook access record for a specific student
 */
export async function getEbookAccess(ebookId: string, studentId: string): Promise<EbookAccess | null> {
  const accessId = `${ebookId}_${studentId}`
  const accessDoc = await getDoc(doc(portalDb, 'ebookAccess', accessId))
  
  if (!accessDoc.exists()) {
    return null
  }

  return { id: accessDoc.id, ...accessDoc.data() } as EbookAccess
}

/**
 * Get access count for an ebook
 */
export async function getEbookAccessCount(ebookId: string): Promise<number> {
  const q = query(
    collection(portalDb, 'ebookAccess'),
    where('ebookId', '==', ebookId),
    where('isRevoked', '!=', true)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

/**
 * Record a download for an ebook
 */
export async function recordEbookDownload(ebookId: string, studentId: string): Promise<void> {
  const accessId = `${ebookId}_${studentId}`
  
  // Update access record
  await updateDoc(doc(portalDb, 'ebookAccess', accessId), {
    downloadCount: increment(1),
    lastDownloadedAt: serverTimestamp()
  })

  // Update ebook download count
  await updateDoc(doc(portalDb, 'portalEbooks', ebookId), {
    downloadCount: increment(1)
  })
}

/**
 * Get access list for an ebook (admin only)
 */
export async function getEbookAccessList(ebookId: string): Promise<EbookAccess[]> {
  const q = query(
    collection(portalDb, 'ebookAccess'),
    where('ebookId', '==', ebookId),
    orderBy('accessGrantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as EbookAccess))
}

/**
 * Revoke ebook access for a student
 */
export async function revokeEbookAccess(ebookId: string, studentId: string): Promise<void> {
  const accessId = `${ebookId}_${studentId}`
  await updateDoc(doc(portalDb, 'ebookAccess', accessId), {
    isRevoked: true,
    revokedAt: serverTimestamp()
  })
}

/**
 * Check if student has access to an ebook
 */
export async function hasEbookAccess(ebookId: string, studentId: string): Promise<boolean> {
  const access = await getEbookAccess(ebookId, studentId)
  return access !== null && !access.isRevoked
}

/**
 * Update ebook
 */
export async function updateEbook(ebookId: string, updates: Partial<PortalEbook>): Promise<void> {
  // Clean the updates before saving to Firestore
  const cleanedUpdates = removeUndefinedValues({
    ...updates,
    updatedAt: serverTimestamp()
  })
  
  await updateDoc(doc(portalDb, 'portalEbooks', ebookId), cleanedUpdates)
}

/**
 * Toggle ebook active status
 */
export async function toggleEbookStatus(ebookId: string, isActive: boolean): Promise<void> {
  await updateDoc(doc(portalDb, 'portalEbooks', ebookId), {
    isActive,
    updatedAt: serverTimestamp()
  })
}

/**
 * Delete ebook (soft delete by setting isActive to false)
 */
export async function deleteEbook(ebookId: string): Promise<void> {
  await updateDoc(doc(portalDb, 'portalEbooks', ebookId), {
    isActive: false,
    updatedAt: serverTimestamp()
  })
}

/**
 * Get ebook statistics
 */
export async function getEbookStats(): Promise<{
  totalEbooks: number
  activeEbooks: number
  totalDownloads: number
  totalAccess: number
}> {
  const ebooks = await getAllEbooks()
  const activeEbooks = ebooks.filter(ebook => ebook.isActive)
  
  const totalDownloads = ebooks.reduce((sum, ebook) => sum + ebook.downloadCount, 0)
  
  // Calculate total access count using Promise.all for better performance
  const accessCountPromises = ebooks.map(ebook => getEbookAccessCount(ebook.id))
  const accessCounts = await Promise.all(accessCountPromises)
  const totalAccess = accessCounts.reduce((sum, count) => sum + count, 0)

  return {
    totalEbooks: ebooks.length,
    activeEbooks: activeEbooks.length,
    totalDownloads,
    totalAccess
  }
}

/**
 * Delete ebook and all related data
 */
export async function deleteEbookCompletely(ebookId: string): Promise<{
  success: boolean
  error?: string
  deletedFiles?: string[]
}> {
  try {
    // Get the ebook data first
    const ebook = await getEbookById(ebookId)
    if (!ebook) {
      return {
        success: false,
        error: 'Ebook not found'
      }
    }

    const deletedFiles: string[] = []

    // Delete files from Firebase Storage
    try {
      // Delete main file
      if (ebook.fileUrl) {
        await deleteFromFirebaseStorage(ebook.fileUrl)
        deletedFiles.push(ebook.fileUrl)
      }

      // Delete thumbnail if exists
      if (ebook.thumbnailUrl) {
        await deleteFromFirebaseStorage(ebook.thumbnailUrl)
        deletedFiles.push(ebook.thumbnailUrl)
      }
    } catch (firebaseError) {
      console.warn('Failed to delete from Firebase Storage:', firebaseError)
      // Continue with database cleanup even if Firebase deletion fails
    }

    // Delete all access records for this ebook
    try {
      const accessList = await getEbookAccessList(ebookId)
      const deletePromises = accessList.map(access => 
        deleteDoc(doc(portalDb, 'ebookAccess', access.id))
      )
      await Promise.all(deletePromises)
    } catch (accessError) {
      console.warn('Failed to delete access records:', accessError)
    }

    // Delete the ebook document
    await deleteDoc(doc(portalDb, 'portalEbooks', ebookId))

    return {
      success: true,
      deletedFiles
    }
  } catch (error) {
    console.error('Error deleting ebook completely:', error)
    return {
      success: false,
      error: 'Failed to delete ebook completely'
    }
  }
}



/**
 * Delete file from Firebase Storage
 */
async function deleteFromFirebaseStorage(fileUrl: string): Promise<void> {
  try {
    const { deleteFileFromFirebase } = await import('./firebase-storage.utils')
    await deleteFileFromFirebase(fileUrl)
  } catch (error) {
    console.error('Error deleting from Firebase Storage:', error)
    throw error
  }
}

/**
 * Get ebook by ID
 */
export async function getEbookById(ebookId: string): Promise<PortalEbook | null> {
  try {
    const ebookDoc = await getDoc(doc(portalDb, 'portalEbooks', ebookId))
    
    if (!ebookDoc.exists()) {
      return null
    }

    return { id: ebookDoc.id, ...ebookDoc.data() } as PortalEbook
  } catch (error) {
    console.error('Error getting ebook by ID:', error)
    return null
  }
}
