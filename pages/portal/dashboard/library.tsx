import React from 'react'
import { StudentAuthGuard } from '../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../features/portal/dashboard/dashboard-layout'
import { LibraryContent } from '../../../features/portal/dashboard/library/library-content'
import { HeaderInfo } from '../../../features/portal/dashboard/messages/header-info'

const StudentLibraryPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <HeaderInfo title="Library" />
        <LibraryContent />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentLibraryPage
