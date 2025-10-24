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
import { useRouter } from 'next/router'

interface DashboardLayoutProps {
  children: React.ReactNode
}

export const DashboardLayout = ({ children }: DashboardLayoutProps) => {
  const { isOpen, onOpen, onClose } = useDisclosure()
  const router = useRouter()

  const hBgColor1 =
    router.pathname === '/portal/dashboard/sotw' ? '#121212' : undefined
  const hBgColor2 =
    router.pathname === '/portal/dashboard/sotw' ? 'brand.dark.200' : 'gray.50'
  const hPx1 =
    router.pathname === '/portal/dashboard/sotw'
      ? 0
      : { base: '1rem', md: '2rem' }
  const hPx2 =
    router.pathname === '/portal/dashboard/sotw'
      ? 0
      : { base: '1rem', md: '4rem' }
  const hPx3 =
    router.pathname === '/portal/dashboard/sotw'
      ? 0
      : { base: '1rem', md: '4rem' }

  return (
    <Box
      h="100vh"
      overflowY="hidden"
      bg={hBgColor2}
      w="100vw"
      display="flex"
      flexDirection="row"
    >
      {/* Desktop Sidebar */}
      <Box
        display={{ base: 'none', md: 'block' }}
        className={`${
          router.pathname === '/portal/dashboard/sotw'
            ? 'scroll-container'
            : null
        }`}
      >
        <DashboardSidebar />
      </Box>

      <Box w="100%">
        <Box bg={hBgColor1}>
          <DashboardHeader onOpenSidebar={onOpen} />
        </Box>
        <Box
          w="100%"
          h="calc(100vh - 98px)"
          p={hPx1}
          pt={hPx2}
          px={hPx3}
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
