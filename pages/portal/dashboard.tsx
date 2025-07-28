import React from 'react'
import { VStack } from '@chakra-ui/react'
import { StudentAuthGuard } from '../../components/PortalAuthGuard'
import { DashboardLayout } from '../../features/portal/dashboard/dashboard-layout'
import { Welcome } from '../../features/portal/dashboard/welcome'
import { DashboardMenu } from '../../features/portal/dashboard/dashboard-menu'
import { useUnreadBadge, NotificationBadge } from '../../components/NotificationBadge'
import { usePortalAuth } from '../../hooks/usePortalAuth'

const PortalDashboardPage = () => {
  const { user } = usePortalAuth()
  const hasUnread = useUnreadBadge({ userId: user?.uid })

  return (
    <StudentAuthGuard>
      <DashboardLayout>
        <VStack w="100%" alignItems="flex-start" gap={6}>
          <Welcome />
          <NotificationBadge show={hasUnread} text="YOU HAVE A MESSAGE IN YOUR INBOX" />
          <DashboardMenu />
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default PortalDashboardPage 