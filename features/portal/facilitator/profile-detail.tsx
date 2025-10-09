import {
  Box,
  Heading,
  VStack,
  Flex,
  useBreakpointValue,
} from '@chakra-ui/react'
import React from 'react'
import { ProfileImageUpdater } from '../dashboard/profile-image-updater'
import { ProfileDetailsForm } from './profile-details-form'

export const ProfileDetail = () => {
  // Responsive image size and box size
  const imageSize = useBreakpointValue({ base: 'sm', md: 'xl', lg: '2xl' }) as
    | 'sm'
    | 'md'
    | 'lg'
    | 'xl'
    | '2xl'
  const imageBoxSize = useBreakpointValue({
    base: '120px',
    md: '260px',
    lg: '400px',
  })

  return (
    <Box width={'100%'}>
      <Heading
        fontSize={{ base: 'xl', md: '2xl', lg: '3xl' }}
        fontWeight="bold"
        color="brand.dark.100"
        textAlign={{ base: 'center', md: 'left' }}
      >
        My Profile
      </Heading>
      <Flex
        direction={{ base: 'column', md: 'row' }}
        align={{ base: 'flex-start', md: 'center' }}
        justify="flex-start"
        w="full"
        minH="80vh"
        gap={{ base: 8, md: 14 }}
        px={{ base: 4, md: 10 }}
        py={{ base: 8, md: 16 }}
        // bg="red"
        bg="gray.50"
      >
        {/* Left: Image and Heading */}
        <VStack
          spacing={6}
          align={{ base: 'center', md: 'flex-start' }}
          w={{ base: 'full', md: 'auto' }}
          flexShrink={0}
        >
          <Box
            w={imageBoxSize}
            h={imageBoxSize}
            display="flex"
            alignItems="center"
            justifyContent="center"
            borderRadius="full"
            overflow="hidden"
            bg="white"
            boxShadow="md"
          >
            <ProfileImageUpdater
              size={imageSize || 'xl'}
              showEditButton={true}
            />
          </Box>
        </VStack>

        {/* Right: Form */}
        <Box
          w="full"
          maxW={{ base: '100%', md: '500px' }}
          bg="white"
          borderRadius="xl"
          boxShadow="md"
          p={{ base: 4, md: 8 }}
          mx="auto"
        >
          <ProfileDetailsForm />
        </Box>
      </Flex>
    </Box>
  )
}
