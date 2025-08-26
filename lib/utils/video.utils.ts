import { doc, setDoc, getDoc, collection, getDocs, query, where, orderBy, updateDoc, increment, serverTimestamp } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { PortalVideo, VideoAccess, VideoAccessRequest, VideoAccessResponse } from '../../types/video.types'

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
    collection(portalDb, 'portalVideos'),
    where('accessCode', '==', code)
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
 * Create a new video
 */
export async function createVideo(video: Omit<PortalVideo, 'id' | 'accessCode' | 'datePosted' | 'viewCount'>): Promise<PortalVideo> {
  const accessCode = await generateUniqueAccessCode()
  const videoId = `video_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
  
  const newVideo: PortalVideo = {
    ...video,
    id: videoId,
    accessCode,
    datePosted: new Date(),
    viewCount: 0,
  }

  const videoRef = doc(portalDb, 'portalVideos', videoId)
  await setDoc(videoRef, {
    ...newVideo,
    datePosted: serverTimestamp(),
    updatedAt: serverTimestamp(),
  })

  return newVideo
}

/**
 * Get a video by its access code
 */
export async function getVideoByAccessCode(accessCode: string): Promise<PortalVideo | null> {
  const q = query(
    collection(portalDb, 'portalVideos'),
    where('accessCode', '==', accessCode.toUpperCase()),
    where('isActive', '==', true)
  )
  const snapshot = await getDocs(q)
  
  if (snapshot.empty) {
    return null
  }

  const doc = snapshot.docs[0]
  return { id: doc.id, ...doc.data() } as PortalVideo
}

/**
 * Get all videos (admin only)
 */
export async function getAllVideos(): Promise<PortalVideo[]> {
  const q = query(
    collection(portalDb, 'portalVideos'),
    orderBy('datePosted', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalVideo))
}

/**
 * Get videos accessible to a specific student
 */
export async function getStudentVideos(studentId: string): Promise<PortalVideo[]> {
  // Get all video access records for this student
  const accessQuery = query(
    collection(portalDb, 'videoAccess'),
    where('studentId', '==', studentId),
    where('isRevoked', '!=', true)
  )
  const accessSnapshot = await getDocs(accessQuery)
  
  if (accessSnapshot.empty) {
    return []
  }

  // Get the video IDs
  const videoIds = accessSnapshot.docs.map(doc => doc.data().videoId)
  
  // Fetch the actual videos (in batches of 10 due to Firestore 'in' limit)
  const videos: PortalVideo[] = []
  const batchSize = 10
  
  for (let i = 0; i < videoIds.length; i += batchSize) {
    const batchIds = videoIds.slice(i, i + batchSize)
    const videosQuery = query(
      collection(portalDb, 'portalVideos'),
      where('__name__', 'in', batchIds),
      where('isActive', '==', true)
    )
    const videosSnapshot = await getDocs(videosQuery)
    videos.push(...videosSnapshot.docs.map(doc => ({ id: doc.id, ...doc.data() } as PortalVideo)))
  }

  return videos.sort((a, b) => b.datePosted.getTime() - a.datePosted.getTime())
}

/**
 * Grant video access to a student using access code
 */
export async function grantVideoAccess(request: VideoAccessRequest): Promise<VideoAccessResponse> {
  try {
    // Find video by access code
    const video = await getVideoByAccessCode(request.accessCode)
    
    if (!video) {
      return {
        success: false,
        error: 'Invalid access code. Please check and try again.'
      }
    }

    // Check if student already has access
    const existingAccess = await getVideoAccess(video.id, request.studentId)
    if (existingAccess && !existingAccess.isRevoked) {
      return {
        success: true,
        video,
        message: 'You already have access to this video!'
      }
    }

    // Check access limits
    if (video.maxAccess) {
      const currentAccess = await getVideoAccessCount(video.id)
      if (currentAccess >= video.maxAccess) {
        return {
          success: false,
          error: 'This video has reached its maximum access limit.'
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
    const accessId = `${video.id}_${request.studentId}`
    const accessRecord: VideoAccess = {
      id: accessId,
      videoId: video.id,
      studentId: request.studentId,
      studentName: studentData.fullName || 'Unknown',
      studentEmail: studentData.email || '',
      accessGrantedAt: new Date(),
      watchCount: 0,
      isRevoked: false
    }

    const accessRef = doc(portalDb, 'videoAccess', accessId)
    await setDoc(accessRef, {
      ...accessRecord,
      accessGrantedAt: serverTimestamp()
    })

    return {
      success: true,
      video,
      message: 'Access granted successfully! You can now watch this video.'
    }
  } catch (error) {
    console.error('Error granting video access:', error)
    return {
      success: false,
      error: 'An error occurred while granting access. Please try again.'
    }
  }
}

/**
 * Get video access record for a specific student and video
 */
export async function getVideoAccess(videoId: string, studentId: string): Promise<VideoAccess | null> {
  const accessId = `${videoId}_${studentId}`
  const accessRef = doc(portalDb, 'videoAccess', accessId)
  const accessDoc = await getDoc(accessRef)
  
  if (!accessDoc.exists()) {
    return null
  }

  return accessDoc.data() as VideoAccess
}

/**
 * Get the number of students who have access to a video
 */
export async function getVideoAccessCount(videoId: string): Promise<number> {
  const q = query(
    collection(portalDb, 'videoAccess'),
    where('videoId', '==', videoId),
    where('isRevoked', '!=', true)
  )
  const snapshot = await getDocs(q)
  return snapshot.size
}

/**
 * Get all students who have access to a specific video
 */
export async function getVideoAccessList(videoId: string): Promise<VideoAccess[]> {
  const q = query(
    collection(portalDb, 'videoAccess'),
    where('videoId', '==', videoId),
    orderBy('accessGrantedAt', 'desc')
  )
  const snapshot = await getDocs(q)
  return snapshot.docs.map(doc => doc.data() as VideoAccess)
}

/**
 * Update video watch progress
 */
export async function updateVideoProgress(videoId: string, studentId: string, progressPercentage: number): Promise<void> {
  const accessId = `${videoId}_${studentId}`
  const accessRef = doc(portalDb, 'videoAccess', accessId)
  
  await updateDoc(accessRef, {
    lastWatchedAt: serverTimestamp(),
    progressPercentage: Math.max(0, Math.min(100, progressPercentage)), // Ensure 0-100 range
    watchCount: increment(1)
  })

  // Update video view count
  const videoRef = doc(portalDb, 'portalVideos', videoId)
  await updateDoc(videoRef, {
    viewCount: increment(1)
  })
}

/**
 * Revoke student access to a video
 */
export async function revokeVideoAccess(videoId: string, studentId: string): Promise<void> {
  const accessId = `${videoId}_${studentId}`
  const accessRef = doc(portalDb, 'videoAccess', accessId)
  
  await updateDoc(accessRef, {
    isRevoked: true,
    revokedAt: serverTimestamp()
  })
}

/**
 * Check if student has access to a video
 */
export async function hasVideoAccess(videoId: string, studentId: string): Promise<boolean> {
  const access = await getVideoAccess(videoId, studentId)
  return access !== null && !access.isRevoked
} 

/**
 * Get all videos with access status for a student
 */
export async function getAllVideosWithAccessStatus(studentId: string): Promise<Array<PortalVideo & { hasAccess: boolean }>> {
  try {
    // Get all active videos
    const allVideos = await getAllVideos()
    const activeVideos = allVideos.filter(video => video.isActive)
    
    // Get student's video access records
    const accessQuery = query(
      collection(portalDb, 'videoAccess'),
      where('studentId', '==', studentId),
      where('isRevoked', '!=', true)
    )
    const accessSnapshot = await getDocs(accessQuery)
    
    // Create a set of video IDs the student has access to
    const accessibleVideoIds = new Set(
      accessSnapshot.docs.map(doc => doc.data().videoId)
    )
    
    // Return videos with access status
    return activeVideos.map(video => ({
      ...video,
      hasAccess: accessibleVideoIds.has(video.id)
    }))
  } catch (error) {
    console.error('Error getting videos with access status:', error)
    return []
  }
} 

/**
 * Update a video
 */
export async function updateVideo(videoId: string, updates: Partial<PortalVideo>): Promise<void> {
  const videoRef = doc(portalDb, 'portalVideos', videoId)
  await updateDoc(videoRef, {
    ...updates,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Toggle video active status
 */
export async function toggleVideoStatus(videoId: string, isActive: boolean): Promise<void> {
  const videoRef = doc(portalDb, 'portalVideos', videoId)
  await updateDoc(videoRef, {
    isActive,
    updatedAt: serverTimestamp(),
  })
}

/**
 * Get a video by its ID
 */
export async function getVideoById(videoId: string): Promise<PortalVideo | null> {
  try {
    const videoRef = doc(portalDb, 'portalVideos', videoId)
    const videoDoc = await getDoc(videoRef)
    
    if (!videoDoc.exists()) {
      return null
    }

    return { id: videoDoc.id, ...videoDoc.data() } as PortalVideo
  } catch (error) {
    console.error('Error getting video by ID:', error)
    return null
  }
}

/**
 * Increment video view count
 */
export async function incrementVideoView(videoId: string, studentId: string): Promise<void> {
  try {
    // First check if the student has access
    const hasAccess = await hasVideoAccess(videoId, studentId)
    
    // Update video view count
    const videoRef = doc(portalDb, 'portalVideos', videoId)
    await updateDoc(videoRef, {
      viewCount: increment(1),
      lastViewedAt: serverTimestamp()
    })

    // Only update access record if student has access
    if (hasAccess) {
      const accessId = `${videoId}_${studentId}`
      const accessRef = doc(portalDb, 'videoAccess', accessId)
      const accessDoc = await getDoc(accessRef)
      
      if (accessDoc.exists()) {
        await updateDoc(accessRef, {
          watchCount: increment(1),
          lastWatchedAt: serverTimestamp()
        })
      }
    }
  } catch (error) {
    console.error('Error incrementing video view:', error)
    throw error // Re-throw to handle in component
  }
}

/**
 * Get video comments
 */
export async function getVideoComments(videoId: string): Promise<any[]> {
  try {
    const commentsQuery = query(
      collection(portalDb, 'videoComments'),
      where('videoId', '==', videoId),
      orderBy('createdAt', 'desc')
    )
    const snapshot = await getDocs(commentsQuery)
    return snapshot.docs.map(doc => ({ id: doc.id, ...doc.data() }))
  } catch (error) {
    console.error('Error getting video comments:', error)
    return []
  }
}

/**
 * Add a comment to a video
 */
export async function addComment(comment: {
  videoId: string
  studentId: string
  studentName: string
  studentEmail: string
  content: string
}): Promise<void> {
  try {
    const commentId = `comment_${Date.now()}_${Math.random().toString(36).substr(2, 9)}`
    const commentRef = doc(portalDb, 'videoComments', commentId)
    
    await setDoc(commentRef, {
      ...comment,
      createdAt: serverTimestamp()
    })
  } catch (error) {
    console.error('Error adding comment:', error)
    throw error
  }
} 