import { ref, uploadBytes, getDownloadURL, deleteObject } from 'firebase/storage'
import { storage } from '../../firebaseConfig'

/**
 * Upload file to Firebase Storage (library storage)
 */
export async function uploadFileToFirebase(
  file: File,
  folder: string = 'portal/ebooks'
): Promise<string> {
  try {
    // Generate unique filename
    const timestamp = Date.now()
    const fileNameWithoutExt = file.name.replace(/\.[^/.]+$/, '')
    const cleanFileName = fileNameWithoutExt.replace(/[^a-zA-Z0-9-_]/g, '-').toLowerCase()
    const fileExtension = file.name.split('.').pop()
    const uniqueFileName = `${timestamp}-${cleanFileName}.${fileExtension}`
    
    // Create storage reference
    const storageRef = ref(storage, `${folder}/${uniqueFileName}`)
    
    // Upload file
    const snapshot = await uploadBytes(storageRef, file)
    
    // Get download URL
    const downloadURL = await getDownloadURL(snapshot.ref)
    
    return downloadURL
  } catch (error) {
    console.error('Error uploading file to Firebase Storage:', error)
    throw new Error('Failed to upload file to storage')
  }
}

/**
 * Delete file from Firebase Storage
 */
export async function deleteFileFromFirebase(fileUrl: string): Promise<boolean> {
  try {
    // Extract the file path from the URL
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+?)\?/)
    
    if (!pathMatch) {
      throw new Error('Invalid Firebase Storage URL')
    }
    
    // Decode the path (Firebase URLs are URL-encoded)
    const filePath = decodeURIComponent(pathMatch[1])
    
    // Create storage reference
    const storageRef = ref(storage, filePath)
    
    // Delete the file
    await deleteObject(storageRef)
    
    return true
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error)
    throw new Error('Failed to delete file from storage')
  }
}

/**
 * Extract file path from Firebase Storage URL
 */
export function extractFilePathFromUrl(fileUrl: string): string | null {
  try {
    const url = new URL(fileUrl)
    const pathMatch = url.pathname.match(/\/o\/(.+?)\?/)
    
    if (!pathMatch) {
      return null
    }
    
    return decodeURIComponent(pathMatch[1])
  } catch (error) {
    console.error('Error extracting file path from URL:', error)
    return null
  }
}
