import type { NextApiRequest, NextApiResponse } from 'next'
import { createUserAccount } from '../../lib/utils/auth.utils'

// Types
interface CreateAccountRequest {
  email: string
  password: string
  fullName: string
  phone: string
  branch: string
}

interface CreateAccountResponse {
  success: boolean
  uid?: string
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<CreateAccountResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { email, password, fullName, phone, branch } =
      req.body as CreateAccountRequest

    if (!email || !password || !fullName || !phone || !branch) {
      return res.status(400).json({
        success: false,
        error: 'All fields are required',
      })
    }

    // Create user account using utility function
    const result = await createUserAccount({
      email,
      password,
      fullName,
      phone,
      branch,
    })

    if (!result.success) {
      return res.status(500).json({
        success: false,
        error: result.error || 'Failed to create account',
      })
    }

    return res.status(200).json({
      success: true,
      uid: result.uid,
      message: result.message || 'Account created successfully',
    })
  } catch (error: any) {
    console.error('Create account API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to create account',
    })
  }
}
