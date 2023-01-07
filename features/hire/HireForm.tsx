import {
  Box,
  Button,
  Heading,
  HStack,
  Input,
  Select,
  SimpleGrid,
  Text,
  Textarea,
  VStack,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { SectionHeader } from '../../components'
import { InputWrapper } from '../../components/InputWrapper'
import { MainContainer } from '../../layouts'

export const HireForm = () => {
  const [loading, setLoading] = useState(false)
  const scriptUrl =
    'https://script.google.com/macros/s/AKfycbylt8yLHlrced9f7zSTWtno6R6gb87k9YljF8NS9qL6IBJ38roDy7uJtoM67i5v_ug7/exec'
  const handleSubmit = (e: any) => {
    e.preventDefault()
    setLoading(true)
    const inputData = e.target as typeof e.target & {
      fullname: { value: string }
      companyname: { value: string }
      projectdescription: { value: string }
      email: { value: string }
      phone: { value: string }
      date: { value: string }
      time: { value: string }
      hiretype: { value: string }
    }
    const formData = new FormData()
    formData.append('fullname', inputData.fullname.value as string)
    formData.append('companyname', inputData.companyname.value as string)
    formData.append(
      'projectdescription',
      inputData.projectdescription.value as string,
    )
    formData.append('email', inputData.email.value as string)
    formData.append('phone', inputData.phone.value as string)
    formData.append('date', inputData.date.value as string)
    formData.append('time', inputData.time.value as string)
    formData.append('hiringtype', inputData.hiretype.value as string)
    //current date and time
    formData.append('created_at', new Date().toLocaleString())

    fetch(scriptUrl, {
      method: 'POST',
      body: formData,
    }).then((response) => {
      if (response.status === 201 || 200) {
        setLoading(false)
        alert('Your message has been sent successfully')
      } else {
        setLoading(false)
        alert('Something went wrong, please try again')
      }
    })
  }

  return (
    <Box py="3.75rem">
      <MainContainer>
        <Box py="3.75rem">
          <SectionHeader
            title="Complete the form to hire."
            subTitle="HIRE OUR GRADUTES"
          />
          <VStack
            spacing={['1rem', '1rem', '1rem', '3.125rem']}
            as="form"
            maxW="1030px"
            m="0 auto"
            onSubmit={handleSubmit}
          >
            {/* name */}
            <SimpleGrid
              columns={[1, 1, 1, 2]}
              w="full"
              spacing={['1rem', '1rem', '1rem', '2rem']}
            >
              <InputWrapper label="FULL NAME">
                <Input
                  type="text"
                  placeholder="Enter your full name"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="fullname"
                />
              </InputWrapper>
              <InputWrapper label="COMPANY NAME">
                <Input
                  type="text"
                  placeholder="Enter Company Name"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="companyname"
                />
              </InputWrapper>
            </SimpleGrid>
            {/* Description */}
            <HStack w="full" spacing={['1rem', '1rem', '1rem', '2rem']}>
              <InputWrapper label="Project Description">
                <Textarea
                  placeholder="Tell Us a little about your Project..."
                  w="full"
                  h="8.75rem"
                  py="1.5rem"
                  name="projectdescription"
                />
              </InputWrapper>
            </HStack>
            {/* contact */}
            <SimpleGrid
              columns={[1, 1, 1, 2]}
              w="full"
              spacing={['1rem', '1rem', '1rem', '2rem']}
            >
              <InputWrapper label="PHONE NUMBER">
                <Input
                  type="tel"
                  placeholder="Enter your Phone Number"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="phone"
                />
              </InputWrapper>
              <InputWrapper label="EMAIL ADDRESS">
                <Input
                  type="email"
                  placeholder="Enter Email Address"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="email"
                />
              </InputWrapper>
            </SimpleGrid>

            <Heading color="brand.dark.200" fontSize="1.5rem" w="full">
              What is the best time to schdule a meeting with you?
            </Heading>

            {/* contact */}
            <SimpleGrid
              pb={['2rem', '2rem', '2rem', '0']}
              columns={[1, 1, 2, 3]}
              w="full"
              spacing={['1rem', '1rem', '1rem', '2rem']}
            >
              <InputWrapper label="Date">
                <Input
                  type="date"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="date"
                />
              </InputWrapper>
              <InputWrapper label="Time">
                <Input
                  type="time"
                  w="full"
                  h={['3rem', '3rem', '3rem', '5rem']}
                  name="time"
                />
              </InputWrapper>
              <InputWrapper label="Hiring type">
                <Select h={['3rem', '3rem', '3rem', '5rem']} name="hiretype">
                  <option>Hire Perxels</option>
                  <option>Hire a Graduate</option>
                </Select>
              </InputWrapper>
            </SimpleGrid>

            <Button
              h={['3rem', '3rem', '3rem', '5rem']}
              w="full"
              maxW="437px"
              type="submit"
            >
              Submit
            </Button>
          </VStack>
        </Box>
      </MainContainer>
    </Box>
  )
}
