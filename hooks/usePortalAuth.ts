import { useState, useEffect } from 'react'
import { onAuthStateChanged, User } from 'firebase/auth'
import { doc, getDoc } from 'firebase/firestore'
import { portalAuth, portalDb } from '../portalFirebaseConfig'

interface PortalUser {
  uid: string
  email: string
  fullName: string
  phone: string
  branch: string
  role: string
  emailVerified: boolean
  isStudentActive?: boolean
  registrationComplete?: boolean
  onboardingComplete?: boolean
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  createdAt?: Date | { seconds: number; nanoseconds: number }
}

interface UsePortalAuthReturn {
  user: User | null
  portalUser: PortalUser | null
  loading: boolean
  isAuthenticated: boolean
  isEmailVerified: boolean
  isRegistrationComplete: boolean
  isOnboardingComplete: boolean
}

export function usePortalAuth(): UsePortalAuthReturn {
  const [user, setUser] = useState<User | null>(null)
  const [portalUser, setPortalUser] = useState<PortalUser | null>(null)
  const [loading, setLoading] = useState(true)

  useEffect(() => {
    const unsubscribe = onAuthStateChanged(portalAuth, async (firebaseUser) => {
      try {
        if (firebaseUser) {
          setUser(firebaseUser)

          // Fetch user data from Firestore
          const userDoc = await getDoc(doc(portalDb, 'users', firebaseUser.uid))

          if (userDoc.exists()) {
            const userData = userDoc.data() as PortalUser
            setPortalUser(userData)
          } else {
            // User exists in Firebase Auth but not in Firestore
            setPortalUser(null)
            console.warn(
              'User exists in Firebase Auth but not in Firestore:',
              firebaseUser.uid,
            )
          }
        } else {
          setUser(null)
          setPortalUser(null)
        }
      } catch (error) {
        console.error('Error fetching user data:', error)
        setUser(null)
        setPortalUser(null)
      } finally {
        setLoading(false)
      }
    })

    return unsubscribe
  }, [])

  // Determine if registration is complete based on actual data
  const isRegistrationComplete = portalUser
    ? portalUser.registrationComplete === true ||
      (portalUser.schoolFeeInfo && portalUser.growthInfo)
    : false

  // Determine if onboarding is complete based on actual data
  const isOnboardingComplete = portalUser
    ? portalUser.onboardingComplete === true ||
      (portalUser.schoolFeeInfo &&
        portalUser.growthInfo &&
        portalUser.termsAgreed)
    : false

  return {
    user,
    portalUser,
    loading,
    isAuthenticated: !!user && !!portalUser,
    isEmailVerified: portalUser?.emailVerified || false,
    isRegistrationComplete,
    isOnboardingComplete,
  }
}
