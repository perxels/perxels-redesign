import { Box, Text, Badge } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'
import { useAdminNotifications } from '../../../hooks/useAdminNotifications'

const sidebarItems = [
  {
    label: 'Home',
    icon: '/assets/icons/home.svg',
    href: '/portal/admin/overview',
  },
  {
    label: 'School Fees',
    icon: '/assets/icons/wallet.svg',
    href: '/portal/admin/school-fees',
  },
  {
    label: 'Classes',
    icon: '/assets/icons/graph.svg',
    href: '/portal/admin/classes',
  },
  {
    label: 'Videos',
    icon: '/assets/icons/video.svg',
    href: '/portal/admin/videos',
  },
  {
    label: 'Notifications',
    icon: '/assets/icons/notification.svg',
    href: '/portal/admin/notifications',
  },
]

export const AdminSidebar = () => {
  const { unreadCount } = useAdminNotifications()
  const router = useRouter()

  return (
    <Box
      h="100vh"
      w="20rem"
      bgColor="brand.purple.500"
      color="white"
      display="flex"
      flexDirection="column"
      justifyContent="center"
      alignItems="center"
      gap={8}
    >
      {sidebarItems.map((item) => {
        const isActive = router.pathname === item.href
        const isHomeActive = item.href === '/portal/admin/overview' && router.pathname === '/portal/admin/overview'
        
        return (
          <Link href={item.href} key={item.label}>
            <Box
              display="flex"
              cursor="pointer"
              flexDirection="column"
              alignItems="center"
              justifyContent="center"
              gap="1rem"
              p="1rem"
              position="relative"
              borderRadius="xl"
              transition="all 0.2s ease-in-out"
              bg={isActive || isHomeActive ? 'rgba(255, 255, 255, 0.15)' : 'transparent'}
              _hover={{
                bg: 'rgba(255, 255, 255, 0.1)',
                transform: 'translateY(-2px)',
                boxShadow: '0 4px 12px rgba(0, 0, 0, 0.15)',
              }}
              _active={{
                bg: 'rgba(255, 255, 255, 0.2)',
                transform: 'translateY(0px)',
                boxShadow: '0 2px 8px rgba(0, 0, 0, 0.2)',
              }}
              _before={isActive || isHomeActive ? {
                content: '""',
                position: 'absolute',
                left: 0,
                top: '50%',
                transform: 'translateY(-50%)',
                width: '4px',
                height: '60%',
                bg: 'white',
                borderRadius: '0 4px 4px 0',
              } : undefined}
            >
              <Box position="relative">
                <Image 
                  src={item.icon} 
                  alt={item.label} 
                  width={48} 
                  height={48}
                  style={{
                    filter: isActive || isHomeActive ? 'brightness(1.2)' : 'brightness(1)',
                    transition: 'filter 0.2s ease-in-out',
                  }}
                />
                {item.label === 'Notifications' && unreadCount > 0 && (
                  <Badge
                    position="absolute"
                    top="-8px"
                    right="-8px"
                    colorScheme="red"
                    borderRadius="full"
                    minW="20px"
                    h="20px"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    fontSize="12px"
                    fontWeight="bold"
                    animation={unreadCount > 0 ? 'pulse 2s infinite' : undefined}
                  >
                    {unreadCount > 99 ? '99+' : unreadCount}
                  </Badge>
                )}
              </Box>
              <Text
                fontSize="1.25rem"
                fontWeight={isActive || isHomeActive ? "bold" : "medium"}
                color="brand.white"
                textAlign="center"
                transition="all 0.2s ease-in-out"
                opacity={isActive || isHomeActive ? 1 : 0.9}
              >
                {item.label}
              </Text>
            </Box>
          </Link>
        )
      })}
    </Box>
  )
}
