import React, { useState, useEffect } from 'react'
import { useRouter } from 'next/router'
import { StudentAuthGuard } from '../../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../../features/portal/dashboard/dashboard-layout'
import { TakeTestWrapper } from '../../../../../features/portal/dashboard/tests/TakeTestWrapper'

const TakeTestPage = () => {
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
        <TakeTestWrapper testId={testId as string} />
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default TakeTestPage
