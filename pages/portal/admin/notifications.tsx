import React from 'react'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { NotificationsPage } from '../../../features/portal/admin/notifications/notifications-page'

const Notifications = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <NotificationsPage />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default Notifications