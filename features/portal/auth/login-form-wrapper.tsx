import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import { LoginForm } from './login-form'

export const LoginFormWrapper = () => {
  return (
    <Box w="100%" h="full">
      <Heading
        as="h1"
        fontSize="7xl"
        fontFamily="Proxima Nova"
        fontWeight="bold"
        color="brand.dark.100"
      >
        Login
      </Heading>
      <LoginForm />
    </Box>
  )
}
