import type { NextApiRequest, NextApiResponse } from 'next'

interface UploadProfilePictureRequest {
  uid: string
  file: string // base64 encoded file
  fileName: string
  fileType: string
}

interface UploadProfilePictureResponse {
  success: boolean
  url?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadProfilePictureResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, file, fileName, fileType } = req.body as UploadProfilePictureRequest

    // Validate required fields
    if (!uid || !file || !fileName || !fileType) {
      return res.status(400).json({
        success: false,
        error: 'User ID, file data, file name, and file type are required',
      })
    }

    // Check if Cloudinary environment variables are configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      return res.status(500).json({
        success: false,
        error: 'Cloudinary configuration is missing. Please contact support.',
      })
    }

    // Convert base64 to buffer
    const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Create FormData for Cloudinary upload
    const formData = new FormData()
    formData.append('file', new Blob([buffer as any], { type: fileType }), fileName)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'portal/profile-pictures')
    formData.append('public_id', `${uid}_${Date.now()}_profile_picture`)
    formData.append('context', `user_id=${uid}|upload_type=profile_picture`)

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text()
      console.error('❌ Cloudinary error response:', errorText)
      return res.status(500).json({
        success: false,
        error: `Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}`,
      })
    }

    const cloudinaryResult = await cloudinaryResponse.json()

    if (cloudinaryResult.error) {
      return res.status(500).json({
        success: false,
        error: `Cloudinary error: ${cloudinaryResult.error.message}`,
      })
    }

    return res.status(200).json({
      success: true,
      url: cloudinaryResult.secure_url,
    })

  } catch (error: any) {
    console.error('Upload profile picture API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to upload profile picture',
    })
  }
} 