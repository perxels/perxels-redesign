import React from 'react'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'
import { SOTWAdminView } from '../../../../features/portal/admin/sotw/SOTWAdminView'
import { SOTWHistoryAdmin } from '../../../../features/portal/admin/sotw/SOTWHistoryAdmin'

const AdminSOTWPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <SOTWAdminView />
        <SOTWHistoryAdmin />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminSOTWPage
