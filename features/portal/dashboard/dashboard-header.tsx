import { Box, Button, HStack } from '@chakra-ui/react'
import { signOut } from 'firebase/auth'
import Image from 'next/image'
import React from 'react'
import { portalAuth } from '../../../portalFirebaseConfig'
import { useRouter } from 'next/navigation'
import { RxHamburgerMenu } from 'react-icons/rx'

interface DashboardHeaderProps {
  onOpenSidebar?: () => void
}

export const DashboardHeader = ({ onOpenSidebar }: DashboardHeaderProps) => {
  const router = useRouter()

  const handleSignOut = async () => {
    try {
      await signOut(portalAuth)
      router.push('/portal/login')
    } catch (error) {
      console.error('Error signing out:', error)
    }
  }

  return (
    <HStack
      w="100%"
      h="6rem"
      p="2rem"
      px={{ base: '1rem', md: '4rem' }}
      justifyContent="space-between"
      alignItems="center"
    >
      {onOpenSidebar && (
        <Button
          onClick={onOpenSidebar}
          display={{ base: 'flex', md: 'none' }}
          variant="outline"
        >
          <RxHamburgerMenu />
        </Button>
      )}
      <Box w={{ base: '100px', md: '180px' }}>
        <Image
          src="/assets/images/perxels-color-logo.svg"
          alt="perxels-color-logo"
          width={180}
          height={40}
          style={{ width: '100%', height: 'auto' }}
        />
      </Box>

      <Button onClick={handleSignOut} variant="outline">
        Sign Out
      </Button>
    </HStack>
  )
}
