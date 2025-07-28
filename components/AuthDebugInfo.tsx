import React from 'react'
import { Box, Text, VStack } from '@chakra-ui/react'
import { usePortalAuth } from '../hooks/usePortalAuth'
import { portalAuth } from '../portalFirebaseConfig'

export function AuthDebugInfo() {
  const { user, portalUser, loading, isAuthenticated } = usePortalAuth()

  if (process.env.NODE_ENV !== 'development') {
    return null
  }

  return (
    <Box p={4} bg="gray.100" borderRadius="md" fontSize="sm">
      <Text fontWeight="bold" mb={2}>
        Auth Debug Info:
      </Text>
      <VStack align="start" spacing={1}>
        <Text>Loading: {loading ? 'Yes' : 'No'}</Text>
        <Text>
          Firebase User:{' '}
          {user ? `${user.email} (${user.uid.slice(0, 8)}...)` : 'None'}
        </Text>
        <Text>Email Verified: {user?.emailVerified ? 'Yes' : 'No'}</Text>
        <Text>Portal User: {portalUser ? portalUser.email : 'None'}</Text>
        <Text>Authenticated: {isAuthenticated ? 'Yes' : 'No'}</Text>
        <Text>Auth Persistence: {portalAuth.app.name}</Text>
        <Text>Current Time: {new Date().toLocaleTimeString()}</Text>
      </VStack>
    </Box>
  )
}
