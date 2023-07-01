import {Box, SimpleGrid, Input, FormLabel, FormControl, Flex, Heading, Text } from '@chakra-ui/react'
import { Logo } from '../../components'
import Link from 'next/link'
export const OnboardForm = () => {
    return (
        <Box>
            <Box as={Link} href="/" pos="absolute" top="2.125rem" left="3.25rem" display={['none', 'none', 'none', 'block']}>
                <Logo  />
            </Box>
            <Box px="10%" py="15%">
            <Heading
          fontSize={["1.8rem","2.5rem"]}
          maxW="420px"
          textAlign="left"
          fontWeight="600"
          color="brand.dark.100"
        >
         Onboarding Page
        </Heading>
        <Text fontSize={[".875rem","1rem"]} color="#545454"  mb="2.625rem">
        We are delighted to see you part of this community.
        </Text>
                <Flex columnGap="3.6875rem"  mb="1.375rem" rowGap="2rem" flexDir={["column", "column", "column", "row"]}>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        Full Name
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="text"
                         placeholder="John Doe"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        Email
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="email"
                         placeholder="Email"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                </Flex>
                <Flex columnGap="3.6875rem" mb="1.375rem" rowGap="2rem" flexDir={["column", "column", "column", "row"]}>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        Phone Number
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="text"
                         placeholder="0812323232"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        Sponsorship Beneficiary?
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="email"
                         placeholder="sponsor"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                </Flex>
                <Flex columnGap="3.6875rem" mb="1.375rem" rowGap="2rem" flexDir={["column", "column", "column", "row"]}>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        How much did you pay?
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="text"
                         placeholder="2000"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                    <FormControl>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        Your balance? If no balance, type 
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="email"
                         placeholder="balance"
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                </Flex>
                <Flex columnGap="3.6875rem" mb="1.375rem" rowGap="2rem" flexDir={["column", "column", "column", "row"]}>
                    <FormControl width={["100%","50%"]}>
                        <FormLabel fontSize="14px" fontWeight="600" color="#4E4E4E">
                        What is your expectation for this course?
                        </FormLabel>
                        <Input
                         h="3.5rem"
                         type="text"
                         placeholder=""
                         _placeholder={{ color: 'brand.dark.200' }}
                        borderColor="#FCDB04"
                        _focusVisible={{
                            outline: 'none',
                          }}
                        />
                    </FormControl>
                   
                </Flex>
            </Box>
        </Box>
    )
}