import React from 'react'
import { VStack } from '@chakra-ui/react'
import { FacilitatorAuthGuard } from '../../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../../features/portal/facilitator/facilitator-layout'
import AttendanceDashboard from './attendance-dashboard'

const FacilitatorAttendancePage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={4}>
          <AttendanceDashboard />
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorAttendancePage
