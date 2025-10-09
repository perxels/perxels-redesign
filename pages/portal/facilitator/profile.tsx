import React from 'react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { VStack } from '@chakra-ui/react'
import { ProfileDetail } from '../../../features/portal/facilitator/profile-detail'

const FacilitatorProfilePage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <VStack w="100%" alignItems="flex-start" gap={4}>
          <ProfileDetail />
        </VStack>
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorProfilePage
