import React from 'react'
import { PortalAuthLayout } from '../../features/portal/auth/auth-layout'
import { useRouter } from 'next/router'
import { ResetPasswordWrapper } from '../../features/portal/forgot-password/ResetPasswordWrapper'

const ResetPasswordPage = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout onBack={() => router.back()} onClose={() => router.push('/portal')}>
      <ResetPasswordWrapper />
    </PortalAuthLayout>
  )
}

export default ResetPasswordPage


