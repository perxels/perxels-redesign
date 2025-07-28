import type { NextApiRequest, NextApiResponse } from 'next'
import { generateOTP, storeOTP } from '../../lib/utils/auth.utils'
import { sendOTPEmail } from '../../lib/utils/email.utils'

// Types
interface ResendOTPRequest {
  email: string
}

interface ResendOTPResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<ResendOTPResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { email } = req.body as ResendOTPRequest

    if (!email) {
      return res.status(400).json({
        success: false,
        error: 'Email is required',
      })
    }

    const sanitizedEmail = email.toLowerCase().trim()

    // Check if user exists (optional validation)
    // This is a simple check - you might want to verify the user exists in your users collection
    // For now, we'll just proceed with sending the OTP

    // Generate new OTP
    const otp = generateOTP()

    // Store OTP in Firestore (overwrites any existing OTP)
    const storeResult = await storeOTP(sanitizedEmail, otp)
    if (!storeResult.success) {
      return res.status(500).json({
        success: false,
        error: storeResult.error || 'Failed to store OTP',
      })
    }

    // Send OTP email
    const emailResult = await sendOTPEmail(sanitizedEmail, otp, {
      subject: 'Your new verification code',
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
      message: 'New verification code sent successfully',
    })
  } catch (error) {
    console.error('Resend OTP API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to resend OTP',
    })
  }
} 