import type { NextApiRequest, NextApiResponse } from 'next'
import {
  sendEmailWithAttachments,
  sendPaymentReceiptEmail,
  sendCertificateEmail,
  sendCourseMaterialsEmail,
  createAttachmentFromBase64,
  createPdfAttachment,
  createImageAttachment,
  createDocumentAttachment,
} from '../../lib/utils/email.utils'

interface SendEmailWithAttachmentRequest {
  type: 'generic' | 'payment_receipt' | 'certificate' | 'course_materials'
  to: string
  subject: string
  html?: string
  attachments: Array<{
    filename: string
    content: string // base64 encoded
    contentType?: string
  }>
  // For specific email types
  studentName?: string
  amount?: number
  cohort?: string
  classPlan?: string
  courseName?: string
}

interface SendEmailWithAttachmentResponse {
  success: boolean
  message?: string
  error?: string
  emailId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendEmailWithAttachmentResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const {
      type,
      to,
      subject,
      html,
      attachments,
      studentName,
      amount,
      cohort,
      classPlan,
      courseName,
    } = req.body as SendEmailWithAttachmentRequest

    // Validate required fields
    if (!to || !attachments || attachments.length === 0) {
      return res.status(400).json({
        success: false,
        error: 'Email address and attachments are required',
      })
    }

    // Convert base64 attachments to proper format
    const processedAttachments = attachments.map(attachment => ({
      filename: attachment.filename,
      content: attachment.content,
      contentType: attachment.contentType || 'application/octet-stream',
    }))

    let result

    switch (type) {
      case 'payment_receipt':
        if (!studentName || !amount || !cohort || !classPlan) {
          return res.status(400).json({
            success: false,
            error: 'Payment receipt requires studentName, amount, cohort, and classPlan',
          })
        }
        result = await sendPaymentReceiptEmail(
          to,
          studentName,
          amount,
          cohort,
          classPlan,
          processedAttachments[0],
          { appName: 'Perxels Portal' }
        )
        break

      case 'certificate':
        if (!studentName || !courseName) {
          return res.status(400).json({
            success: false,
            error: 'Certificate email requires studentName and courseName',
          })
        }
        result = await sendCertificateEmail(
          to,
          studentName,
          courseName,
          processedAttachments[0],
          { appName: 'Perxels Portal' }
        )
        break

      case 'course_materials':
        if (!studentName || !courseName) {
          return res.status(400).json({
            success: false,
            error: 'Course materials email requires studentName and courseName',
          })
        }
        result = await sendCourseMaterialsEmail(
          to,
          studentName,
          courseName,
          processedAttachments,
          { appName: 'Perxels Portal' }
        )
        break

      case 'generic':
      default:
        if (!html) {
          return res.status(400).json({
            success: false,
            error: 'Generic email requires HTML content',
          })
        }
        result = await sendEmailWithAttachments(
          to,
          subject,
          html,
          processedAttachments,
          { appName: 'Perxels Portal' }
        )
        break
    }

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: result.message,
        emailId: result.emailId,
      })
    } else {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to send email',
      })
    }
  } catch (error: any) {
    console.error('Send email with attachment API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to send email with attachment',
    })
  }
} 