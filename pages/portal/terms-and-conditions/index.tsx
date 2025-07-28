import { useRouter } from 'next/navigation'
import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout';
import { TermsAndConditionsWrapper } from '../../../features/portal/auth/terms-and-conditions-wrapper';
import { PortalAuthGuard } from '../../../components/PortalAuthGuard'

const TermsAndConditions = () => {
    const router = useRouter();
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
        <TermsAndConditionsWrapper />
      </PortalAuthLayout>
    </PortalAuthGuard>
  )
}

export default TermsAndConditions