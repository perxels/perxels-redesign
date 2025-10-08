import React from 'react'
import {
  Alert,
  AlertDescription,
  AlertIcon,
  AlertTitle,
  Box,
  VStack,
} from '@chakra-ui/react'
import { StudentAuthGuard } from '../../components/PortalAuthGuard'
import { DashboardLayout } from '../../features/portal/dashboard/dashboard-layout'
import { Welcome } from '../../features/portal/dashboard/welcome'
import { DashboardMenu } from '../../features/portal/dashboard/dashboard-menu'
import {
  useUnreadBadge,
  NotificationBadge,
} from '../../components/NotificationBadge'
import { usePortalAuth } from '../../hooks/usePortalAuth'

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
          <Box width={'100%'}>
            {!isActive && (
              <Box width={'50%'}>
                <Alert
                  status="warning"
                  borderRadius="md"
                  mb={2}
                  variant="subtle"
                  flexDirection="column"
                  alignItems="flex-start"
                >
                  <Box display="flex" alignItems="center" mb={1}>
                    <AlertIcon />
                    <AlertTitle>Account Inactive</AlertTitle>
                  </Box>
                  <AlertDescription>
                    You are not currently an Active Student.
                  </AlertDescription>
                </Alert>
              </Box>
            )}
            <DashboardMenu />
          </Box>
        </VStack>
      </DashboardLayout>
    </StudentAuthGuard>
  )
}

export default PortalDashboardPage
