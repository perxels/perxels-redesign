import {
  Box,
  Button,
  Center,
  Heading,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'

export const TeensHero = () => {
  return (
    <Box
      bg="url('/assets/images/teens/teenHeroBg.jpg')"
      backgroundRepeat="no-repeat"
      backgroundSize="cover"
      overflowX="hidden"
    >
      <MainContainer bg="none">
        <Box pos="relative" py={['3rem', '3rem', '3rem', '9rem']}>
          <Center flexDir="column" alignItems={['flex-start']} h="full">
            <Heading
              textAlign={['left']}
              fontSize={['6xl', '6xl', '6xl', '9xl']}
              color="brand.dark.200"
              maxW="708px"
              pr={['1rem', '1rem', '1rem', '0']}
            >
              We are empowering the next generation of{' '}
              <Box as="span" color="brand.pink.700" textTransform="uppercase">
                young design creatives.
              </Box>
            </Heading>
            <Text
              textAlign={['left']}
              fontSize={['md', 'md', 'md', 'xl']}
              color="brand.dark.100"
              mt="1.4rem"
              maxW="460px"
            >
              Register your teens today
            </Text>

            <Button mt="1.25rem" h="3.125rem">
              Get Started
            </Button>
          </Center>
          <Img
            pos="absolute"
            top="-10rem"
            right="-26rem"
            w="55rem"
            h="auto"
            src="./assets/images/teens/teens.png"
            display={['none', 'none', 'none', 'block']}
          />
        </Box>
      </MainContainer>
    </Box>
  )
}
