import React from 'react'
import { AdminAuthGuard } from '../../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../../features/portal/admin/admin-layout'

const StudentOfTheWeekPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <div>StudentOfTheWeekPage</div>
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default StudentOfTheWeekPage
