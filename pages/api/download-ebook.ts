import { NextApiRequest, NextApiResponse } from 'next'
import { withPortalAuth } from '../../../lib/utils/portal-server-auth.utils'

interface DownloadEbookRequest {
  uid: string
  ebookId: string
  fileUrl: string
  fileName: string
}

interface DownloadEbookResponse {
  success: boolean
  error?: string
  downloadUrl?: string
}

async function handler(
  req: NextApiRequest,
  res: NextApiResponse<DownloadEbookResponse>
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed. Use POST.',
    })
  }

  try {
    const { uid, ebookId, fileUrl, fileName }: DownloadEbookRequest = req.body

    // Validate required fields
    if (!uid || !ebookId || !fileUrl || !fileName) {
      return res.status(400).json({
        success: false,
        error: 'Missing required fields: uid, ebookId, fileUrl, and fileName are required.',
      })
    }

    // Validate that the user has access to this ebook
    const { getEbookAccess } = await import('../../../lib/utils/ebook.utils')
    const access = await getEbookAccess(ebookId, uid)
    
    if (!access || access.isRevoked) {
      return res.status(403).json({
        success: false,
        error: 'You do not have access to this ebook.',
      })
    }

    // Fetch the file from Cloudinary
    const response = await fetch(fileUrl)
    
    if (!response.ok) {
      console.error('Cloudinary fetch error:', response.status, response.statusText)
      return res.status(response.status).json({
        success: false,
        error: `Failed to fetch file from Cloudinary: ${response.status} ${response.statusText}`,
      })
    }

    // Get the file as a buffer
    const buffer = await response.arrayBuffer()

    // Record the download
    const { recordEbookDownload } = await import('../../../lib/utils/ebook.utils')
    await recordEbookDownload(ebookId, uid)

    // Set response headers for file download
    res.setHeader('Content-Type', 'application/octet-stream')
    res.setHeader('Content-Disposition', `attachment; filename="${fileName}"`)
    res.setHeader('Content-Length', buffer.byteLength.toString())

    // Send the file
    res.status(200).send(Buffer.from(buffer))

  } catch (error: any) {
    console.error('Download ebook API error:', error)
    
    return res.status(500).json({
      success: false,
      error: 'Failed to download ebook. Please try again.',
    })
  }
}

export default withPortalAuth(handler)
