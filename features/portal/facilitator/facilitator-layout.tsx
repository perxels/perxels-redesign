import {
  Box,
  Drawer,
  DrawerOverlay,
  DrawerContent,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { DashboardHeader } from '../dashboard/dashboard-header'
import { FacilitatorSidebar } from './facilitator-sidebar'

interface FacilitatorLayoutProps {
  children: React.ReactNode
}

export const FacilitatorLayout = ({ children }: FacilitatorLayoutProps) => {
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
      {/* Desktop sidebar */}
      <Box display={{ base: 'none', md: 'flex' }}>
        <FacilitatorSidebar />
      </Box>

      {/* Mobile sidebar drawer */}
      <Drawer isOpen={isOpen} placement="left" onClose={onClose} size="xs">
        <DrawerOverlay />
        <DrawerContent maxW="220px">
          <FacilitatorSidebar />
        </DrawerContent>
      </Drawer>

      <Box w="100%">
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
