import type { NextApiRequest, NextApiResponse } from 'next'
import {
  createUserAccount,
  generateOTP,
  storeOTP,
} from '../../lib/utils/auth.utils'
import { sendOTPEmail } from '../../lib/utils/email.utils'

// Updated Types with new fields
interface SignUpRequest {
  email: string
  password: string
  fullName: string
  phone: string
  branch: string
  address: string
  guardianName: string
  guardianPhone: string
}

interface SignUpResponse {
  success: boolean
  uid?: string
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<SignUpResponse>,
) {
  console.log('🔍 Signup API called with:', {
    method: req.method,
    body: req.body,
    headers: req.headers,
  })

  if (req.method !== 'POST') {
    console.log('❌ Method not allowed:', req.method)
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    // Updated to include new fields
    const {
      email,
      password,
      fullName,
      phone,
      branch,
      address,
      guardianName,
      guardianPhone,
    } = req.body as SignUpRequest

    console.log('📋 Parsed request body:', {
      hasEmail: !!email,
      hasPassword: !!password,
      hasFullName: !!fullName,
      hasPhone: !!phone,
      hasBranch: !!branch,
      hasAddress: !!address, // NEW
      hasGuardianName: !!guardianName, // NEW
      hasGuardianPhone: !!guardianPhone, // NEW
    })

    // Updated validation to include new fields
    if (
      !email ||
      !password ||
      !fullName ||
      !phone ||
      !branch ||
      !address ||
      !guardianName ||
      !guardianPhone
    ) {
      console.log('❌ Missing required fields:', {
        hasEmail: !!email,
        hasPassword: !!password,
        hasFullName: !!fullName,
        hasPhone: !!phone,
        hasBranch: !!branch,
        hasAddress: !!address, // NEW
        hasGuardianName: !!guardianName, // NEW
        hasGuardianPhone: !!guardianPhone, // NEW
      })
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      })
    }

    // Additional validation
    if (password.length < 6) {
      console.log('❌ Password too short')
      return res.status(400).json({
        success: false,
        error: 'Password must be at least 6 characters long',
      })
    }

    if (!email.includes('@')) {
      console.log('❌ Invalid email format')
      return res.status(400).json({
        success: false,
        error: 'Please enter a valid email address',
      })
    }

    // Validate address length
    if (address.length < 10) {
      console.log('❌ Address too short')
      return res.status(400).json({
        success: false,
        error: 'Address must be at least 10 characters long',
      })
    }

    // Validate guardian name
    if (guardianName.length < 2) {
      console.log('❌ Guardian name too short')
      return res.status(400).json({
        success: false,
        error: 'Guardian name must be at least 2 characters long',
      })
    }

    // Sanitize input data with new fields
    const sanitizedData = {
      email: email.toLowerCase().trim(),
      password,
      fullName: fullName.trim(),
      phone: phone.trim(),
      branch: branch.trim(),
      address: address.trim(),
      guardianName: guardianName.trim(),
      guardianPhone: guardianPhone.trim(),
    }

    console.log('🧹 Sanitized data:', {
      email: sanitizedData.email,
      fullName: sanitizedData.fullName,
      phone: sanitizedData.phone,
      branch: sanitizedData.branch,
      address: sanitizedData.address,
      guardianName: sanitizedData.guardianName,
      guardianPhone: sanitizedData.guardianPhone,
      passwordLength: sanitizedData.password.length,
    })

    // Step 1: Create Firebase account and store user data
    console.log('👤 Creating user account...')
    const accountResult = await createUserAccount(sanitizedData)

    if (!accountResult.success) {
      console.error('❌ Account creation failed:', accountResult.error)

      return res.status(accountResult.statusCode || 500).json({
        success: false,
        error: accountResult.error || 'Failed to create account',
      })
    }

    console.log('✅ Account created successfully with UID:', accountResult.uid)

    // Step 2: Generate and store OTP for email verification
    console.log('🔐 Generating OTP...')
    const otp = generateOTP()
    console.log('📧 Storing OTP for email:', sanitizedData.email)
    const storeResult = await storeOTP(sanitizedData.email, otp)

    if (!storeResult.success) {
      console.error(
        '❌ Failed to store OTP, but account was created:',
        storeResult.error,
      )
      // Account was created but OTP storage failed - this is still a success
      // User can request OTP resend if needed
    } else {
      console.log('✅ OTP stored successfully')
    }

    // Step 3: Send OTP verification email
    console.log('📧 Sending OTP verification email...')
    const emailResult = await sendOTPEmail(sanitizedData.email, otp, {
      subject: 'Verify your Perxels account',
      expiresInMinutes: 5,
      appName: 'Perxels Portal',
    })

    if (!emailResult.success) {
      console.error(
        '❌ Failed to send OTP email, but account was created:',
        emailResult.error,
      )
      // Account was created but email sending failed
      return res.status(200).json({
        success: true,
        uid: accountResult.uid,
        message:
          'Account created successfully, but verification email failed to send. Please request a new verification code.',
      })
    }

    console.log('✅ OTP email sent successfully')
    console.log('🎉 Signup process completed successfully')

    // All three operations successful
    return res.status(200).json({
      success: true,
      uid: accountResult.uid,
      message:
        'Account created successfully! Please check your email for the verification code.',
    })
  } catch (error: any) {
    console.error('❌ Signup API error:', {
      error: error.message,
      code: error.code,
      stack: error.stack,
      body: req.body,
    })

    let errorMessage = 'Failed to create account'
    let statusCode = 500

    if (error.code) {
      switch (error.code) {
        case 'auth/email-already-in-use':
          errorMessage = 'Email is already registered. Please try logging in.'
          statusCode = 409 // Conflict
          break
        case 'auth/invalid-email':
          errorMessage = 'Invalid email address'
          statusCode = 400 // Bad Request
          break
        case 'auth/weak-password':
          errorMessage =
            'Password is too weak. Please choose a stronger password.'
          statusCode = 400 // Bad Request
          break
        case 'auth/network-request-failed':
          errorMessage =
            'Network error. Please check your connection and try again.'
          statusCode = 503 // Service Unavailable
          break
        case 'auth/too-many-requests':
          errorMessage = 'Too many signup attempts. Please try again later.'
          statusCode = 429 // Too Many Requests
          break
        case 'auth/operation-not-allowed':
          errorMessage =
            'Email/password accounts are not enabled. Please contact support.'
          statusCode = 403 // Forbidden
          break
        case 'auth/invalid-phone-number':
          errorMessage = 'Invalid phone number format'
          statusCode = 400 // Bad Request
          break
        default:
          errorMessage = error.message || errorMessage
          statusCode = 500 // Internal Server Error
      }
    } else if (error.message) {
      // Handle other types of errors
      if (
        error.message.includes('network') ||
        error.message.includes('connection')
      ) {
        errorMessage =
          'Network error. Please check your connection and try again.'
        statusCode = 503
      } else if (error.message.includes('timeout')) {
        errorMessage = 'Request timeout. Please try again.'
        statusCode = 408
      } else {
        errorMessage = error.message
        statusCode = 500
      }
    }

    console.log('📤 Returning error response:', {
      statusCode,
      errorMessage,
      success: false,
    })

    return res.status(statusCode).json({
      success: false,
      error: errorMessage,
    })
  }
}
