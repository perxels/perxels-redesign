import React from 'react'
import {
  Alert,
  AlertIcon,
  AlertTitle,
  AlertDescription,
  VStack,
  HStack,
  Button,
  Link,
  Text,
  Box,
} from '@chakra-ui/react'
import { useFacilitatorProfileCheck } from '../../../hooks/useFacilitatorProfileCheck'

export const FacilitatorAlert: React.FC = () => {
  const { needsProfileUpdate, getMissingFields } = useFacilitatorProfileCheck()

  if (!needsProfileUpdate()) {
    return null
  }

  const missingFields = getMissingFields()
  // const needsPasswordChange = missingFields.includes('Password Change')
  const needsProfileInfo = missingFields.filter(
    (field) => field !== 'Password Change',
  )

  return (
    <Alert
      status="warning"
      borderRadius="lg"
      mb={2}
      flexDirection={{ base: 'column', md: 'row' }}
      alignItems={{ base: 'flex-start' }}
    >
      <AlertIcon />
      <Box flex="1">
        <AlertTitle mb={2}>Action Required: Complete Your Profile</AlertTitle>
        <AlertDescription>
          <VStack align="start" spacing={1}>
            {/* Please update your profile information to continue using all
              features. */}
            <Text>Kindly update your profile information...</Text>

            {needsProfileInfo.length > 0 && (
              <>
                <Text fontSize="sm">
                  <strong>Missing Profile fields:</strong>{' '}
                  {needsProfileInfo.join(', ')}
                </Text>
                <Text fontSize="md">
                  <strong>Security:</strong> Please change your default password
                  if you haven&apos;t changed it..!!
                </Text>
              </>
            )}

            {/* {needsPasswordChange && (
              <Text fontSize="sm">
                <strong>Security:</strong> Please change your default password
              </Text>
            )} */}
          </VStack>
        </AlertDescription>
      </Box>

      <HStack spacing={3} mt={{ base: 3, md: 0 }} ml={{ base: 0, md: 3 }}>
        <Link href="/portal/facilitator/profile">
          <Button size="sx" colorScheme="blue" px={4}>
            Update Profile
          </Button>
        </Link>

        {/* {needsPasswordChange && (
          <Button
            size="sm"
            variant="outline"
            colorScheme="orange"
            onClick={() => router.push('/portal/facilitator/change-password')}
          >
            Change Password
          </Button>
        )} */}
      </HStack>
    </Alert>
  )
}
