import type { NextApiRequest, NextApiResponse } from 'next'
import { doc, updateDoc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface GrowthInfoData {
  profession: string
  whyClass: string
  classOutcome: string
  gender: string
  pictureUrl: string
}

interface UpdateGrowthInfoRequest {
  uid: string
  growthInfo: GrowthInfoData
}

interface UpdateGrowthInfoResponse {
  success: boolean
  message?: string
  error?: string
}

export default async function handler(
  req: NextApiRequest,
  res: NextApiResponse<UpdateGrowthInfoResponse>,
) {
  if (req.method !== 'POST') {
    return res.status(405).json({
      success: false,
      error: 'Method not allowed',
    })
  }

  try {
    const { uid, growthInfo } = req.body as UpdateGrowthInfoRequest

    // Validate required fields
    if (!uid || !growthInfo) {
      return res.status(400).json({
        success: false,
        error: 'User ID and growth information are required',
      })
    }

    // Validate growth info fields
    const { profession, whyClass, classOutcome, gender, pictureUrl } = growthInfo
    if (!profession || !whyClass || !classOutcome || !gender || !pictureUrl) {
      return res.status(400).json({
        success: false,
        error: 'All growth information fields are required',
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

    // Update user document with growth information
    await updateDoc(doc(portalDb, 'users', uid), {
      growthInfo: {
        profession,
        whyClass,
        classOutcome,
        gender,
        pictureUrl,
      },
      growthInfoUpdatedAt: new Date(),
      // Mark registration as complete
      registrationComplete: true,
      registrationCompletedAt: new Date(),
    })

    return res.status(200).json({
      success: true,
      message: 'Growth information updated successfully',
    })

  } catch (error: any) {
    console.error('Update growth info API error:', error)
    return res.status(500).json({
      success: false,
      error: 'Failed to update growth information',
    })
  }
} 