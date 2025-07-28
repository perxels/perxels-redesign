import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { VerifyEmailFormWrapper } from '../../../features/portal/auth/verify-email-form-wrapper'
import { PortalAuthGuard } from '../../../components/PortalAuthGuard'

const VerifyEmail = () => {
  const router = useRouter()
  return (
    <PortalAuthGuard requireAuth={true}>
      <PortalAuthLayout
        onBack={() => router.back()}
        onClose={() => router.push('/portal')}
      >
        <VerifyEmailFormWrapper />
      </PortalAuthLayout>
    </PortalAuthGuard>
  )
}

export default VerifyEmail
