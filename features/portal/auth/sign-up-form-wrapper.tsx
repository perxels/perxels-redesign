import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import { AuthStepper } from './auth-stepper'
import { SignUpForm } from './sign-up-form'

export const SignUpFormWrapper = () => {
  return (
    <Box w="100%" h="full">
        <Heading as="h1" fontSize={["5xl", "7xl"]} fontFamily="Proxima Nova" fontWeight="bold" color="brand.dark.100">
            Let&apos;s get you started.
        </Heading>

        <AuthStepper currentStep={0} />

        <SignUpForm />
    </Box>
  )
}
