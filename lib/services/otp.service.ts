import {
  doc,
  setDoc,
  getDoc,
  deleteDoc,
  type Firestore,
} from 'firebase/firestore'
import {
  createUserWithEmailAndPassword,
  type Auth,
  type UserCredential,
} from 'firebase/auth'
import { portalAuth, portalDb } from '../../portalFirebaseConfig'
import resendService from './resend.service'

// Types
interface OTPData {
  code: string
  expiresAt: Date
  createdAt: Date
}

interface UserData {
  email: string
  emailVerified: boolean
  createdAt: Date
}

interface SendOTPResponse {
  success: boolean
  message?: string
  error?: string
}

// Custom error class
class OTPServiceError extends Error {
  constructor(message: string, public readonly cause?: unknown) {
    super(message)
    this.name = 'OTPServiceError'
  }
}

// Configuration
const OTP_EXPIRY_MINUTES = 5
const OTP_LENGTH = 6

class OTPService {
  private readonly auth: Auth
  private readonly db: Firestore
  private readonly OTP_LENGTH = 6
  private readonly OTP_EXPIRY_MINUTES = 5

  constructor() {
    this.auth = portalAuth
    this.db = portalDb
  }

  /**
   * Send OTP to user's email
   */
  async sendOTP(email: string): Promise<SendOTPResponse> {
    try {
      if (!email) {
        throw new OTPServiceError('Email is required')
      }

      const otp = this.generateOTP()
      const expiresAt = new Date(Date.now() + this.OTP_EXPIRY_MINUTES * 60 * 1000)

      // Store OTP in Firestore
      await setDoc(doc(this.db, 'email_otps', email), {
        code: otp,
        expiresAt,
        createdAt: new Date(),
      })

      // Send OTP email using Resend
      await resendService.sendOTPEmail(email, otp, {
        expiresInMinutes: this.OTP_EXPIRY_MINUTES,
      })

      return {
        success: true,
        message: 'OTP sent successfully',
      }
    } catch (error) {
      console.error('Send OTP error:', error)
      if (error instanceof OTPServiceError) {
        throw error
      }
      throw new OTPServiceError(
        `Failed to send OTP: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  /**
   * Verify OTP and create user account
   */
  async verifyOTPAndCreateUser(
    email: string,
    otp: string,
    password: string,
  ): Promise<UserCredential['user']> {
    try {
      const isValid = await this.verifyOTP(email, otp)
      if (!isValid) {
        throw new OTPServiceError('Invalid or expired OTP')
      }

      const userCredential = await createUserWithEmailAndPassword(
        this.auth,
        email,
        password,
      )

      await this.cleanupOTP(email)
      await this.markEmailVerified(userCredential.user.uid, email)

      return userCredential.user
    } catch (error) {
      console.error('Verify OTP and create user error:', error)
      throw new OTPServiceError(
        `Failed to verify OTP and create user: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  /**
   * Generate a random OTP
   */
  private generateOTP(): string {
    const min = Math.pow(10, OTP_LENGTH - 1)
    const max = Math.pow(10, OTP_LENGTH) - 1
    return Math.floor(Math.random() * (max - min + 1) + min).toString()
  }

  /**
   * Verify OTP against stored value
   */
  async verifyOTP(email: string, inputOTP: string): Promise<boolean> {
    try {
      const otpDoc = await getDoc(doc(this.db, 'email_otps', email))

      if (!otpDoc.exists()) {
        return false
      }

      const otpData = otpDoc.data() as OTPData
      const now = new Date()

      if (now > otpData.expiresAt) {
        await this.cleanupOTP(email)
        return false
      }

      return otpData.code === inputOTP
    } catch (error) {
      console.error('Verify OTP error:', error)
      throw new OTPServiceError(
        `Failed to verify OTP: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  /**
   * Clean up OTP from database
   */
  private async cleanupOTP(email: string): Promise<void> {
    try {
      await deleteDoc(doc(this.db, 'email_otps', email))
    } catch (error) {
      console.error('Cleanup OTP error:', error)
      throw new OTPServiceError(
        `Failed to cleanup OTP: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }

  /**
   * Mark user's email as verified
   */
  private async markEmailVerified(uid: string, email: string): Promise<void> {
    try {
      const userData: UserData = {
        email,
        emailVerified: true,
        createdAt: new Date(),
      }

      await setDoc(doc(this.db, 'users', uid), userData)
    } catch (error) {
      console.error('Mark email verified error:', error)
      throw new OTPServiceError(
        `Failed to mark email as verified: ${
          error instanceof Error ? error.message : 'Unknown error'
        }`,
        error,
      )
    }
  }
}

// Create singleton instance
const otpService = new OTPService()

export default otpService

// Named exports
export { OTPServiceError, type OTPData, type UserData, type SendOTPResponse }
