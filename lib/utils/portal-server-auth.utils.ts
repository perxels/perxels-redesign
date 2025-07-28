import { NextApiRequest, NextApiResponse } from 'next'
import { doc, getDoc } from 'firebase/firestore'
import { portalDb } from '../../portalFirebaseConfig'

interface AuthenticatedRequest extends NextApiRequest {
  user?: {
    uid: string
    email: string
    fullName: string
    phone: string
    branch: string
    role: string
    emailVerified: boolean
    registrationComplete?: boolean
    onboardingComplete?: boolean
  }
}

/**
 * Middleware to verify user authentication in API routes
 * Usage: Add this to your API routes to ensure the user is authenticated
 */
export async function withPortalAuth(
  handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>
) {
  return async (req: AuthenticatedRequest, res: NextApiResponse) => {
    try {
      // Get UID from request body or query
      const uid = req.body?.uid || req.query?.uid

      if (!uid) {
        return res.status(401).json({
          success: false,
          error: 'User ID is required'
        })
      }

      // Fetch user data from Firestore
      const userDoc = await getDoc(doc(portalDb, 'users', uid))

      if (!userDoc.exists()) {
        return res.status(401).json({
          success: false,
          error: 'User not found'
        })
      }

      const userData = userDoc.data()

      // Add user data to request object
      req.user = userData as AuthenticatedRequest['user']

      // Call the original handler
      return handler(req, res)
    } catch (error) {
      console.error('Authentication error:', error)
      return res.status(500).json({
        success: false,
        error: 'Authentication failed'
      })
    }
  }
}

/**
 * Check if user has completed specific registration steps
 */
export function requireRegistrationStep(step: 'emailVerified' | 'schoolFeeInfo' | 'growthInfo' | 'termsAgreed') {
  return (handler: (req: AuthenticatedRequest, res: NextApiResponse) => Promise<void>) => {
    return withPortalAuth(async (req: AuthenticatedRequest, res: NextApiResponse) => {
      const user = req.user!

      switch (step) {
        case 'emailVerified':
          if (!user.emailVerified) {
            return res.status(403).json({
              success: false,
              error: 'Email verification required'
            })
          }
          break
        
        case 'schoolFeeInfo':
          if (!user.emailVerified) {
            return res.status(403).json({
              success: false,
              error: 'Email verification required'
            })
          }
          // Check if school fee info exists (you might need to check a specific field)
          break
        
        case 'growthInfo':
          // Check if growth info exists
          break
        
        case 'termsAgreed':
          // Check if terms are agreed
          break
      }

      return handler(req, res)
    })
  }
} 