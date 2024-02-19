import React from 'react'
import {Box, Heading, Text, Button, Image,Center} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
export const Hero = () => {
  return (
    <MainContainer>
        <Box
        py={["5%", "5%"]}
        >
            <Box
            background="url('./assets/images/library/heroBg.png') no-repeat center center"
            height="431px"
            backgroundSize="cover"
            padding={["0 5%","0 21%"]}
            >
            <Center h="100%" flexDir="column"
            alignItems={['flex-start', 'center', 'center']}
            >
                <Center 
                alignItems={['flex-start', 'center', 'center']}
                background="#DFDFDF" padding="8px 16px" rounded="8px">
                    <Text fontSize={["12px", "1rem"]}>
                    WELCOME TO PERXELS LIBRARY
                    </Text>
                </Center>
                <Heading 
                display={["none", "block", "block"]}
                as="h1" fontSize={["42px","3rem"]} color="white" 
                fontWeight={"600"}
                textAlign={["left", "center"]}>
                Unleash your 🎨 creativity through our free 📚 resources 
                </Heading>
                <Heading 
                display={["block", "none", "none"]}
                fontWeight="600"
                as="h1" fontSize={["32px","3rem"]} lineHeight={"120%"} color="white" textAlign={["left", "center"]}>
                Unleash your 🎨 creativity through our free resources 📚 
                </Heading>
            </Center>
            </Box>
        </Box>
    </MainContainer>
  )
}
