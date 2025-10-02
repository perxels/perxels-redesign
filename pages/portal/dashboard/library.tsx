import React from 'react'
import { StudentAuthGuard } from '../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../features/portal/dashboard/dashboard-layout'
import { LibraryContent } from '../../../features/portal/dashboard/library/library-content'
import { HeaderInfo } from '../../../features/portal/dashboard/messages/header-info'
import StudentStatusGuard from '../../../components/StudentStatusGuard'

const StudentLibraryPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <StudentStatusGuard>
          <HeaderInfo title="Library" />
          <LibraryContent />
        </StudentStatusGuard>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentLibraryPage
