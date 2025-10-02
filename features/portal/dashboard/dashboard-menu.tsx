import { Card, CardBody, Center, SimpleGrid, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuItems = [
  {
    title: 'My Profile',
    href: '/portal/dashboard/profile',
    icon: '/assets/icons/profile.svg',
  },
  {
    title: 'My School Fees',
    href: '/portal/dashboard/school-fees',
    icon: '/assets/icons/wallet.svg',
  },
  {
    title: 'Attendance',
    href: '/portal/dashboard/attendance-v2',
    icon: '/assets/icons/attandance.svg',
  },
  {
    title: 'Library',
    href: '/portal/dashboard/library',
    icon: '/assets/icons/video.svg',
  },
  {
    title: 'Syllabus',
    href: '/portal/dashboard/syllabus',
    icon: '/assets/icons/syllabus.svg',
  },
  {
    title: 'Tests',
    href: '/portal/dashboard/tests',
    icon: '/assets/icons/test.png',
  },
]

export const DashboardMenu = () => {
  return (
    <SimpleGrid w="100%" gap={[4, 6, 10]} maxW="65rem" columns={[2, 3]} mt={10}>
      {menuItems.map((item) => (
        <Link href={item.href} key={item.title}>
          <Card borderRadius={6} p={4} py={8} cursor="pointer">
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
