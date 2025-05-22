import React from 'react'
import { SignUpWrapper } from '../../features/library/sign-up/SignUpWrapper'
import { Box, Center, Heading } from '@chakra-ui/react'

const LibrarySignUp = () => {
  return (
    <Box w="100%" h="100vh">
      <SignUpWrapper />

      {/* <Center h="full" w="full">
        <Heading textTransform="uppercase" as="h1" fontSize={["2.5rem", "5rem"]} fontWeight={900} textAlign="center">Coming Soon</Heading>
      </Center> */}
    </Box>
  )
}

export default LibrarySignUp