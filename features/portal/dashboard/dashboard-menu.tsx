import {
  Card,
  CardBody,
  Center,
  HStack,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'

const menuItems = [
  {
    title: 'My Profile',
    href: '/portal/dashboard/profile',
  },
  {
    title: 'My School Fees',
    href: '/portal/dashboard/school-fees',
  },
  {
    title: 'Attendance',
    href: '/portal/dashboard/attendance',
  },
  {
    title: 'Videos',
    href: '/portal/dashboard/videos',
  },
]

export const DashboardMenu = () => {
  return (
    <SimpleGrid w="100%" gap={[4, 6, 10]} maxW="40rem" columns={2} mt={10}>
      {menuItems.map((item) => (
        <Link href={item.href} key={item.title}>
            <Card borderRadius={6} p={4} py={8} cursor="pointer">
            <CardBody>
                <Center w={12} h={12} bg="brand.purple.500" borderRadius="full" />

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
