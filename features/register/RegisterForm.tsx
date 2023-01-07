import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { IoLogoTwitter, IoLogoWhatsapp } from 'react-icons/io'

const RegisterForm = () => {
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbycNDLOQrShEZG9pCcetN11GjIBn1DHFt8c7yB0SwbrGrZlpcmDErOawCMns3OTZgK3ng/exec'
  const handleSubmit = (e: any) => {
    e.preventDefault()

    const inputData = e.target as typeof e.target & {
      fullname: { value: string }
      email: { value: string }
      phone: { value: string }
      hearabout: { value: string }
      about: { value: string }
    }
    const formData = new FormData()
    formData.append('fullname', inputData.fullname.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('phone', inputData.phone.value as string)
    formData.append('hearabout', inputData.hearabout.value as string)
    formData.append('about', inputData.about.value as string)
    //current date and time
    formData.append('created_at', new Date().toLocaleString())
    fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status === 201 || 200) {
        alert('Your message has been sent successfully')
      } else {
        alert('Something went wrong, please try again')
      }
    })
  }

  return (
    <Box overflowY="auto" px={['1rem', '1rem', '3rem']} py="2rem">
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
        onSubmit={handleSubmit}
      >
        <Input
          h="3.5rem"
          placeholder="Full Name*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="fullname"
          _focusVisible={{
            outline: 'none',
          }}
        />
        <Input
          h="3.5rem"
          type="tel"
          placeholder="Phone Number*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="phone"
          _focusVisible={{
            outline: 'none',
          }}
        />
        <Input
          h="3.5rem"
          type="email"
          placeholder="Email Address*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="email"
          _focusVisible={{
            outline: 'none',
          }}
        />

        <Select
          h="3.5rem"
          placeholder="Where did you hear about this scholarship"
          _placeholder={{ color: 'brand.dark.200' }}
          name="hearabout"
          _focusVisible={{
            outline: 'none',
          }}
        >
          <option value="option1">Option 1</option>
          <option value="option2">Option 2</option>
          <option value="option3">Option 3</option>
        </Select>

        <Textarea
          h="5.5rem"
          _placeholder={{ color: 'brand.dark.200' }}
          placeholder="Say something short about yourself"
          name="about"
          _focusVisible={{
            outline: 'none',
          }}
        />

        <Button h="3.688rem" w="full" type="submit">
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
              leftIcon={<Icon as={IoLogoWhatsapp} fontSize="3xl" />}
              variant="outline"
            >
              Share
            </Button>
            <Button
              w="full"
              h="3.5rem"
              leftIcon={<Icon as={IoLogoTwitter} fontSize="3xl" />}
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
