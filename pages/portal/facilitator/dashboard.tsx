import React from 'react'
import { VStack } from '@chakra-ui/react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { Welcome } from '../../../features/portal/dashboard/welcome'
import { FacilitatorDashboardMenu } from '../../../features/portal/facilitator/facilitator-dashboard-menu'
import { FacilitatorDashboard } from '../../../features/portal/facilitator/facilitator-dashboard'
import { FacilitatorAlert } from '../../../features/portal/facilitator/facilitator-alert'
import { AssignmentAlert } from '../../../features/portal/facilitator/assignment-alert'

const FacilitatorDashboardPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={1}>
          <Welcome />
          {/* <FacilitatorDashboard /> */}
          {/* Profile Update Alert */}
          <FacilitatorAlert />

          {/* Assignment Alert */}
          <AssignmentAlert />

          {/* Dashboard Menu */}
          <FacilitatorDashboardMenu />
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorDashboardPage
