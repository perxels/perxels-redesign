// pages/portal/facilitator/dashboard.tsx - NEW
import React from 'react'
import { VStack } from '@chakra-ui/react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { Welcome } from '../../../features/portal/dashboard/welcome'
import { FacilitatorDashboardMenu } from '../../../features/portal/facilitator/facilitator-dashboard-menu'

const FacilitatorDashboardPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={6}>
          <Welcome />
          <FacilitatorDashboardMenu />
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorDashboardPage
