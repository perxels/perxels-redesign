import { NextApiRequest, NextApiResponse } from 'next'
import formidable from 'formidable'
import { v2 as cloudinary } from 'cloudinary'

// Configure Cloudinary
cloudinary.config({
  cloud_name: process.env.NEXT_PUBLIC_CLOUDINARY_CLOUD_NAME,
  api_key: process.env.CLOUDINARY_API_KEY,
  api_secret: process.env.CLOUDINARY_API_SECRET,
})

// Configure formidable
export const config = {
  api: {
    bodyParser: false,
  },
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({ error: 'Method not allowed' })
  }

  try {
    const form = formidable({})
    const [fields, files] = await form.parse(req)
    
    const file = files.file?.[0]
    const uid = fields.uid?.[0]
    const type = fields.type?.[0]

    if (!file || !uid || !type) {
      return res.status(400).json({ 
        success: false,
        error: 'Missing required fields' 
      })
    }

    // Upload to Cloudinary
    const result = await cloudinary.uploader.upload(file.filepath, {
      folder: 'portal/payment-receipts',
      public_id: `${uid}_${Date.now()}_payment_receipt`,
      context: `user_id=${uid}|upload_type=${type}`,
    })

    return res.status(200).json({
      success: true,
      url: result.secure_url
    })

  } catch (error: any) {
    console.error('Upload error:', error)
    return res.status(500).json({ 
      success: false,
      error: error.message || 'Failed to upload file' 
    })
  }
}
