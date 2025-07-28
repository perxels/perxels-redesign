import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { SchoolFeeFormWrapper } from '../../../features/portal/auth/school-fee-form-wrapper'
import { PortalAuthGuard } from '../../../components/PortalAuthGuard'

const SchoolFeeInfo = () => {
  const router = useRouter()
  return (
    <PortalAuthGuard
      requireAuth={true}
      requireEmailVerification={true}
      requireRegistrationComplete={false}
    >
      <PortalAuthLayout
        onBack={() => router.back()}
        onClose={() => router.push('/portal')}
      >
          <SchoolFeeFormWrapper />
      </PortalAuthLayout>
    </PortalAuthGuard>
  )
}

export default SchoolFeeInfo
