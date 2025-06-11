import { Box, Button, Heading, HStack, Text } from '@chakra-ui/react'
import React from 'react'

export const TermsAndConditionsWrapper = () => {
  return (
    <Box w="100%" h="full">
      <Box maxW="750px">
        <Heading
          as="h1"
          fontSize="7xl"
          fontFamily="Proxima Nova"
          fontWeight="bold"
          color="brand.dark.100"
        >
          Welcome to Perxels
        </Heading>

        <Text
          fontSize="2xl"
          fontFamily="Proxima Nova"
          fontWeight="normal"
          color="gray.600"
          my={8}
        >
          To safeguard your account and personal information, we require BVN
          verification during registration. Rest assured that your BVN is safe
          with us. We have implemented strict security measures to protect your
          personal and financial information.
        </Text>
      </Box>

      <HStack justifyContent="flex-end" w="full" mt={10}>
        <Button h="3.5rem" type="button" px={16}>
          I Understand
        </Button>
      </HStack>
    </Box>
  )
}
