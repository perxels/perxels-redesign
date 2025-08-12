import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { VerifyEmailForm } from './verify-email-form'
import { useSearchParams } from 'next/navigation'
import { usePortalAuth } from '../../../hooks/usePortalAuth'

export const VerifyEmailFormWrapper = () => {
    const searchParams = useSearchParams()
    const { user, portalUser } = usePortalAuth()
    
    // Get email from URL params first, then fall back to authenticated user
    const urlEmail = searchParams.get('email')
    const userEmail = user?.email || portalUser?.email || ''
    const email = urlEmail || userEmail
    
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
