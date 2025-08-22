import {
  Box,
  useDisclosure,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  DrawerCloseButton,
} from '@chakra-ui/react'
import React from 'react'
import { DashboardSidebar } from './dashboard-sidebar'
import { DashboardHeader } from './dashboard-header'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()

  return (
    <Box
      h="100vh"
      overflowY="hidden"
      bg="gray.50"
      w="100vw"
      display="flex"
      flexDirection="row"
    >
      {/* Desktop Sidebar */}
      <Box display={{ base: 'none', md: 'block' }}>
        <DashboardSidebar />
      </Box>

      <Box w="100%">
        <DashboardHeader onOpenSidebar={onOpen} />

        <Box
          w="100%"
          h="calc(100vh - 98px)"
          p={{ base: '1rem', md: '2rem' }}
          pt={{ base: '1rem', md: '4rem' }}
          px={{ base: '1rem', md: '4rem' }}
          overflowY="auto"
        >
          {children}
        </Box>
      </Box>

      {/* Mobile Sidebar Drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="full">
        <DrawerOverlay />
        <DrawerContent bg="brand.purple.500">
          <DrawerCloseButton color="white" />
          <Box
            h="100vh"
            display="flex"
            flexDirection="column"
            justifyContent="center"
            alignItems="center"
            gap={8}
            pt={16}
          >
            <DashboardSidebar />
          </Box>
        </DrawerContent>
      </Drawer>
    </Box>
  )
}
