import React from 'react'
import { useRouter } from 'next/router'
import { StudentAuthGuard } from '../../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../../features/portal/dashboard/dashboard-layout'
import { TestResults } from '../../../../../features/portal/dashboard/tests/TestResults'

const TestResultsPage = () => {
  const router = useRouter()
  const { testId } = router.query

  if (!testId) {
    return (
      <StudentAuthGuard>
        <DashboardLayout>
          <div>Loading...</div>
        </DashboardLayout>
      </StudentAuthGuard>
    )
  }

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <TestResults testId={testId as string} />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default TestResultsPage
