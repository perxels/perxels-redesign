import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface UpdateProfileImageRequest {
  uid: string
  imageUrl: string
}

interface ApiResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { uid, imageUrl }: UpdateProfileImageRequest = req.body

    // Validate required fields
    if (!uid || !imageUrl) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: uid and imageUrl are required.',
      })
    }

    // Validate imageUrl format (basic check)
    if (
      !imageUrl.startsWith('https://') ||
      !imageUrl.includes('cloudinary.com')
    ) {
      return res.status(400).json({
        success: false,
        error: 'Invalid image URL format.',
      })
    }

    // Update user document in Firestore
    const userDocRef = doc(portalDb, 'users', uid)

    await updateDoc(userDocRef, {
      'growthInfo.pictureUrl': imageUrl,
      updatedAt: new Date().toISOString(),
    })

    return res.status(200).json({
      success: true,
      message: 'Profile image updated successfully.',
    })
  } catch (error: any) {
    console.error('Error updating profile image:', {
      error: error.message,
      stack: error.stack,
      uid: req.body?.uid,
    })

    // Handle specific Firestore errors
    if (error.code === 'not-found') {
      return res.status(404).json({
        success: false,
        error: 'User not found.',
      })
    }

    if (error.code === 'permission-denied') {
      return res.status(403).json({
        success: false,
        error: 'Permission denied. Unable to update user data.',
      })
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
    })
  }
}
