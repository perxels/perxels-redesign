import { Card, CardBody, Center, SimpleGrid, Text } from '@chakra-ui/react'
import Image from 'next/image'
import Link from 'next/link'
import React from 'react'

const menuItems = [
  {
    title: 'Attendance',
    href: '/portal/facilitator/attendance',
    icon: '/assets/icons/attandance.svg',
  },
  {
    title: 'Student List',
    href: '/portal/facilitator/students',
    icon: '/assets/icons/students.svg',
  },
  {
    title: 'Create Test',
    href: '/portal/facilitator/tests/create',
    icon: '/assets/icons/test.svg',
  },
  {
    title: 'Performance',
    href: '/portal/facilitator/performance',
    icon: '/assets/icons/graph.svg',
  },
]

export const FacilitatorDashboardMenu = () => {
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
                  width={24}
                  height={24}
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
