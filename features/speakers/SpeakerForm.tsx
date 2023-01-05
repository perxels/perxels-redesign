import {
  Box,
  Button,
  Center,
  Input,
  Textarea,
  VStack,
  useDisclosure,
} from '@chakra-ui/react'
import React from 'react'
import { SuccessModal } from '../../components'
export const SpeakerForm = () => {
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbz05WPBUPRhMgIHjoiKlRfEWpY6SUHbD49EbtHu0Q2XX6amBh9jKkNN4vC0c3qo__45Pw/exec'
    const { isOpen, onOpen, onClose } = useDisclosure()
  const handleSubmit = (e: any) => {
    e.preventDefault()
    const inputData = e.target as typeof e.target & {
      fullname: { value: string }
      email: { value: string }
      topic: { value: string }
      aboutspeaker: { value: string }
    }
    const formData = new FormData()
    formData.append('fullname', inputData.fullname.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('topic', inputData.topic.value as string)
    formData.append('aboutspeaker', inputData.aboutspeaker.value as string)
    //current date and time
    formData.append('created_at', new Date().toLocaleString())
    fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status === 201 || 200) {
        onOpen()
      } else {
        alert('Something went wrong, please try again')
      }
    })
  }
  return (
    <>
     <SuccessModal isOpen={isOpen} onClose={onClose} title="Thank you for choosing to be a speaker." description='An email would be sent to you shortly'/>
    <Box
      as="form"
      bg="brand.gray.300"
      px={['1.5rem', '1.5rem', '1.5rem', '2.5rem']}
      py={['1.5rem', '1.5rem', '1.5rem', '3.5rem']}
      rounded="10px"
      onSubmit={handleSubmit}
    >
      <VStack spacing="1.75rem">
        <Input
          h="3.5rem"
          bg="brand.white"
          placeholder="Full Name*"
          name="fullname"
          isRequired
        />
        <Input
          h="3.5rem"
          bg="brand.white"
          type="email"
          placeholder="Email Address*"
          name="email"
          isRequired
        />
        <Input
          h="3.5rem"
          bg="brand.white"
          placeholder="Your Topic*"
          name="topic"
          isRequired
        />
        <Textarea
          h="10.25rem"
          bg="brand.white"
          pt="1.05rem"
          placeholder="Tell us a little about yourself"
          name="aboutspeaker"
          isRequired
        />

        <Center w="full">
          <Button
            h={['3rem', '3rem', '3rem', '3.75rem']}
            w={['full', 'full', 'full', '19.5rem']}
            type="submit"
          >
            Submit
          </Button>
        </Center>
      </VStack>
    </Box>
    </>
  )
}
