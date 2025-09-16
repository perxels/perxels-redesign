import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import { ResetPasswordForm } from './ResetPasswordForm'

export function ResetPasswordWrapper() {
  return (
    <Box w="100%" h="full" maxW="400px" mx="auto">
      <Heading as="h1" fontSize="5xl" fontFamily="Proxima Nova" textAlign="center" fontWeight="bold" color="brand.dark.100">
        Reset Password
      </Heading>

      <ResetPasswordForm />
    </Box>
  )
}

export default ResetPasswordWrapper


