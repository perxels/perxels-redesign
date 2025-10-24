import React from 'react'
import { FacilitatorAuthGuard } from '../../../components/PortalAuthGuard'
import { FacilitatorLayout } from '../../../features/portal/facilitator/facilitator-layout'
import { VStack } from '@chakra-ui/react'
import { SOTWAdminView } from '../../../features/portal/admin/sotw/SOTWAdminView'
import { SOTWHistoryAdmin } from '../../../features/portal/admin/sotw/SOTWHistoryAdmin'

const FacilitatorSOTWPage = () => {
  return (
    <FacilitatorAuthGuard>
      <FacilitatorLayout>
        <SOTWAdminView />
        <SOTWHistoryAdmin />
        {/* <VStack w="100%" alignItems="flex-start" gap={4}>
          <div>FacilitatorSOTWPage</div>
        </VStack> */}
      </FacilitatorLayout>
    </FacilitatorAuthGuard>
  )
}

export default FacilitatorSOTWPage
