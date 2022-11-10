import { Box, Heading, Text } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'
import { HeroAnimation } from './HeroAnimation'

export const Hero = () => {
  return (
    <Box
      w="full"
      // h="100vh"
      bg={`url(./assets/images/heroBg.png) center/cover no-repeat`}
    >
      <MainContainer bg="none">
        <Heading
          maxW="556px"
          fontSize={["2.3rem", "3rem", "4.375rem"]}
          fontWeight="black"
          textAlign={["left", "left", "left", "center"]}
          m={["0", "0", "0", "0 auto"]}
          pt="3.375rem"
          lineHeight={1.2}
        >
          Learn, Love, Live UIUX Design
        </Heading>

        <Text textAlign={["left", "left", "left", "center"]} mt="21px" fontSize="2xl">
          Get trained, build up your skills, land a design job!
        </Text>

        <HeroAnimation />
      </MainContainer>
    </Box>
  )
}
