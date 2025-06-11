import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { VerifyEmailFormWrapper } from '../../../features/portal/auth/verify-email-form-wrapper'

const VerifyEmail = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
      <VerifyEmailFormWrapper />
    </PortalAuthLayout>
  )
}

export default VerifyEmail
