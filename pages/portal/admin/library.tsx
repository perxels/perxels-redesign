import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { LibraryManagement } from '../../../features/portal/admin/library/library-management'

const AdminLibraryPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <LibraryManagement />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminLibraryPage
