import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout'
import { useRouter } from 'next/navigation'
import { SchoolFeeFormWrapper } from '../../../features/portal/auth/school-fee-form-wrapper'

const SchoolFeeInfo = () => {
  const router = useRouter()
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
        <SchoolFeeFormWrapper />
    </PortalAuthLayout>
  )
}

export default SchoolFeeInfo
