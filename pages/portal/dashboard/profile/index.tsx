import React from 'react'
import { StudentAuthGuard } from '../../../../components/PortalAuthGuard'
import { DashboardLayout } from '../../../../features/portal/dashboard/dashboard-layout'
import { VStack } from '@chakra-ui/react'
import { ProfileDetail } from '../../../../features/portal/dashboard/profile-detail'
import StudentStatusGuard from '../../../../components/StudentStatusGuard'

const DashboardProfile = () => {
  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <StudentStatusGuard>
          <VStack w="full" gap={6}>
            <ProfileDetail />
          </VStack>
        </StudentStatusGuard>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default DashboardProfile
