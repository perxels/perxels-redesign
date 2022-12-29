import { Box, Heading, VStack, SimpleGrid, Text, Img } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'
import { SpeakerForm } from './SpeakerForm'

export const SpeakerHero = () => {
  return (
    <Box
      backgroundImage={"url('/assets/images/speakers/hero.svg')"}
      backgroundRepeat="no-repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
        <SimpleGrid columns={2} gap="2rem" py="4rem">
          <VStack justifyContent="center" position="relative">
            <Img
              src="/assets/images/speakers/pattern1.svg"
              w="2.5rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="3rem"
              left="0"
            />

            <Img
              src="/assets/images/speakers/pattern2.png"
              w="6rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-2rem"
              left="8rem"
            />

            <Img
              src="/assets/images/speakers/pattern3.svg"
              w="1.5rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-3rem"
              left="24rem"
            />

            <Img
              src="/assets/images/speakers/pattern3.svg"
              w="1.5rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-3rem"
              left="24rem"
            />

            <Img
              src="/assets/images/speakers/pattern4.png"
              w="2rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-3rem"
              right="-16rem"
            />

            <Img
              src="/assets/images/speakers/pattern5.svg"
              w="3rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              bottom="3rem"
              left="0"
            />

            <Img
              src="/assets/images/speakers/pattern6.png"
              w="6rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              bottom="-2rem"
              left="8rem"
            />

            <Heading as="h1" fontSize="8xl" color="brand.dark.200">
              Thank you for accepting to speak at our{' '}
              <Box as="span" color="brand.pink.700">
                AMA Session
              </Box>
            </Heading>
            <Text fontSize="3xl" color="brand.dark.200">
              You have the knowledge and the expertise, we have the platform.
              Join us up-skill the next generation of tech talents..
            </Text>
          </VStack>

          <SpeakerForm />
        </SimpleGrid>
      </MainContainer>
      <Img
        src="/assets/images/speakers/bottomPattern.png"
        w="full"
        h="auto"
        alt="bottom pattern"
      />
    </Box>
  )
}
