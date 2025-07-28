import { Avatar, Heading, HStack, Icon } from '@chakra-ui/react'
import React from 'react'
import { usePortalAuth } from '../../../../hooks/usePortalAuth'
import { FaArrowLeft } from 'react-icons/fa'

interface HeaderInfoProps {
  title?: string;
  onBack?: () => void;
}

export const HeaderInfo = ({ title = 'Inbox', onBack }: HeaderInfoProps) => {
  const { portalUser } = usePortalAuth()

  return (
    <HStack w="full" alignItems="center" justifyContent="space-between">
      <HStack gap={4} alignItems="center">
        {onBack && (
          <Icon as={FaArrowLeft} fontSize="2xl" onClick={onBack} cursor="pointer" />
        )}
        {title && (
          <Heading size="4xl" fontWeight="bold" color="brand.dark.100">
            {title}
          </Heading>
        )}
      </HStack>

      <Avatar
        size="xl"
        name={portalUser?.fullName}
        src={portalUser?.growthInfo?.pictureUrl}
      />
    </HStack>
  )
}
