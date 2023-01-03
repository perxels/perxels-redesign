import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React from 'react'

const EnrolForm = () => {
  return (
    <Box overflowY="auto" px={['1rem', '1rem', '3rem']} py="2rem">
      <Heading fontSize="6xl" maxW="420px" textAlign="left" color="brand.dark.100">
        You’re one step ahead to achieve your goal
      </Heading>

      <VStack
        spacing="1.5rem"
        mt="2rem"
        maxW="440px"
        w="full"
        alignItems="flex-start"
        as="form"
      >
        <Input
          h="3.5rem"
          placeholder="Name*"
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
          placeholder="What class do you want to apply for?"
          _placeholder={{ color: 'brand.dark.200' }}
        >
          <option value="Basic Program">Basic Program</option>
          <option value="Advanced Program">Advanced Program</option>
          <option value="Premium (Virtual) Program">
            Premium (Virtual) Program
          </option>
          <option value="Premium (Physical) Program">
            Premium (Physical) Program
          </option>
        </Select>

        <Input
          h="3.5rem"
          type="text"
          placeholder="Where are you located? E.g Lagos, Nigeria"
          _placeholder={{ color: 'brand.dark.200' }}
        />

        <Input
          h="3.5rem"
          type="text"
          placeholder="What do you currently do? (Eg Graphics Designer, Banker etc)"
          _placeholder={{ color: 'brand.dark.200' }}
        />

        <Select
          h="3.5rem"
          placeholder="How did you get to know about Perxels?"
          _placeholder={{ color: 'brand.dark.200' }}
        >
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="WhatsApp">WhatsApp</option>
        </Select>

        <Button h="3.688rem" w="full">
          Submit
        </Button>
      </VStack>
    </Box>
  )
}

export default EnrolForm
