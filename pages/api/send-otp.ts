import type { NextApiRequest, NextApiResponse } from 'next'
import { generateOTP, storeOTP } from '../../lib/utils/auth.utils'
import { sendOTPEmail } from '../../lib/utils/email.utils'

// Types
interface SendOTPRequest {
  email: string
}

interface SendOTPResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SendOTPResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { email } = req.body as SendOTPRequest

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      })
    }

    // Generate OTP
    const otp = generateOTP()

    // Store OTP in Firestore
    const storeResult = await storeOTP(email, otp)
    if (!storeResult.success) {
      return res.status(500).json({
        success: false,
        error: storeResult.error || 'Failed to store OTP',
      })
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(email, otp, {
      expiresInMinutes: 5,
      appName: 'Perxels Portal',
    })

    if (!emailResult.success) {
      return res.status(500).json({
        success: false,
        error: emailResult.error || 'Failed to send email',
      })
    }

    return res.status(200).json({
      success: true,
      message: 'OTP sent successfully',
    })
  } catch (error) {
    console.error('Send OTP API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to send OTP',
    })
  }
} 