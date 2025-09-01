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
    // Handle different Firebase Storage URL formats
    let filePath: string | null = null
    
    // Try to extract path from URL
    try {
      const url = new URL(fileUrl)
      
      // Method 1: Standard Firebase Storage URL format
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/)
      if (pathMatch) {
        filePath = decodeURIComponent(pathMatch[1])
      }
      
      // Method 2: Alternative format (some Firebase URLs might have different patterns)
      if (!filePath) {
        const altPathMatch = url.pathname.match(/\/v0\/b\/[^\/]+\/o\/(.+?)\?/)
        if (altPathMatch) {
          filePath = decodeURIComponent(altPathMatch[1])
        }
      }
      
      // Method 3: Direct path extraction (fallback)
      if (!filePath) {
        // Try to extract from the full pathname
        const segments = url.pathname.split('/')
        const oIndex = segments.indexOf('o')
        if (oIndex !== -1 && segments[oIndex + 1]) {
          filePath = decodeURIComponent(segments[oIndex + 1])
        }
      }
    } catch (urlError) {
      console.warn('Failed to parse URL:', urlError)
    }
    
    // If URL parsing failed, try to extract path using regex directly
    if (!filePath) {
      const directPathMatch = fileUrl.match(/\/o\/([^?]+)/)
      if (directPathMatch) {
        filePath = decodeURIComponent(directPathMatch[1])
      }
    }
    
    // If still no path found, try alternative patterns
    if (!filePath) {
      const altMatch = fileUrl.match(/\/v0\/b\/[^\/]+\/o\/([^?]+)/)
      if (altMatch) {
        filePath = decodeURIComponent(altMatch[1])
      }
    }
    
    // If we still can't extract the path, throw a more descriptive error
    if (!filePath) {
      console.error('Unable to extract file path from URL:', fileUrl)
      throw new Error(`Invalid Firebase Storage URL format: ${fileUrl}`)
    }
    
    // Create storage reference
    const storageRef = ref(storage, filePath)
    
    // Delete the file
    await deleteObject(storageRef)
    
    return true
  } catch (error) {
    console.error('Error deleting file from Firebase Storage:', error)
    
    // If it's a "not found" error, we can consider it successful (file already deleted)
    if (error instanceof Error && error.message.includes('not found')) {
      console.warn('File not found in storage (may have been already deleted):', fileUrl)
      return true
    }
    
    throw new Error(`Failed to delete file from storage: ${error instanceof Error ? error.message : 'Unknown error'}`)
  }
}

/**
 * Extract file path from Firebase Storage URL
 */
export function extractFilePathFromUrl(fileUrl: string): string | null {
  try {
    // Try multiple URL parsing methods
    let filePath: string | null = null
    
    // Method 1: Standard URL parsing
    try {
      const url = new URL(fileUrl)
      const pathMatch = url.pathname.match(/\/o\/(.+?)\?/)
      if (pathMatch) {
        filePath = decodeURIComponent(pathMatch[1])
      }
    } catch (urlError) {
      console.warn('Failed to parse URL with URL constructor:', urlError)
    }
    
    // Method 2: Direct regex on string
    if (!filePath) {
      const directPathMatch = fileUrl.match(/\/o\/([^?]+)/)
      if (directPathMatch) {
        filePath = decodeURIComponent(directPathMatch[1])
      }
    }
    
    // Method 3: Alternative Firebase URL format
    if (!filePath) {
      const altMatch = fileUrl.match(/\/v0\/b\/[^\/]+\/o\/([^?]+)/)
      if (altMatch) {
        filePath = decodeURIComponent(altMatch[1])
      }
    }
    
    return filePath
  } catch (error) {
    console.error('Error extracting file path from URL:', error)
    return null
  }
}
