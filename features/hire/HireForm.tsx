import { Box, Button, Heading, HStack, Input, Select, SimpleGrid, Text, Textarea, VStack } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { InputWrapper } from '../../components/InputWrapper'
import { MainContainer } from '../../layouts'

export const HireForm = () => {
  return (
    <Box py="3.75rem">
      <MainContainer>
        <Box py="3.75rem">
          <SectionHeader
            title="Complete the form to hire."
            subTitle="HIRE OUR GRADUTES"
          />
          <VStack spacing="3.125rem" as="form" maxW="1030px" m="0 auto">
            {/* name */}
            <HStack w="full" spacing="2rem">
                <InputWrapper label="FULL NAME">
                    <Input 
                        type="text"
                        placeholder="Enter your full name"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
                <InputWrapper label="COMPANY NAME">
                    <Input 
                        type="text"
                        placeholder="Enter Company Name"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
            </HStack>
            {/* Description */}
            <HStack w="full" spacing="2rem">
                <InputWrapper label="Project Description">
                    <Textarea
                        placeholder="Tell Us a little about your Project..."
                        w="full"
                        h="8.75rem"
                        py="1.5rem"
                    />
                </InputWrapper>
            </HStack>
            {/* contact */}
            <SimpleGrid columns={[1, 1, 1, 2]} w="full" spacing="2rem">
                <InputWrapper label="PHONE NUMBER">
                    <Input 
                        type="tel"
                        placeholder="Enter your Phone Number"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
                <InputWrapper label="EMAIL ADDRESS">
                    <Input 
                        type="email"
                        placeholder="Enter Email Address"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
            </SimpleGrid>

            <Heading color="brand.dark.200" fontSize="1.5rem" w="full">What is the best time to schdule a meeting with you?</Heading>

            {/* contact */}
            <SimpleGrid columns={[1, 1, 2, 3]} w="full" spacing="2rem">
                <InputWrapper label="Date">
                    <Input 
                        type="date"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
                <InputWrapper label="Time">
                    <Input 
                        type="date"
                        w="full"
                        h="5rem"
                    />
                </InputWrapper>
                <InputWrapper label="Hiring type">
                    <Select h="5rem">
                        <option>Hire Perxels</option>
                        <option>Hire a Graduate</option>
                    </Select>
                </InputWrapper>
            </SimpleGrid>

            <Button h="5rem" w="full" maxW="437px">Submit</Button>
          </VStack>
        </Box>
      </MainContainer>
    </Box>
  )
}
