import React from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { SOTWDetailsView } from '../../../../features/portal/dashboard/sotw/SOTWDetailsView'
import { SOTWHistory } from '../../../../features/portal/dashboard/sotw/SOTWHistory'
import { SOTWDetailsViewV2 } from '../../../../features/portal/dashboard/sotw/SOTWDetailsViewV2'

const StudentSOTWPage = () => {
  return (
    <>
      <StudentAuthGuard>
        <DashboardLayout>
          <SOTWDetailsViewV2 />
          <SOTWHistory />
        </DashboardLayout>
      </StudentAuthGuard>
    </>
  )
}

export default StudentSOTWPage
