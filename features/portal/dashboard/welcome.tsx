import { Avatar, Heading, HStack } from '@chakra-ui/react'
import React from 'react'
import { usePortalAuth } from '../../../hooks/usePortalAuth'

export const Welcome = () => {
  const { portalUser } = usePortalAuth()

  return (
    <HStack w="full" alignItems="center" justifyContent="space-between">
      <Heading size={{ base: "2xl", md: "4xl" }} fontWeight="bold" color="brand.dark.100">
        Welcome {portalUser?.fullName?.split(' ')[0]}
      </Heading>

      <Avatar
        size={{ base: "md", md: "xl" }}
        name={portalUser?.fullName}
        src={portalUser?.growthInfo?.pictureUrl}
      />
    </HStack>
  )
}
