import React from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { SOTWDetailsView } from '../../../../features/portal/dashboard/sotw/SOTWDetailsView'
import { SOTWHistory } from '../../../../features/portal/dashboard/sotw/SOTWHistory'

const StudentSOTWPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <SOTWDetailsView />
        <SOTWHistory />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default StudentSOTWPage
