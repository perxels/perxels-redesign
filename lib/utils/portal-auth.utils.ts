interface PortalUserData {
  emailVerified: boolean
  schoolFeeInfo?: any
  growthInfo?: any
  termsAgreed?: boolean
  onboardingComplete?: boolean
}

/**
 * Determine where user should be redirected based on their registration status
 */
export function getRedirectPath(userData: PortalUserData): string {
  // If email not verified, go to verification
  if (!userData.emailVerified) {
    return '/portal/verify'
  }

  // If school fee info not provided, go to school fee form
  if (!userData.schoolFeeInfo) {
    return '/portal/school-fee-info'
  }

  // If growth info not provided, go to growth info form
  if (!userData.growthInfo) {
    return '/portal/growth-info'
  }

  // If terms not agreed, go to terms page
  if (!userData.termsAgreed) {
    return '/portal/terms-and-conditions'
  }

  // If everything is complete, go to dashboard
  if (userData.onboardingComplete) {
    return '/portal/dashboard'
  }

  // Default fallback
  return '/portal/terms-and-conditions'
} 