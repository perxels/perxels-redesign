import type { NextApiRequest, NextApiResponse } from 'next'

interface UpdateProfileDetailsRequest {
  uid: string
  profileData: {
    fullName: string
    phone: string
    schoolFeeInfo?: any
    growthInfo?: any
  }
  // Client will handle Firebase operations, server only validates
}

interface ApiResponse {
  success: boolean
  message?: string
  error?: string
  data?: any
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ApiResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { uid, profileData }: UpdateProfileDetailsRequest = req.body

    // Validate required fields
    if (!uid || !profileData) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: uid and profileData are required.',
      })
    }

    // Validate basic profile data
    if (!profileData.fullName || !profileData.phone) {
      return res.status(400).json({
        success: false,
        error: 'Missing required profile fields: fullName and phone are required.',
      })
    }

    // Validate phone number format
    const phoneRegex = /^(\+234|0)[789][01]\d{8}$/
    if (!phoneRegex.test(profileData.phone)) {
      return res.status(400).json({
        success: false,
        error: 'Invalid phone number format.',
      })
    }

    // Validate full name
    const nameRegex = /^[a-zA-Z\s]*$/
    if (!nameRegex.test(profileData.fullName) || profileData.fullName.length < 2) {
      return res.status(400).json({
        success: false,
        error: 'Invalid full name format.',
      })
    }

    // Prepare update data
    const updateData: any = {
      fullName: profileData.fullName.trim(),
      phone: profileData.phone.trim(),
      updatedAt: new Date().toISOString(),
    }

    // Add school fee info if provided
    if (profileData.schoolFeeInfo) {
      updateData.schoolFeeInfo = profileData.schoolFeeInfo
    }

    // Add growth info if provided
    if (profileData.growthInfo) {
      updateData.growthInfo = profileData.growthInfo
    }

    // Client will handle Firebase operations
    // Server only validates and returns success response
    
    return res.status(200).json({
      success: true,
      message: 'Profile details validated successfully. Please handle Firebase operations on the client side.',
      data: updateData
    })

  } catch (error: any) {
    console.error('Error updating profile details:', {
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

    if (error.code === 'invalid-argument') {
      return res.status(400).json({
        success: false,
        error: 'Invalid data provided.',
      })
    }

    // Generic error response
    return res.status(500).json({
      success: false,
      error: 'Internal server error. Please try again later.',
    })
  }
} 