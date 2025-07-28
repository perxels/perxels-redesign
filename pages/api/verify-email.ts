import type { NextApiRequest, NextApiResponse } from 'next'
import { verifyOTP } from '../../lib/utils/auth.utils'
import { doc, updateDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'
import { sendWelcomeEmail } from '../../lib/utils/email.utils'

// Types
interface VerifyEmailRequest {
  email: string
  otp: string
  uid?: string
}

interface VerifyEmailResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<VerifyEmailResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { email, otp, uid } = req.body as VerifyEmailRequest

    if (!email || !otp) {
      return res.status(400).json({
        success: false,
        error: 'Email and OTP are required',
      })
    }

    // Verify OTP
    const otpResult = await verifyOTP(email.toLowerCase().trim(), otp)
    
    if (!otpResult.success) {
      return res.status(400).json({
        success: false,
        error: otpResult.error || 'Invalid or expired OTP',
      })
    }

    // Update email verification status in user document if UID is provided
    if (uid) {
      try {
        await updateDoc(doc(portalDb, 'users', uid), {
          emailVerified: true,
          verifiedAt: new Date(),
        })
      } catch (updateError) {
        console.error('Failed to update email verification status:', updateError)
        // Don't fail the request if update fails, OTP was still valid
      }
    }

    // Send welcome email (optional, don't fail if it doesn't work)
    try {
      await sendWelcomeEmail(email, '', {
        subject: 'Welcome to Perxels Portal! 🎉',
        appName: 'Perxels Portal',
      })
    } catch (emailError) {
      console.error('Failed to send welcome email:', emailError)
      // Don't fail the request if welcome email fails
    }

    return res.status(200).json({
      success: true,
      message: 'Email verified successfully',
    })

  } catch (error: any) {
    console.error('Verify email API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to verify email',
    })
  }
} 