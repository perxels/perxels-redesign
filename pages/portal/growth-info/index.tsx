import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { GrowthInfoFormWrapper } from '../../../features/portal/auth/growth-info-wrapper'
import { PortalAuthGuard } from '../../../components/PortalAuthGuard'

const GrowthInfo = () => {
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
          <GrowthInfoFormWrapper />
      </PortalAuthLayout>
    </PortalAuthGuard>
  )
}

export default GrowthInfo
