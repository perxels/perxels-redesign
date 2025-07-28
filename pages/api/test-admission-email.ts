import type { NextApiRequest, NextApiResponse } from 'next'
import { sendAdmissionEmail } from '../../lib/utils/email.utils'

interface TestAdmissionEmailRequest {
  email: string
  studentName: string
  cohort: string
}

interface TestAdmissionEmailResponse {
  success: boolean
  message: string
  error?: string
  emailId?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestAdmissionEmailResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
    })
  }

  try {
    const { email, studentName, cohort } = req.body as TestAdmissionEmailRequest

    // Validate required fields
    if (!email || !studentName || !cohort) {
      return res.status(400).json({
        success: false,
        message: 'Email, student name, and cohort are required',
      })
    }

    // Send admission email with PDF attachment
    const result = await sendAdmissionEmail(
      email,
      studentName,
      cohort,
      { appName: 'Perxels Portal' }
    )

    if (result.success) {
      return res.status(200).json({
        success: true,
        message: 'Admission email sent successfully with PDF attachment',
        emailId: result.emailId,
      })
    } else {
      return res.status(500).json({
        success: false,
        message: 'Failed to send admission email',
        error: result.error,
      })
    }

  } catch (error: any) {
    console.error('Test admission email API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to send admission email',
      error: error?.message || 'Unknown error',
    })
  }
} 