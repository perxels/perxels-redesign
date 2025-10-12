// pages/api/upload-sotw-image.ts
import type { NextApiRequest, NextApiResponse } from 'next'

interface UploadSOTWImageRequest {
  file: string // base64 encoded file
  fileName: string
  fileType: string
}

interface UploadSOTWImageResponse {
  success: boolean
  url?: string
  error?: string
  data?: {
    url: string
    publicId: string
    format: string
  }
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UploadSOTWImageResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { file, fileName, fileType } = req.body as UploadSOTWImageRequest

    console.log('📤 SOTW Image Upload Request:', {
      fileName,
      fileType,
      fileSize: file?.length,
      hasCloudName: !!process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
      hasUploadPreset: !!process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET,
    })

    // Validate required fields
    if (!file || !fileName || !fileType) {
      return res.status(400).json({
        success: false,
        error: 'File data, file name, and file type are required',
      })
    }

    // Check if Cloudinary environment variables are configured
    const cloudName = process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME
    const uploadPreset = process.env.NEXT_PUBLIC_CLOUDINARY_UPLOAD_PRESET

    if (!cloudName || !uploadPreset) {
      console.error('❌ Cloudinary config missing:', {
        cloudName: cloudName ? 'set' : 'missing',
        uploadPreset: uploadPreset ? 'set' : 'missing',
      })
      return res.status(500).json({
        success: false,
        error:
          'Cloudinary configuration is missing. Please check environment variables.',
      })
    }

    // Convert base64 to buffer
    const base64Data = file.replace(/^data:image\/[a-z]+;base64,/, '')
    const buffer = Buffer.from(base64Data, 'base64')

    // Create FormData for Cloudinary upload
    const formData = new FormData()

    // Create a blob from the buffer
    const blob = new Blob([buffer], { type: fileType })
    formData.append('file', blob, fileName)
    formData.append('upload_preset', uploadPreset)
    formData.append('folder', 'portal/sotw-work-images')

    console.log('🔄 Uploading to Cloudinary...', {
      cloudName,
      uploadPreset,
      folder: 'portal/sotw-work-images',
      fileSize: blob.size,
    })

    // Upload to Cloudinary
    const cloudinaryResponse = await fetch(
      `https://api.cloudinary.com/v1_1/${cloudName}/image/upload`,
      {
        method: 'POST',
        body: formData,
      },
    )

    console.log('📨 Cloudinary Response Status:', cloudinaryResponse.status)

    if (!cloudinaryResponse.ok) {
      const errorText = await cloudinaryResponse.text()
      console.error('❌ Cloudinary error response:', {
        status: cloudinaryResponse.status,
        statusText: cloudinaryResponse.statusText,
        error: errorText,
      })
      return res.status(500).json({
        success: false,
        error: `Cloudinary upload failed: ${cloudinaryResponse.status} ${cloudinaryResponse.statusText}. Details: ${errorText}`,
      })
    }

    const cloudinaryResult = await cloudinaryResponse.json()
    console.log('✅ Cloudinary upload successful:', {
      url: cloudinaryResult.secure_url,
      publicId: cloudinaryResult.public_id,
      format: cloudinaryResult.format,
    })

    if (cloudinaryResult.error) {
      console.error('❌ Cloudinary API error:', cloudinaryResult.error)
      return res.status(500).json({
        success: false,
        error: `Cloudinary error: ${cloudinaryResult.error.message}`,
      })
    }

    return res.status(200).json({
      success: true,
      data: {
        url: cloudinaryResult.secure_url,
        publicId: cloudinaryResult.public_id,
        format: cloudinaryResult.format,
      },
    })
  } catch (error: any) {
    console.error('🔥 SOTW image upload API error:', error)
    return res.status(500).json({
      success: false,
      error: `Upload failed: ${error.message}`,
    })
  }
}

export const config = {
  api: {
    bodyParser: {
      sizeLimit: '10mb',
    },
  },
}
