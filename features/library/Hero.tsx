import React from 'react'
import {
  Box,
  Heading,
  Text,
  Button,
  Image,
  Center,
  VStack,
} from '@chakra-ui/react'
import { CgChevronDoubleDownO } from 'react-icons/cg'
import { MainContainer } from '../../layouts'
import { keyframes } from '@emotion/react'
export const Hero = () => {
  // Define keyframes for the jump animation
  const jump = keyframes`
0%, 100% {
  transform: translateY(0); /* Start and end at the same position */
}
50% {
  transform: translateY(-10px); /* Move up by 10px */
}
`

  return (
    <>
      <Box py={['5%', '5%']}>
        <Box
          background="url('/assets/images/library/heroBg.png') no-repeat center center"
          height={['320px', '431px']}
          backgroundSize="cover"
          padding={['0 5%', '0 21%']}
          rounded="lg"
        >
          <Center
            h="100%"
            flexDir="column"
            alignItems={['flex-start', 'center', 'center']}
            justifyContent={'center'}
            gap={4}
          >
            <Center
              alignItems={['flex-start', 'center', 'center']}
              background="#DFDFDF"
              padding={['6px 16px', '8px 16px']}
              rounded={['full', 'full']}
            >
              <Text fontSize={['12px', '1rem']}>
                WELCOME TO PERXELS LIBRARY
              </Text>
            </Center>
            <Heading
              display={['none', 'block', 'block']}
              as="h1"
              fontSize={['2rem', '3rem']}
              color="white"
              fontWeight={[700, '600']}
              textAlign={['left', 'center']}
            >
              Unleash your 🎨 creativity through our free 📚 resources
            </Heading>
            <Heading
              display={['block', 'none', 'none']}
              fontWeight="600"
              as="h1"
              fontSize={['32px', '3rem']}
              lineHeight={'120%'}
              color="white"
              textAlign={['left', 'center']}
            >
              Unleash your 🎨 creativity through our free resources 📚
            </Heading>
          </Center>
        </Box>
      </Box>
      <VStack
        alignItems="center"
        justifyContent="center"
        fontSize="50px"
        w="full"
        animation={`${jump} 1s infinite`} // Apply the animation
      >
        {' '}
        <CgChevronDoubleDownO />
      </VStack>
    </>
  )
}
