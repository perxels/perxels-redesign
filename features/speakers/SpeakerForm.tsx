import { Box, Button, Center, Input, Textarea, VStack } from '@chakra-ui/react'
import React from 'react'

export const SpeakerForm = () => {
  return (
    <Box as="form" bg="brand.gray.300" px="2.5rem" py="3.5rem" rounded="10px">
      <VStack spacing="1.75rem">
        <Input h="3.5rem" bg="brand.white" placeholder="Full Name*" />
        <Input h="3.5rem" bg="brand.white" type="email" placeholder="Email Address*" />
        <Input h="3.5rem" bg="brand.white" placeholder="Full Name*" />
        <Textarea h="10.25rem" bg="brand.white" pt="1.05rem" placeholder="Tell us a little about yourself" />

        <Center>
          <Button h="3.75rem" w="19.5rem">
            Submit
          </Button>
        </Center>
      </VStack>
    </Box>
  )
}
