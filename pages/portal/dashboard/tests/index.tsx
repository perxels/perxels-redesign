import React from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { StudentTestsWrapper } from '../../../../features/portal/dashboard/tests'
import StudentStatusGuard from '../../../../components/StudentStatusGuard'

const StudentTestsPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <StudentStatusGuard>
          <StudentTestsWrapper />
        </StudentStatusGuard>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentTestsPage
