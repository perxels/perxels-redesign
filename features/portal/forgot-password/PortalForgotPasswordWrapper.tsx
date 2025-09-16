import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import { PortalForgotPasswordForm } from './PortalForgotPasswordForm'

export function PortalForgotPasswordWrapper() {
  return (
    <Box w="100%" h="full" maxW="400px" mx="auto">
      <Heading as="h1" fontSize="5xl" fontFamily="Proxima Nova" textAlign="center" fontWeight="bold" color="brand.dark.100">
        Forgot Password
      </Heading>

      <PortalForgotPasswordForm />
    </Box>
  )
}

export default PortalForgotPasswordWrapper


