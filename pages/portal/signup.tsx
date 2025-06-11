import React from 'react'
import { PortalAuthLayout } from '../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { SignUpFormWrapper } from '../../features/portal/auth/sign-up-form-wrapper'

const StudentPortalSignup = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
      <SignUpFormWrapper />
    </PortalAuthLayout>
  )
}

export default StudentPortalSignup
