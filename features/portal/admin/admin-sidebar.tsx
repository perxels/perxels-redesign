import { Box, Text, Badge } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
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
      {sidebarItems.map((item) => (
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
          >
            <Box position="relative">
              <Image src={item.icon} alt={item.label} width={48} height={48} />
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
                >
                  {unreadCount > 99 ? '99+' : unreadCount}
                </Badge>
              )}
            </Box>
            <Text
              fontSize="1.25rem"
              fontWeight="medium"
              color="brand.white"
              textAlign="center"
            >
              {item.label}
            </Text>
          </Box>
        </Link>
      ))}
    </Box>
  )
}
