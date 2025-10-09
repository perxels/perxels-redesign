import { useCallback } from 'react'
import { usePortalAuth } from './usePortalAuth'

export const useFacilitatorProfileCheck = () => {
  const { portalUser } = usePortalAuth()

  const isProfileComplete = useCallback((): boolean => {
    if (!portalUser) return false

    const requiredFields = [
      portalUser.fullName,
      portalUser.phone,
      portalUser.gender,
      portalUser.profession,
      portalUser.address,
    ]

    // Check if all required fields are filled
    const hasAllRequiredFields = requiredFields.every(
      (field) => field && field.trim().length > 0,
    )

    // Check if password was changed (you might need to track this separately)
    // const hasChangedPassword = portalUser.passwordChanged === true

    // return hasAllRequiredFields && hasChangedPassword
    return hasAllRequiredFields
  }, [portalUser])

  const needsProfileUpdate = useCallback((): boolean => {
    return !isProfileComplete()
  }, [isProfileComplete])

  const getMissingFields = useCallback((): string[] => {
    if (!portalUser) return []

    const missingFields: string[] = []

    if (!portalUser.fullName?.trim()) missingFields.push('Full Name')
    if (!portalUser.phone?.trim()) missingFields.push('Phone Number')
    if (!portalUser.gender?.trim()) missingFields.push('Gender')
    if (!portalUser.profession?.trim()) missingFields.push('Profession')
    if (!portalUser.address?.trim()) missingFields.push('Address')
    // if (!portalUser.passwordChanged) missingFields.push('Password Change')

    return missingFields
  }, [portalUser])

  return {
    isProfileComplete,
    needsProfileUpdate,
    getMissingFields,
  }
}
