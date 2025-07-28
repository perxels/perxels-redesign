import type { NextApiRequest, NextApiResponse } from 'next'
import { handleFirebaseAuthError } from '../../lib/utils/auth.utils'

interface TestErrorRequest {
  errorCode: string
  errorMessage?: string
}

interface TestErrorResponse {
  success: boolean
  message: string
  statusCode: number
  originalError?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<TestErrorResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      message: 'Method not allowed',
      statusCode: 405,
    })
  }

  try {
    const { errorCode, errorMessage } = req.body as TestErrorRequest

    if (!errorCode) {
      return res.status(400).json({
        success: false,
        message: 'Error code is required',
        statusCode: 400,
      })
    }

    // Create a mock Firebase error
    const mockError = {
      code: errorCode,
      message: errorMessage || `Mock error: ${errorCode}`,
    }

    // Test our error handler
    const { message, statusCode } = handleFirebaseAuthError(mockError)

    return res.status(200).json({
      success: true,
      message,
      statusCode,
      originalError: mockError.message,
    })

  } catch (error: any) {
    console.error('Test error handling API error:', error)
    return res.status(500).json({
      success: false,
      message: 'Failed to test error handling',
      statusCode: 500,
      originalError: error?.message,
    })
  }
} 