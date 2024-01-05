import React from 'react'
import {Box, Flex, Heading, Center, Button} from '@chakra-ui/react'
import {ExpectationCard} from './ExpectationCard'
import {MainContainer} from '../../layouts'
export const Expectation = () => {
  return (
    <MainContainer bg="#422D80"
    >
    <Box py="10%">
    <Heading textAlign="center" color="#fff" fontSize={["1.875rem","4.375rem"]} lineHeight="normal" fontWeight="bold" mb={["1.25rem","2.5rem"]}>
    What to Expect
    </Heading>
    
    {/* top section */}
    <Flex
    columnGap="1.5rem"
    mb="1.5rem"
    flexDir={["column","row"]}
    rowGap="1.5rem"
    >
    <ExpectationCard bgImage="/assets/images/retreat/expect1.png" description="Networking " />
    <ExpectationCard bgImage="/assets/images/retreat/expect2.png" description="Vision Board" />
    </Flex>
    <Flex  rowGap="1.5rem" flexDir={["column","row"]}  columnGap="1.5rem">
    <ExpectationCard bgImage="/assets/images/retreat/expect3.png" description="Panel Session" />
    <ExpectationCard bgImage="/assets/images/retreat/expect4.png" description="Mock Interview" />
    <ExpectationCard bgImage="/assets/images/retreat/expect5.png" description="CV Evaluation" />
    </Flex>
    </Box>
    <Center>
            <Button as='a' href="/retreat/register" backgroundColor="#FFBF33" color="#34296B" fontSize="1.25rem" fontWeight="700" mt="2.125rem" mb="3.125rem" w={["100%", "40%"]} h="4.375rem" borderRadius="4px" >
            Register for the retreat
            </Button>
        </Center>
    </MainContainer>
  )
}
