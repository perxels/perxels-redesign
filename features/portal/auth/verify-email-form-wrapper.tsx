import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { VerifyEmailForm } from './verify-email-form'
import { useSearchParams } from 'next/navigation'

export const VerifyEmailFormWrapper = () => {
    const searchParams = useSearchParams()
    const email = searchParams.get('email')
  return (
    <Box w="100%" h="full">
        <Heading as="h1" fontSize={["5xl", "7xl"]} fontFamily="Proxima Nova" fontWeight="bold" color="brand.dark.100">
            Verify Email
        </Heading>

        <Text fontSize={["md", "xl"]} color="brand.dark.100" py={3}>
            Please enter the 6 digit code sent to <Text as="span" fontWeight="bold">{email}</Text>
        </Text>

        <VerifyEmailForm />
    </Box>
  )
}
