import { Card, CardBody, Center, SimpleGrid, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuItems = [
  {
    title: 'Profile',
    href: '/portal/facilitator/profile',
    icon: '/assets/icons/profile.svg',
  },
  {
    title: 'Attendance',
    href: '/portal/facilitator/attendance',
    icon: '/assets/icons/attandance.svg',
  },

  {
    title: 'Students',
    href: '/portal/facilitator/students',
    icon: '/assets/icons/students.svg',
  },

  {
    title: 'Tests & Results',
    href: '/portal/facilitator/tests',
    icon: '/assets/icons/test.png',
  },
  {
    title: 'Assigned Class',
    href: '/portal/facilitator/assigned',
    icon: '/assets/icons/facilAsign.svg',
  },
  {
    title: 'Student Of The Week',
    href: '/portal/facilitator/sotw',
    icon: '/assets/icons/sotw.png',
  },
  // {
  //   title: 'Notifications',
  //   href: '/portal/facilitator/notifications',
  //   icon: '/assets/icons/notification.svg',
  // },
]

export const FacilitatorDashboardMenu = () => {
  return (
    // stwitch to 3 ([2, 3]) later
    <SimpleGrid w="100%" gap={[4, 6, 10]} maxW="65rem" columns={[2, 3]} mt={10}>
      {menuItems.map((item) => (
        <Link href={item.href} key={item.title}>
          <Card
            borderRadius={'xl'}
            p={6}
            // py={8}
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            _hover={{
              transform: 'translateY(-4px)',
              boxShadow: '0 8px 25px rgba(0, 0, 0, 0.15)',
              bg: 'white',
            }}
            _active={{
              transform: 'translateY(-2px)',
              boxShadow: '0 4px 15px rgba(0, 0, 0, 0.1)',
            }}
          >
            <CardBody>
              <Center w={12} h={12} bg="brand.purple.500" borderRadius="full">
                <Image
                  src={item.icon}
                  alt={item.title}
                  width={28}
                  height={28}
                  style={{
                    filter: 'brightness(0) invert(1)',
                  }}
                />
              </Center>
              <Text fontSize="lg" fontWeight="bold" color="gray.600" mt={4}>
                {item.title}
              </Text>
            </CardBody>
          </Card>
        </Link>
      ))}
    </SimpleGrid>
  )
}
