import React from 'react'
import {Box, Heading, Text, Image, HStack} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
export const Hero = () => {
  return (
    <Box
    py="2.5rem"
    >
        <MainContainer>
        <Box
        display="flex"
        flexDirection="column"
        alignItems="center"
        >
            <Box
            bg="rgba(227, 113, 156, 0.1)"
            borderRadius={"30px"}
            padding={"1rem 1.5625rem"}
            display="flex"
            columnGap={"1rem"}
            >
                
                <Image src="assets/icons/pinkBadge.svg" alt=""/>
                <Text
                fontSize={"18px"}
                fontWeight="700"
                color="#E3719C"
                >
                Perxels Design Challenge 2.0
                </Text>
                
            </Box>
        <Heading
        fontSize="80px"
        lineHeight={"87.04px"}
        textAlign="center"
        w="80%"
        >
Showcase your Design skill and win amazing prizes.</Heading>

        <Box
        maxW={["100%","626px"]}
        mt="2.5rem"
        >
            <Image src="/assets/images/designChallenge/heroImage.png" alt="heroImage" />
        </Box> 
        </Box>
        </MainContainer>
    </Box>
  )
}
