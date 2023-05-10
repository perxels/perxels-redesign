import React from 'react'
import {Box, Text, Image, Flex, SimpleGrid, FormControl, Input, FormLabel,VStack, HStack, Heading, Checkbox, Center, Button} from '@chakra-ui/react'
export const HowForm = () => {
  return (
    <Box bg="#FFFFFF" p={["2rem 1rem","2.1875rem 4.0625rem"]}>
        <Box>
            <Heading fontSize={["2.5rem","3.125rem"]} lineHeight="1.875rem" fontWeight="600" mb="1.375rem">Get Paid</Heading>
            <Text fontSize="1rem" lineHeight="1rem" mb="3.125rem" color="#545454">Please fill this form after you have referred someone to Perxels</Text>
        </Box>
        <VStack
        rowGap="1.25rem"
        >
            <FormControl>
                <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600" >WHO DID YOU REFER</FormLabel>
                <Input 
                border="1px solid"
                borderColor="#FCDB04" 
                _focusVisible={{
                    outline: 'none',
                }}
                _hover={{
                    borderColor:"#FCDB04" 
                 }}
                />
            </FormControl>
            <FormControl>
                <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">WHAT CLASS PLAN DID THEY REGISTER</FormLabel>
                <Input 
                 border="1px solid"
                 borderColor="#FCDB04" 
                 _focusVisible={{
                     outline: 'none',
                 }}
                 _hover={{
                    borderColor:"#FCDB04" 
                 }}
                />
            </FormControl>
            <HStack w="full">
                <FormControl>
                    <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">YOUR FIRST NAME</FormLabel>
                    <Input 
                      border="1px solid"
                      borderColor="#FCDB04" 
                      _focusVisible={{
                          outline: 'none',
                      }}
                      _hover={{
                        borderColor:"#FCDB04" 
                     }}
                       />
                </FormControl>
                <FormControl>
                    <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">YOUR LAST NAME</FormLabel>
                    <Input 
                     border="1px solid"
                     borderColor="#FCDB04" 
                     _focusVisible={{
                         outline: 'none',
                     }}
                     _hover={{
                        borderColor:"#FCDB04" 
                     }}
                    />
                </FormControl>
            </HStack>
            <HStack w="full">
                <FormControl>
                    <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">YOUR PHONE NUMBER</FormLabel>
                    <Input 
                     border="1px solid"
                     borderColor="#FCDB04" 
                     _focusVisible={{
                         outline: 'none',
                     }}
                     _hover={{
                        borderColor:"#FCDB04" 
                     }}
                    />
                </FormControl>
                <FormControl>
                    <FormLabel fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">YOUR EMAIL ADDRESS</FormLabel>
                    <Input 
                     border="1px solid"
                     borderColor="#FCDB04" 
                     _focusVisible={{
                         outline: 'none',
                     }}
                     _hover={{
                        borderColor:"#FCDB04" 
                     }}
                    />
                </FormControl>
            </HStack>
            <FormControl>
                <FormLabel  fontSize={["0.7rem","1rem"]} color="#545454" fontWeight="600">FULL ACCOUNT DETAILS</FormLabel>
                <Input 
                 border="1px solid"
                 borderColor="#FCDB04" 
                 _focusVisible={{
                     outline: 'none',
                 }}
                 _hover={{
                    borderColor:"#FCDB04" 
                 }}
                />
            </FormControl>
            <FormControl>
                <Checkbox colorScheme="yellow"  size="lg" color="#545454" fontWeight="600" ><Text as="span" fontSize={["0.7rem","1rem"]} fontWeight="400">I read and agree to </Text> <Text as="span" fontSize={["0.7rem","1rem"]} fontWeight="600">the terms and conditions</Text> </Checkbox>
            </FormControl>
            <Center>
                <Button
                backgroundColor="#FCDB04"
                color="#34296B"
                fontSize="18px"
                fontWeight="600"
                px="6.0625rem"
                py="1.125rem"
                borderRadius=".3125rem"
                >
                    SUBMIT
                </Button>
            </Center>

        </VStack>
    </Box>
  )
}
