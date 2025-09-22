import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { FacilitatorList } from '../../../features/portal/admin/facilitators/facilitator-list'
import { FacilitatorHeaderActions } from '../../../features/portal/admin/facilitators/facilitator-header-actions'
import { Box } from '@chakra-ui/react'

const AdminFacilitatorsPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <Box w="full" h="full" gap={4} display="flex" flexDirection="column">
          <FacilitatorHeaderActions />
          <FacilitatorList />
        </Box>
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminFacilitatorsPage
