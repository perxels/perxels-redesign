import React from 'react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { VStack } from '@chakra-ui/react'
import { AdminTestsWrapper } from '../../../features/portal/admin/tests'

const FacilitatorTestsPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <AdminTestsWrapper />
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorTestsPage
