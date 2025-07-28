import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyOTP } from '../../lib/utils/auth.utils'

// Types
interface VerifyOTPRequest {
  email: string
  otp: string
}

interface VerifyOTPResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyOTPResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { email, otp } = req.body as VerifyOTPRequest

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required',
      })
    }

    // Verify OTP using utility function
    const result = await verifyOTP(email, otp)

    if (!result.success) {
      return res.status(400).json({
        success: false,
        error: result.error || 'Invalid OTP',
      })
    }

    return res.status(200).json({
      success: true,
      message: result.message || 'OTP verified successfully',
    })
  } catch (error) {
    console.error('Verify OTP API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to verify OTP',
    })
  }
} 