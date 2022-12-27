import { Box, Flex, Img } from '@chakra-ui/react'
import React from 'react'
import { Logo } from '../../components'

const SideImage = () => {
  return (
    <Flex
      bg="brand.pink.700"
      w="full"
      h="full"
      px="2rem"
      alignItems="flex-end"
      position="relative"
      display={['none', 'none', 'none', 'flex']}
    >
      <Box pos="absolute" top="3.125rem" left="6.25rem">
        <Logo color="#fff" />
      </Box>
      <Img
        src="/assets/images/register/registerHero.png"
        alt="Register Hero"
        w="100%"
        maxW="500px"
        mx="auto"
      />
    </Flex>
  )
}

export default SideImage
