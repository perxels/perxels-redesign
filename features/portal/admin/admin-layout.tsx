import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { DashboardHeader } from '../dashboard/dashboard-header'
import { AdminSidebar } from './admin-sidebar'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const PortalAdminLayout = ({ children }: DashboardLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      h="100vh"
      overflowY="hidden"
      bg="gray.50"
      w="100vw"
      display="flex"
      flexDirection={{ base: 'column', md: 'row' }}
    >
      {/* Sidebar: Drawer on mobile, visible on md+ */}
      {/* Desktop sidebar */}
      <Box display={{ base: 'none', md: 'flex' }}>
        <AdminSidebar />
      </Box>
      {/* Mobile sidebar drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent maxW="220px">
          <AdminSidebar />
        </DrawerContent>
      </Drawer>
      <Box w="100%">
        {/* You may want to add a menu button to DashboardHeader to call onOpen */}
        <DashboardHeader onOpenSidebar={onOpen} />
        <Box
          w="100%"
          h="calc(100vh - 98px)"
          overflowY="auto"
          p={{ base: '1rem', md: '2rem' }}
          pt={{ base: '1rem', md: '2rem' }}
          px={{ base: '1rem', md: '4rem' }}
        >
          {children}
        </Box>
      </Box>
    </Box>
  )
}
