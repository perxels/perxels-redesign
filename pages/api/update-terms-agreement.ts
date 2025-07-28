import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface UpdateTermsAgreementRequest {
  uid: string
  termsAgreed: boolean
}

interface UpdateTermsAgreementResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateTermsAgreementResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, termsAgreed } = req.body as UpdateTermsAgreementRequest

    // Validate required fields
    if (!uid || typeof termsAgreed !== 'boolean') {
      return res.status(400).json({
        success: false,
        error: 'User ID and terms agreement status are required',
      })
    }

    // Verify user exists
    const userDoc = await getDoc(doc(portalDb, 'users', uid))
    if (!userDoc.exists()) {
      return res.status(404).json({
        success: false,
        error: 'User not found',
      })
    }

    // Update user document with terms agreement status
    await updateDoc(doc(portalDb, 'users', uid), {
      termsAgreed,
      termsAgreedAt: new Date(),
      // Mark onboarding as fully complete
      onboardingComplete: true,
      onboardingCompletedAt: new Date(),
    })

    return res.status(200).json({
      success: true,
      message: 'Terms agreement updated successfully',
    })

  } catch (error: any) {
    console.error('Update terms agreement API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update terms agreement',
    })
  }
} 