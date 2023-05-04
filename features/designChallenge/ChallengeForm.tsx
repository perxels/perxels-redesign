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
  
  export const ChallengeForm = () => {
    const [loading, setLoading] = useState(false)
    const scriptUrl =
      'https://script.google.com/macros/s/AKfycbyTgCCNaNzXBPqBNP3HsSEfhYHNsx2BIwv8zkusfn6Ha9yjbb8mlU7GAJwVMNB8Qtd2/exec'
    const handleSubmit = (e: any) => {
      e.preventDefault()
      setLoading(true)
      const inputData = e.target as typeof e.target & {
        fullname: { value: string }
        projectdescription: { value: string }
        email: { value: string }
        phone: { value: string }
        twitterHandle: { value: string }
        reason: { value: string }
       
        // hiretype: { value: string }
      }
      const formData = new FormData()
      formData.append('fullname', inputData.fullname.value as string)
      formData.append('email', inputData.email.value as string)
      formData.append('phone', inputData.phone.value as string)
      formData.append('twitterHandle', inputData.twitterHandle.value as string)
    
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
      <Box py="3.75rem" id="join">
        <MainContainer>
          <Box py="3.75rem">
          <Heading
        color={"#121212"}
        textAlign="center"
        fontSize={['2rem', '2rem', '7xl']}
        maxW={'auto'}
        m="0 auto"
        mb="3.75rem"
        mt="1.25rem"
      >
       Complete the form to Register.
      </Heading>
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
                    required
                  />
                </InputWrapper>
                <InputWrapper label="PHONE NUMBER">
                  <Input
                    type="tel"
                    placeholder="Enter your Phone Number"
                    w="full"
                    h={['3rem', '3rem', '3rem', '5rem']}
                    name="phone"
                    required
                  />
                </InputWrapper>
                {/**/}
              </SimpleGrid>
              <SimpleGrid
                columns={[1, 1, 1, 2]}
                w="full"
                spacing={['1rem', '1rem', '1rem', '2rem']}
              >
                 <InputWrapper label="TWITTER HANDLE">
                  <Input
                    type="text"
                    placeholder="Enter Twitter Handle"
                    w="full"
                    h={['3rem', '3rem', '3rem', '5rem']}
                    name="twitterHandle"
                    required
                  />
                </InputWrapper> 
               
                <InputWrapper label="EMAIL ADDRESS">
                  <Input
                    type="email"
                    placeholder="Enter Email Address"
                    w="full"
                    h={['3rem', '3rem', '3rem', '5rem']}
                    name="email"
                    required
                  />
                </InputWrapper>
              </SimpleGrid>
              {/* Description */}
              <HStack w="full" spacing={['1rem', '1rem', '1rem', '2rem']}>
                <InputWrapper label="Reason for joining the challenge">
                  <Textarea
                    // placeholder="Tell Us a little about your Project..."
                    w="full"
                    h="8.75rem"
                    py="1.5rem"
                    name="reason"
                    required
                  />
                </InputWrapper>
              </HStack>
              {/* contact */}
       
  
           
              {/* contact */}
            
  
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
  