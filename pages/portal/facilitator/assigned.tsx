import React from 'react'
import { VStack } from '@chakra-ui/react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { AssignedClasses } from '../../../features/portal/facilitator/assigned-classes'

const FacilitatorAssignedPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={4}>
          <AssignedClasses />
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorAssignedPage
