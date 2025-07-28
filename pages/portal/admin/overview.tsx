import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { OverviewWrapper } from '../../../features/portal/admin/overview'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import {
  useUnreadBadge,
  NotificationBadge,
} from '../../../components/NotificationBadge'
import { usePortalAuth } from '../../../hooks/usePortalAuth'
import { Welcome } from '../../../features/portal/dashboard/welcome'

const AdminOverview = () => {
  const { user } = usePortalAuth()
  // Adjust userField if your admin notifications use a different field
  const hasUnread = useUnreadBadge({ userId: user?.uid })
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <Welcome />
        <NotificationBadge
          show={hasUnread}
          text="YOU HAVE AN UNREAD NOTIFICATION"
          href="/portal/admin/notifications"
        />
        <OverviewWrapper />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminOverview
