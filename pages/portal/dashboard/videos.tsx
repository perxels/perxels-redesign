import React from 'react'
import { StudentAuthGuard } from '../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../features/portal/dashboard/dashboard-layout'
import { VideoLibrary } from '../../../features/portal/dashboard/videos/video-library'
import { HeaderInfo } from '../../../features/portal/dashboard/messages/header-info'

const StudentVideosPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <HeaderInfo title="Videos" />
        <VideoLibrary />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentVideosPage 