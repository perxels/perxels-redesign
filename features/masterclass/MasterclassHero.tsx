import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'

export const MasterclassHero = () => {
  return (
    <Box
      bg="url('/assets/images/masterclass/masterclassHeroBg.png')"
      bgRepeat="no-repeat"
      bgSize="cover"
    >
      <MainContainer bg="none">
        <Center flexDir="column" pt="4rem">
          <Heading maxW="810px" lineHeight="1.2" fontSize={["2.5rem", "2.5rem", "2.5rem", "4.30rem"]} textAlign="center">
            Welcome to <br />Perxels Free UIUX Design Masterclass
          </Heading>

          <Text
            maxW="556px"
            textAlign="center"
            fontSize="2xl"
            color="brand.dark.200"
            mt="1.125rem"
          >
            You’ve searched online, watched many videos, read many articles and
            tried doing it yourself but you don’t just get it.Then this is the
            masterclass for you.
          </Text>
        </Center>

        <Center flexDir="column" pb="2rem" pt="4rem" pos="relative">
            <Img 
                src="/assets/images/masterclass/main_screen.png"
                alt="Masterclass Hero"
                w="full"
                h="auto"
                maxW="577px"
            />

            {/* positioned left top */}
            <Img 
                src="/assets/images/masterclass/screen1.png"
                alt="Masterclass Hero"
                w="full"
                h="auto"
                maxW="312px"
                pos="absolute"
                top="-10rem"
                left="0"
                display={['none', 'none', 'none', 'none', 'block']}
            />

            {/* positioned left bottom */}
            <Img 
                src="/assets/images/masterclass/screen2.png"
                alt="Masterclass Hero"
                w="full"
                h="auto"
                maxW="226px"
                pos="absolute"
                top="10rem"
                left="4rem"
                display={['none', 'none', 'none', 'none', 'block']}
            />

            {/* positioned right top */}
            <Img 
                src="/assets/images/masterclass/screen3.png"
                alt="Masterclass Hero"
                w="full"
                h="auto"
                maxW="312px"
                pos="absolute"
                top="-10rem"
                right="0"
                display={['none', 'none', 'none', 'none', 'block']}
            />

            {/* positioned right bottom */}
            <Img 
                src="/assets/images/masterclass/screen4.png"
                alt="Masterclass Hero"
                w="full"
                h="auto"
                maxW="245px"
                pos="absolute"
                top="10rem"
                right="4rem"
                display={['none', 'none', 'none', 'none', 'block']}
            />
        </Center>
      </MainContainer>
    </Box>
  )
}
