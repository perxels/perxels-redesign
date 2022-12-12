import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Img,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

const RegisterForm = () => {
  return (
    <Box overflowY="auto" px="3rem" py="2rem">
      <Heading fontSize="6xl" textAlign="center" color="brand.dark.100">
        Register now to Claim this Offer
      </Heading>
      <Text
        textAlign="center"
        color="brand.dark.200"
        fontSize="2xl"
        mt="0.875rem"
      >
        Register now to Claim this Offer
      </Text>

      <VStack
        spacing="1.5rem"
        mt="2rem"
        maxW="440px"
        mx="auto"
        w="full"
        as="form"
      >
        <Input
          h="3.5rem"
          placeholder="Full Name*"
          _placeholder={{ color: 'brand.dark.200' }}
        />
        <Input
          h="3.5rem"
          type="tel"
          placeholder="Phone Number*"
          _placeholder={{ color: 'brand.dark.200' }}
        />
        <Input
          h="3.5rem"
          type="email"
          placeholder="Email Address*"
          _placeholder={{ color: 'brand.dark.200' }}
        />

        <Select
          h="3.5rem"
          placeholder="Where did you hear about this scholarship"
          _placeholder={{ color: 'brand.dark.200' }}
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>

        <Textarea
          h="5.5rem"
          _placeholder={{ color: 'brand.dark.200' }}
          placeholder="Say something short about yourself"
        />

        <Button h="3.688rem" w="full">
          Register for Scholarship
        </Button>

        <VStack w="full" pt="1.5rem" spacing="1.5rem">
          <Heading color="brand.gray.50" fontSize="xl" textAlign="center">
            Spread the Word:
          </Heading>

          <Flex
            w="full"
            h="3.5rem"
            borderWidth="0.41px"
            borderColor="brand.gray.700"
            rounded="5px"
            alignItems="center"
            justifyContent="space-between"
            px="1.2rem"
          >
            <Text fontSize="md" color="brand.dark.200">
              https://perxels.com/sponsorship
            </Text>

            <Box cursor="pointer">
              <Img
                src="./assets/icons/copy.svg"
                alt="copy icon"
                w="1.5rem"
                h="1.5rem"
              />
            </Box>
          </Flex>

          <SimpleGrid w="full" columns={2} gap="0.75rem">
            <Button
              w="100%"
              h="3.5rem"
              leftIcon={
                <Img
                  src="./assets/icons/whatsapp.svg"
                  alt="whatsapp icon"
                  w="1.5rem"
                  h="1.5rem"
                />
              }
              variant="outline"
            >
              Share
            </Button>
            <Button
              w="full"
              h="3.5rem"
              leftIcon={
                <Img
                  src="./assets/icons/twitter.svg"
                  alt="whatsapp icon"
                  w="1.5rem"
                  h="1.5rem"
                />
              }
              variant="outline"
            >
              Share
            </Button>
          </SimpleGrid>
        </VStack>
      </VStack>
    </Box>
  )
}

export default RegisterForm
