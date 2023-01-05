import {
  Box,
  Button,
  Heading,
  Input,
  Select,
  Text,
  Textarea,
  VStack,
  useDisclosure
} from '@chakra-ui/react'
import React from 'react'
import { SuccessModal } from '../../components'

const EnrolForm = () => {
  const scriptUrl = "https://script.google.com/macros/s/AKfycbw9_DFBpsyrNp8_2AsnjKiLlXWxylVD0QtdbN7qDbk2IzLIlg5o2pxKibU-t25F-Jke9w/exec"
  const { isOpen, onOpen, onClose } = useDisclosure()

  const handleSubmit = (e: any) => {
    e.preventDefault()
    const inputData = e.target as typeof e.target & {
      name: { value: string }
      phone: { value: string }
      email: { value: string }
      class: { value: string }
      location: { value: string }
      howdidyouknow: { value: string }
      occupation: { value: string }
    }
    const formData = new FormData()
    formData.append('name', inputData.name.value as string)
    formData.append('phone', inputData.phone.value as string)
    formData.append('email', inputData.email.value as string)
    formData.append('class', inputData.class.value as string)
    formData.append('location', inputData.location.value as string)
    formData.append('howdidyouknow', inputData.howdidyouknow.value as string)
    formData.append('occupation', inputData.occupation.value as string)
    //current date and time
    formData.append('created_at', new Date().toLocaleString())

    fetch(scriptUrl, { 
      method: 'POST',
     body:  formData,
    }).then(
        (response) => {
          if(response.status === 201 || 200) {
            onOpen()
          }else{
       
            alert("Something went wrong, please try again")
          }
        }
    )
  }
  return (
    <>
    <SuccessModal isOpen={isOpen} onClose={onClose} />
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
        onSubmit={handleSubmit}
      >
        <Input
          h="3.5rem"
          placeholder="Name*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="name"
        />
        <Input
          h="3.5rem"
          type="tel"
          placeholder="Phone Number*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="phone"
        />
        <Input
          h="3.5rem"
          type="email"
          placeholder="Email Address*"
          _placeholder={{ color: 'brand.dark.200' }}
          name="email"
        />

        <Select
          h="3.5rem"
          placeholder="What class do you want to apply for?"
          _placeholder={{ color: 'brand.dark.200' }}
          color="brand.dark.200"
          name="class"
        >
          <option value="Basic Program">Basic Program</option>
          <option value="Advanced Program">Advanced Program</option>
          <option value="Premium (Virtual) Program">
            Premium (Virtual) Program
          </option>
          <option value="Premium (Physical) Program">
            Premium (Physical) Program
          </option>
          <option value="International Class">
            International Class
          </option>
        </Select>

        <Input
          h="3.5rem"
          type="text"
          placeholder="Where are you located? E.g Lagos, Nigeria"
          _placeholder={{ color: 'brand.dark.200' }}
          name = "location"
        />

        <Input
          h="3.5rem"
          type="text"
          placeholder="What do you currently do? (Eg Graphics Designer, Banker etc)"
          _placeholder={{ color: 'brand.dark.200' }}
          name="occupation"
        />

        <Select
          h="3.5rem"
          placeholder="How did you get to know about Perxels?"
          _placeholder={{ color: 'brand.dark.200' }}
          color="brand.dark.200"
          name="howdidyouknow"
        >
          <option value="Facebook">Facebook</option>
          <option value="Twitter">Twitter</option>
          <option value="LinkedIn">LinkedIn</option>
          <option value="Instagram">Instagram</option>
          <option value="WhatsApp">WhatsApp</option>
        </Select>

        <Button h="3.688rem" w="full" type='submit'>
          Submit
        </Button>
      </VStack>
    </Box>
    </>
  )
}

export default EnrolForm
