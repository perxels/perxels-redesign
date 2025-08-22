import { useState } from 'react'
import { doc, updateDoc } from 'firebase/firestore'
import { portalDb } from '../portalFirebaseConfig'
import { useToast } from '@chakra-ui/react'

interface EmailVerificationData {
  email: string
  otp: string
  uid?: string
}

export const useEmailVerification = () => {
  const [isLoading, setIsLoading] = useState(false)
  const toast = useToast()

  const verifyEmail = async (verificationData: EmailVerificationData) => {
    setIsLoading(true)
    
    try {


      const { email, otp, uid } = verificationData

      // Validate required fields
      if (!email || !otp) {
        throw new Error('Email and OTP are required')
      }

      // Verify OTP via server API (this still needs to be server-side for security)
      const otpResponse = await fetch('/api/verify-email', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({ email, otp, uid }),
      })

      const otpResult = await otpResponse.json()

      if (!otpResponse.ok || !otpResult.success) {
        throw new Error(otpResult.error || 'Invalid or expired OTP')
      }

      // Update email verification status in user document if UID is provided
      if (uid) {
        try {

          
          await updateDoc(doc(portalDb, 'users', uid), {
            emailVerified: true,
            verifiedAt: new Date(),
          })


        } catch (updateError: any) {
          console.error('❌ Failed to update email verification status:', updateError)
          // Don't fail the request if update fails, OTP was still valid
          toast({
            title: 'Warning',
            description: 'Email verified but status update failed',
            status: 'warning',
            duration: 3000,
          })
        }
      }

      toast({
        title: 'Success',
        description: 'Email verified successfully!',
        status: 'success',
        duration: 5000,
      })

      return { success: true, message: 'Email verified successfully' }

    } catch (error: any) {
      console.error('❌ Email verification error:', error)
      toast({
        title: 'Error',
        description: error.message || 'Failed to verify email',
        status: 'error',
        duration: 5000,
      })
      return { success: false, error: error.message }
    } finally {
      setIsLoading(false)
    }
  }

  return {
    verifyEmail,
    isLoading,
  }
}
