import { NextApiRequest, NextApiResponse } from 'next'

interface DownloadRequest {
  fileUrl: string
  fileName: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { fileUrl, fileName }: DownloadRequest = req.body

    // Validate required fields
    if (!fileUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: fileUrl and fileName.',
      })
    }

    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl)
    
    if (!response.ok) {
      console.error('Cloudinary fetch error:', response.status, response.statusText)
      return res.status(response.status).json({
        success: false,
        error: `Failed to fetch file: ${response.status}`,
      })
    }

    // Get the file as a buffer
    const buffer = await response.arrayBuffer()

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Length', buffer.byteLength.toString())
    res.setHeader('Cache-Control', 'no-cache')

    // Send the file
    res.status(200).send(Buffer.from(buffer))

  } catch (error: any) {
    console.error('Download proxy error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Failed to download ebook.',
    })
  }
}
