import { Box, HStack, Image, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import withAuth from './withAuth'

const AdminLayout = ({ children, user }: any) => {
  return (
    <HStack spacing={0} alignItems="flex-start">
      {/* <Box w="250px" h="100vh" bg="brand.purple.500"></Box> */}
      <VStack w="full">
        <HStack
          w="full"
          px="20px"
          h="80px"
          alignItems="center"
          shadow="md"
          justifyContent="space-between"
        >
          <Text as="h1" fontSize="1.5rem">
            Perxels Admin
          </Text>{' '}
          <HStack alignItems="center" justifyContent="center">
            <Text as="span" display={['none', 'block', 'block', 'block']}>
              {user.email}
            </Text>
            <Image
              src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.email}`}
              w="60px"
              h="60px"
              border="1px solid purple"
              rounded="50%"
            />
          </HStack>
        </HStack>
        <Box p="20px" overflowY="scroll" w="full" maxH="90vh">
          {children}
        </Box>
      </VStack>
    </HStack>
  )
}

export default withAuth(AdminLayout)
