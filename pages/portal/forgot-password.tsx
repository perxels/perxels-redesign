import React from 'react'
import { PortalAuthLayout } from '../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { PortalForgotPasswordWrapper } from '../../features/portal/forgot-password/PortalForgotPasswordWrapper'

const PortalForgotPasswordPage = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
      <PortalForgotPasswordWrapper />
    </PortalAuthLayout>
  )
}

export default PortalForgotPasswordPage


