import { Box, Heading } from '@chakra-ui/react'
import React from 'react'
import { AuthStepper } from './auth-stepper'
import { GrowthInfoForm } from './growth-info-form'

export const GrowthInfoFormWrapper = () => {
  return (
    <Box w="100%" h="full">
      <Heading
        as="h1"
        fontSize={["5xl", "7xl"]}
        fontFamily="Proxima Nova"
        fontWeight="bold"
        color="brand.dark.100"
      >
        Growth Information
      </Heading>

      <AuthStepper currentStep={3} />

      <GrowthInfoForm />
    </Box>
  )
}
