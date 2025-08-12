import {
  Card,
  CardBody,
  Center,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

const menuItems = [
  {
    title: 'School Fees',
    href: '/portal/admin/school-fees',
  },
  {
    title: 'Classes',
    href: '/portal/admin/classes',
  },
  {
    title: 'Students',
    href: '/portal/admin/students',
  },
  {
    title: 'Notifications',
    href: '/portal/admin/notifications',
  },
  {
    title: 'Attendance',
    href: '/portal/admin/attendance',
  },
  {
    title: 'Videos',
    href: '/portal/admin/videos',
  },
]

export const OverviewWrapper = () => {
  return (
    <VStack w="full" gap={6} alignItems="flex-start">
      <SimpleGrid w="full" gap={[4, 6, 10]} maxW={["100%", "100%", "60rem"]} columns={[2, 3]} mt={10}>
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card borderRadius={6} p={4} py={8} cursor="pointer">
              <CardBody>
                <Center
                  w={12}
                  h={12}
                  bg="brand.purple.500"
                  borderRadius="full"
                />

                <Text fontSize="lg" fontWeight="bold" color="gray.600" mt={4}>
                  {item.title}
                </Text>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
