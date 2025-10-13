import React from 'react'
import { Box, VStack } from '@chakra-ui/react'
import { StudentAuthGuard } from '../../components/PortalAuthGuard'
import { DashboardLayout } from '../../features/portal/dashboard/dashboard-layout'
import { Welcome } from '../../features/portal/dashboard/welcome'
import { DashboardMenu } from '../../features/portal/dashboard/dashboard-menu'
import {
  useUnreadBadge,
  NotificationBadge,
} from '../../components/NotificationBadge'
import { usePortalAuth } from '../../hooks/usePortalAuth'
import DeactivatedStudentAlert from '../../components/student/DeactivatedStudentAlert'
import { SOTWDashboardCard } from '../../features/portal/dashboard/sotw/SOTWDashboardCard'

const PortalDashboardPage = () => {
  const { user, portalUser } = usePortalAuth()
  const hasUnread = useUnreadBadge({ userId: user?.uid })
  // Check if student is active
  const isActive = portalUser?.isStudentActive !== false

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <VStack w="100%" alignItems="flex-start" gap={6}>
          <Welcome />
          <NotificationBadge
            show={hasUnread}
            text="YOU HAVE A MESSAGE IN YOUR INBOX"
          />
          <SOTWDashboardCard />
          <Box width={'100%'}>
            {!isActive && <DeactivatedStudentAlert />}
            <DashboardMenu />
          </Box>
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default PortalDashboardPage
