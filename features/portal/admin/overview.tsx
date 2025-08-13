import {
  Card,
  CardBody,
  Center,
  Link,
  SimpleGrid,
  Text,
  VStack,
  Box,
} from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

const menuItems = [
  {
    title: 'School Fees',
    href: '/portal/admin/school-fees',
    icon: '/assets/icons/wallet.svg',
  },
  {
    title: 'Classes',
    href: '/portal/admin/classes',
    icon: '/assets/icons/graph.svg',
  },
  {
    title: 'Students',
    href: '/portal/admin/students',
    icon: '/assets/icons/students.svg',
  },
  {
    title: 'Notifications',
    href: '/portal/admin/notifications',
    icon: '/assets/icons/notification.svg',
  },
  {
    title: 'Attendance',
    href: '/portal/admin/attendance',
    icon: '/assets/icons/attandance.svg',
  },
  {
    title: 'Videos',
    href: '/portal/admin/videos',
    icon: '/assets/icons/video.svg',
  },
]

export const OverviewWrapper = () => {
  return (
    <VStack w="full" gap={6} alignItems="flex-start">
      <SimpleGrid w="full" gap={[4, 6, 10]} maxW={["100%", "100%", "60rem"]} columns={[2, 3]} mt={10}>
        {menuItems.map((item) => (
          <Link href={item.href} key={item.title}>
            <Card 
              borderRadius="xl" 
              p={6} 
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
                <VStack spacing={4} align="flex-start">
                  <Box
                    w={16}
                    h={16}
                    bg="brand.purple.500"
                    borderRadius="full"
                    display="flex"
                    alignItems="center"
                    justifyContent="center"
                    p={3}
                  >
                    <Image 
                      src={item.icon} 
                      alt={item.title} 
                      width={32} 
                      height={32}
                      style={{
                        filter: 'brightness(0) invert(1)',
                      }}
                    />
                  </Box>

                  <Text 
                    fontSize="lg" 
                    fontWeight="bold" 
                    color="gray.700" 
                    textAlign="left"
                  >
                    {item.title}
                  </Text>
                </VStack>
              </CardBody>
            </Card>
          </Link>
        ))}
      </SimpleGrid>
    </VStack>
  )
}
