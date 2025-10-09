import React from 'react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { VStack } from '@chakra-ui/react'

const FacilitatorSOTWPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={4}>
          <div>FacilitatorSOTWPage</div>
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorSOTWPage
