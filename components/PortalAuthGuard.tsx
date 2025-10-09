import React, { useEffect, useState } from 'react'
import { useRouter } from 'next/router'
import { Box, Spinner, Text, VStack } from '@chakra-ui/react'
import { usePortalAuth } from '../hooks/usePortalAuth'
import { getRedirectPath } from '../lib/utils/portal-auth.utils'

interface PortalAuthGuardProps {
  children: React.ReactNode
  requireAuth?: boolean
  requireEmailVerification?: boolean
  requireRegistrationComplete?: boolean
  requireOnboardingComplete?: boolean
  requireAdminRole?: boolean
  requireFacilitatorRole?: boolean
  requireStudentRole?: boolean
  redirectTo?: string
}

export function PortalAuthGuard({
  children,
  requireAuth = true,
  requireEmailVerification = false,
  requireRegistrationComplete = false,
  requireOnboardingComplete = false,
  requireAdminRole = false,
  requireStudentRole = false,
  requireFacilitatorRole = false,
  redirectTo,
}: PortalAuthGuardProps) {
  const router = useRouter()
  const {
    user,
    portalUser,
    loading,
    isAuthenticated,
    isEmailVerified,
    isRegistrationComplete,
    isOnboardingComplete,
  } = usePortalAuth()
  const [authChecked, setAuthChecked] = useState(false)

  useEffect(() => {
    if (loading) return
    const currentUserEmail = user?.email
    // Check authentication requirements
    if (requireAuth && !isAuthenticated) {
      router.push(redirectTo || '/portal/login')
      return
    }

    // Check role requirements
    if (requireAdminRole && portalUser?.role !== 'admin') {
      router.push('/portal/login')
      return
    }

    //  facilitator role check
    if (requireFacilitatorRole && portalUser?.role !== 'facilitator') {
      router.push('/portal/login')
      return
    }

    if (requireStudentRole && portalUser?.role !== 'student') {
      router.push('/portal/login')
      return
    }

    // For admin users, we might have different requirements
    if (portalUser?.role === 'admin') {
      // Admin users might not need the same onboarding process
      // Just check email verification for admins
      if (requireEmailVerification && !isEmailVerified) {
        router.push('/portal/verify')
        return
      }

      // Skip other onboarding requirements for admins
      setAuthChecked(true)
      return
    }

    // For facilitator
    if (portalUser?.role === 'facilitator') {
      // Facilitators might not need the same onboarding process as students
      // Just check email verification for facilitators
      if (requireEmailVerification && !isEmailVerified) {
        // Redirect to OTP verification page
        router.push(
          `/portal/verify?email=${encodeURIComponent(
            currentUserEmail || '',
          )}&role=facilitator`,
        )
        return
      }

      // Skip other onboarding requirements for facilitators
      setAuthChecked(true)
      return
    }

    // Student-specific checks (existing logic)()
    if (requireEmailVerification && !isEmailVerified) {
      router.push('/portal/verify')
      return
    }
    // if (portalUser?.role === 'student') {
    //   if (requireEmailVerification && !isEmailVerified) {
    //     router.push(
    //       `/portal/verify?email=${encodeURIComponent(
    //         currentUserEmail || '',
    //       )}&role=student`,
    //     )
    //     return
    //   }
    // }

    if (requireRegistrationComplete && !isRegistrationComplete) {
      // Determine where to redirect based on current progress
      if (portalUser) {
        const correctPath = getRedirectPath(portalUser, currentUserEmail)
        router.push(correctPath)
      } else {
        router.push('/portal')
      }
      return
    }

    if (requireOnboardingComplete && !isOnboardingComplete) {
      router.push('/portal/terms-and-conditions')
      return
    }

    // If we reach here, all checks passed
    setAuthChecked(true)
  }, [
    user,
    loading,
    isAuthenticated,
    isEmailVerified,
    isRegistrationComplete,
    isOnboardingComplete,
    requireAuth,
    requireEmailVerification,
    requireRegistrationComplete,
    requireOnboardingComplete,
    requireAdminRole,
    requireFacilitatorRole,
    requireStudentRole,
    portalUser,
    router,
    redirectTo,
  ])

  // Show loading spinner while checking auth
  if (loading || !authChecked) {
    return (
      <VStack w="full" h="100vh" alignItems="center" justifyContent="center">
        <Spinner size="lg" color="brand.primary" />
        <Text>Loading...</Text>
      </VStack>
    )
  }

  // Render children if all checks pass
  return <>{children}</>
}

// Higher Order Component version
export function withPortalAuth<P extends object>(
  WrappedComponent: React.ComponentType<P>,
  options: Omit<PortalAuthGuardProps, 'children'> = {},
) {
  const WithPortalAuthComponent = (props: P) => {
    return (
      <PortalAuthGuard {...options}>
        <WrappedComponent {...props} />
      </PortalAuthGuard>
    )
  }

  WithPortalAuthComponent.displayName = `WithPortalAuth(${
    WrappedComponent.displayName || WrappedComponent.name
  })`

  return WithPortalAuthComponent
}

// Utility components for common use cases
export const StudentAuthGuard = ({
  children,
}: {
  children: React.ReactNode
}) => {
  return (
    <PortalAuthGuard
      requireAuth={true}
      requireStudentRole={true}
      requireEmailVerification={true}
      requireRegistrationComplete={true}
      requireOnboardingComplete={true}
    >
      {children}
    </PortalAuthGuard>
  )
}

// Add FacilitatorAuthGuard component
export const FacilitatorAuthGuard = ({
  children,
}: {
  children: React.ReactNode
}) => (
  <PortalAuthGuard
    requireAuth={true}
    requireFacilitatorRole={true}
    requireEmailVerification={true}
  >
    {children}
  </PortalAuthGuard>
)

export const AdminAuthGuard = ({ children }: { children: React.ReactNode }) => (
  <PortalAuthGuard
    requireAuth={true}
    requireAdminRole={true}
    requireEmailVerification={true}
  >
    {children}
  </PortalAuthGuard>
)
