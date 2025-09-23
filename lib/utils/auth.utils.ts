import { createUserWithEmailAndPassword, updateProfile } from 'firebase/auth'
import { doc, setDoc, getDoc, deleteDoc } from 'firebase/firestore'
import { portalAuth, portalDb } from '../../portalFirebaseConfig'
import { sendOTPEmail } from './email.utils'

/**
 * Firebase Auth error handler - converts Firebase errors to user-friendly messages
 */
export function handleFirebaseAuthError(error: any): {
  message: string
  statusCode: number
} {
  const errorCode = error.code || 'unknown'

  switch (errorCode) {
    // Authentication errors
    case 'auth/email-already-in-use':
      return {
        message: 'Email is already registered. Please try logging in instead.',
        statusCode: 409,
      }
    case 'auth/invalid-email':
      return {
        message: 'Please enter a valid email address.',
        statusCode: 400,
      }
    case 'auth/weak-password':
      return {
        message:
          'Password is too weak. Please choose a password with at least 6 characters.',
        statusCode: 400,
      }
    case 'auth/user-not-found':
      return {
        message:
          'No account found with this email. Please check your email or sign up.',
        statusCode: 404,
      }
    case 'auth/wrong-password':
      return {
        message: 'Incorrect password. Please try again.',
        statusCode: 401,
      }
    case 'auth/user-disabled':
      return {
        message: 'This account has been disabled. Please contact support.',
        statusCode: 403,
      }
    case 'auth/too-many-requests':
      return {
        message: 'Too many attempts. Please try again later.',
        statusCode: 429,
      }
    case 'auth/network-request-failed':
      return {
        message: 'Network error. Please check your connection and try again.',
        statusCode: 503,
      }
    case 'auth/operation-not-allowed':
      return {
        message:
          'Email/password accounts are not enabled. Please contact support.',
        statusCode: 503,
      }
    case 'auth/invalid-credential':
      return {
        message: 'Invalid credentials. Please check your information.',
        statusCode: 400,
      }
    case 'auth/account-exists-with-different-credential':
      return {
        message:
          'An account already exists with this email using a different sign-in method.',
        statusCode: 409,
      }
    case 'auth/credential-already-in-use':
      return {
        message: 'This credential is already associated with another account.',
        statusCode: 409,
      }
    case 'auth/invalid-verification-code':
      return {
        message: 'Invalid verification code. Please try again.',
        statusCode: 400,
      }
    case 'auth/invalid-verification-id':
      return {
        message: 'Invalid verification ID. Please request a new code.',
        statusCode: 400,
      }
    case 'auth/quota-exceeded':
      return {
        message: 'Service quota exceeded. Please try again later.',
        statusCode: 429,
      }
    case 'auth/unverified-email':
      return {
        message: 'Please verify your email address before proceeding.',
        statusCode: 403,
      }
    case 'auth/requires-recent-login':
      return {
        message: 'Please log in again to continue.',
        statusCode: 401,
      }
    case 'auth/popup-closed-by-user':
      return {
        message: 'Sign-in was cancelled.',
        statusCode: 400,
      }
    case 'auth/popup-blocked':
      return {
        message:
          'Sign-in popup was blocked. Please allow popups and try again.',
        statusCode: 400,
      }
    case 'auth/cancelled-popup-request':
      return {
        message: 'Sign-in was cancelled.',
        statusCode: 400,
      }
    case 'auth/popup-closed-by-user':
      return {
        message: 'Sign-in was cancelled.',
        statusCode: 400,
      }
    default:
      // Log the actual error for debugging but don't expose it to user
      console.error('Unhandled Firebase Auth error:', errorCode, error.message)
      return {
        message: 'An error occurred. Please try again.',
        statusCode: 500,
      }
  }
}

// Types
interface CreateAccountData {
  email: string
  password: string
  fullName: string
  phone: string
  branch: string
  address?: string
  guardianName?: string
  guardianPhone?: string
}

interface CreateAccountResult {
  success: boolean
  uid?: string
  message?: string
  error?: string
  errorCode?: string
  statusCode?: number
}

interface OTPData {
  code: string
  expiresAt: Date
  createdAt: Date
}

interface OTPResult {
  success: boolean
  message?: string
  error?: string
}

// Configuration
const OTP_EXPIRY_MINUTES = 5
const OTP_LENGTH = 6

/**
 * Generate a random OTP
 */
export function generateOTP(): string {
  const min = Math.pow(10, OTP_LENGTH - 1)
  const max = Math.pow(10, OTP_LENGTH) - 1
  return Math.floor(Math.random() * (max - min + 1) + min).toString()
}

/**
 * Store OTP in Firestore
 */
export async function storeOTP(email: string, otp: string): Promise<OTPResult> {
  try {
    const sanitizedEmail = email.toLowerCase().trim()
    const expiresAt = new Date(Date.now() + OTP_EXPIRY_MINUTES * 60 * 1000)

    await setDoc(doc(portalDb, 'email_otps', sanitizedEmail), {
      code: otp,
      expiresAt,
      createdAt: new Date(),
    })

    return {
      success: true,
      message: 'OTP stored successfully',
    }
  } catch (error) {
    console.error('Store OTP error:', error)
    return {
      success: false,
      error: 'Failed to store verification code. Please try again.',
    }
  }
}

/**
 * Verify OTP against stored value
 */
export async function verifyOTP(
  email: string,
  inputOTP: string,
): Promise<OTPResult> {
  try {
    const sanitizedEmail = email.toLowerCase().trim()
    const sanitizedOTP = inputOTP.trim()

    const otpDoc = await getDoc(doc(portalDb, 'email_otps', sanitizedEmail))

    if (!otpDoc.exists()) {
      return {
        success: false,
        error: 'Invalid or expired OTP',
      }
    }

    const otpData = otpDoc.data()

    // Handle Firestore Timestamp conversion properly
    let expiresAt: Date
    if (otpData.expiresAt?.toDate) {
      // Firestore Timestamp
      expiresAt = otpData.expiresAt.toDate()
    } else if (otpData.expiresAt instanceof Date) {
      // JavaScript Date
      expiresAt = otpData.expiresAt
    } else {
      // String or other format, try to parse
      expiresAt = new Date(otpData.expiresAt)
    }

    const now = new Date()

    // Check if OTP has expired
    if (now > expiresAt) {
      await deleteDoc(doc(portalDb, 'email_otps', sanitizedEmail))
      return {
        success: false,
        error: 'OTP has expired',
      }
    }

    // Check if OTP matches (ensure both are strings and trimmed)
    const storedCode = String(otpData.code).trim()

    if (storedCode !== sanitizedOTP) {
      return {
        success: false,
        error: 'Invalid OTP',
      }
    }

    // Clean up OTP after successful verification
    await deleteDoc(doc(portalDb, 'email_otps', sanitizedEmail))

    return {
      success: true,
      message: 'OTP verified successfully',
    }
  } catch (error) {
    console.error('Verify OTP error:', error)
    return {
      success: false,
      error: 'Failed to verify OTP. Please try again.',
    }
  }
}

/**
 * Create user account with Firebase Auth and store user data in Firestore
 */
export async function createUserAccount(
  userData: CreateAccountData,
): Promise<CreateAccountResult> {
  try {
    // const { email, password, fullName, phone, branch } = userData
    const {
      email,
      password,
      fullName,
      phone,
      branch,
      address,
      guardianName,
      guardianPhone,
    } = userData

    // Create user with email and password
    const userCredential = await createUserWithEmailAndPassword(
      portalAuth,
      email,
      password,
    )

    // Update user profile with full name
    await updateProfile(userCredential.user, {
      displayName: fullName,
    })

    // Save additional user data to Firestore
    const userDocData = {
      uid: userCredential.user.uid,
      fullName,
      email,
      phone,
      branch,
      address,
      guardianName,
      guardianPhone,
      role: 'student' as const,
      emailVerified: false, // Will be verified after OTP confirmation
      createdAt: new Date(),
    }

    await setDoc(doc(portalDb, 'users', userCredential.user.uid), userDocData)

    return {
      success: true,
      uid: userCredential.user.uid,
      message: 'Account created successfully',
    }
  } catch (error: any) {
    console.error('Create account error:', error)

    const { message, statusCode } = handleFirebaseAuthError(error)

    return {
      success: false,
      error: message,
      errorCode: error.code || 'unknown',
      statusCode, // Include for API response
    }
  }
}
