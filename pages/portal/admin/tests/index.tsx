import React from 'react'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
import { AdminTestsWrapper } from '../../../../features/portal/admin/tests'

const AdminTestsPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <AdminTestsWrapper />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminTestsPage
