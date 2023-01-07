import React from 'react'
import { Box, HStack, Heading, Text } from '@chakra-ui/react'
import { FaBehance, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { BsMessenger } from 'react-icons/bs'

export const ContactStudent = () => {
  return (
    <Box
      display={'flex'}
      flexDirection={'column'}
      justifyContent={'center'}
      w="full"
      alignItems={'center'}
      mt={16}
    >
      <Heading
        as="h2"
        fontSize={{ base: '2.5rem', md: '3.5rem' }}
        color="brand.white"
      >
        <Text as="span" color="brand.gray.400">
          Get{' '}
        </Text>
        in touch
      </Heading>
      <Text
        fontSize={{ base: '1.125rem', md: '1.125rem' }}
        color="#E3E4E6"
        mt={5}
        textAlign="center"
      >
        Learn more about the designer and contact them.
      </Text>
      <HStack spacing={8} mt={12}>
        <Text fontSize={{ base: '1.5rem', md: '2.25rem' }} color="#E3E4E6">
          <FaLinkedin />
        </Text>
        <Text fontSize={{ base: '1.5rem', md: '2.25rem' }} color="#E3E4E6">
          <FaBehance />
        </Text>
        <Text fontSize={{ base: '1.5rem', md: '2.25rem' }} color="#E3E4E6">
          <FaTwitter />
        </Text>
        <Text fontSize={{ base: '1.5rem', md: '2.25rem' }} color="#E3E4E6">
          <BsMessenger />
        </Text>
      </HStack>
    </Box>
  )
}
