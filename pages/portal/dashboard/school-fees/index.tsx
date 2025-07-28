import React from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { VStack } from '@chakra-ui/react'
import { HeaderAction } from '../../../../features/portal/dashboard/school-fees/header-action'
import { FeeStatsCards } from '../../../../features/portal/dashboard/school-fees/fee-stats-cards'
import { PaymentHistory } from '../../../../features/portal/dashboard/school-fees/payment-history'

const SchoolFeesPage = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <VStack w="100%" alignItems="flex-start" gap={6}>
            <HeaderAction />
            <FeeStatsCards />
            <PaymentHistory />
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default SchoolFeesPage