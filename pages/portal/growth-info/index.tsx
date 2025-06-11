import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { GrowthInfoFormWrapper } from '../../../features/portal/auth/growth-info-wrapper'

const SchoolFeeInfo = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
        <GrowthInfoFormWrapper />
    </PortalAuthLayout>
  )
}

export default SchoolFeeInfo
