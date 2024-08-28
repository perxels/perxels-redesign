import React from 'react'
import AdminLayout from '../../features/admin/layout/AdminLayout'
import { Button, HStack, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'

const AdminOverview = () => {
  return (
    <AdminLayout>
      <HStack mt="10px" alignItems="center">
        <Text as="h1" fontSize="1.8rem">
          Welcome, Admin
        </Text>
        <Image src="/assets/icons/wave.png" width={30} height={30} alt="wave" />
      </HStack>

      <HStack
        justifyContent={['center', 'center', 'initial', 'initial']}
        flexWrap="wrap"
        gap="30px"
        mt="30px"
      >
        <VStack
          alignItems="flex-start"
          p="20px"
          rounded="20px"
          w={['full', '350px']}
          bg="#A30000"
          color="white"
        >
          <Text as="h2" color="white">
            Complete your profile
          </Text>
          <Text as="span">Get discovered by clients</Text>

          <Button size="sm" bg="black" mt="40px" alignSelf="flex-end">
            Build Profile
          </Button>
        </VStack>
        <VStack
          alignItems="flex-start"
          p="20px"
          rounded="20px"
          w={['full', '350px']}
          bg="#514B23"
          color="white"
        >
          <Text as="h2" color="white">
            Complete your profile
          </Text>
          <Text as="span">Get discovered by clients</Text>

          <Button size="sm" bg="black" mt="40px" alignSelf="flex-end">
            Build Profile
          </Button>
        </VStack>
        <VStack
          alignItems="flex-start"
          p="20px"
          rounded="20px"
          w={['full', '350px']}
          bg="#f4d06f"
          color="black"
        >
          <Text as="h2" color="black">
            Complete your profile
          </Text>
          <Text as="span">Get discovered by clients</Text>

          <Button size="sm" mt="40px" bg="black" alignSelf="flex-end">
            Build Profile
          </Button>
        </VStack>
      </HStack>
    </AdminLayout>
  )
}

export default AdminOverview
