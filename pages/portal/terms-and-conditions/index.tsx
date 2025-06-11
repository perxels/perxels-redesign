import { useRouter } from 'next/navigation'
import React from 'react'
import { PortalAuthLayout } from '../../../features/portal/auth/auth-layout';
import { TermsAndConditionsWrapper } from '../../../features/portal/auth/terms-and-conditions-wrapper';

const TermsAndConditions = () => {
    const router = useRouter();
  return (
    <PortalAuthLayout
      onBack={() => router.back()}
      onClose={() => router.push('/portal')}
    >
      <TermsAndConditionsWrapper />
    </PortalAuthLayout>
  )
}

export default TermsAndConditions