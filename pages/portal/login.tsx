import React from 'react'
import { PortalAuthLayout } from '../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { LoginFormWrapper } from '../../features/portal/auth/login-form-wrapper'

const LoginPage = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
      <LoginFormWrapper />
    </PortalAuthLayout>
  )
}

export default LoginPage
