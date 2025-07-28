import React from 'react'
import { AdminAuthGuard } from '../../../components/PortalAuthGuard'
import { PortalAdminLayout } from '../../../features/portal/admin/admin-layout'
import { VideoManagement } from '../../../features/portal/admin/videos/video-management'

const AdminVideosPage = () => {
  return (
    <AdminAuthGuard>
      <PortalAdminLayout>
        <VideoManagement />
      </PortalAdminLayout>
    </AdminAuthGuard>
  )
}

export default AdminVideosPage 