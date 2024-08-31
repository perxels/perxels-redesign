import { Box, HStack, Image, Text } from '@chakra-ui/react'
import React from 'react'
import { GiHamburgerMenu } from 'react-icons/gi'

const Topbar = ({ setNavState, user, title }: any) => {
  return (
    <HStack
      w="full"
      px="20px"
      h="70px"
      alignItems="center"
      shadow="sm"
      justifyContent="space-between"
    >
      <HStack alignItems="center">
        <Box mr="10px" display={['block', 'block', 'none', 'none']}>
          <GiHamburgerMenu onClick={() => setNavState(true)} />
        </Box>
        <Text as="h1" fontSize="1.2rem">
          {title}
        </Text>
      </HStack>
      <HStack alignItems="center" justifyContent="center">
        <Text as="span" display={['none', 'block', 'block', 'block']}>
          {user.email}
        </Text>
        <Image
          src={`https://api.dicebear.com/9.x/pixel-art/svg?seed=${user.email}`}
          w="45px"
          h="45px"
          border="1px solid purple"
          rounded="50%"
        />
      </HStack>
    </HStack>
  )
}

export default Topbar
