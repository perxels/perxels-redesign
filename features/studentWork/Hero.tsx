import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'

const Hero = () => {
  return (
    <Box h="calc(100vh - 3rem)" bg="brand.dark.200">
      <Box
        w="full"
        h="full"
        bg={`url(./assets/images/sudent-work/studentHeroBg.svg) center/cover no-repeat`}
      >
        <MainContainer bg="none">
          <Center h="calc(100vh - 3rem)" pos="relative" flexDir="column">
            <Box
              pos="absolute"
              top="2rem"
              left={["90%", "90%", "90%", "40%"]}
              w="2rem"
              h="2rem"
              rounded="full"
              bg="brand.green.100"
            />
            <Box
              pos="absolute"
              bottom={["8rem", "8rem", "8rem", "12rem"]}
              left={["10%", "10%", "20%", "0%"]}
              w="2.5rem"
              h="2.5rem"
              rounded="full"
              bg="brand.yellow.700"
            />
            <Img
              w="2rem"
              h="auto"
              pos="absolute"
              left="0.3rem"
              top="6rem"
              src="./assets/images/sudent-work/pattern-top-left.svg"
              alt="pattern"
            />
            <Img
              w="3.25rem"
              h="auto"
              pos="absolute"
              left="50%"
              bottom={["3rem", "3rem", "3rem", "5rem"]}
              transform={{ base: 'translateX(-50%)', md: 'translateX(-50%)' }}
              src="./assets/images/sudent-work/arrow-down.svg"
              alt="pattern"
            />
            <Img
              w="2rem"
              h="auto"
              pos="absolute"
              right="0.3rem"
              bottom="18rem"
              display={["none", "none", "none", "block"]}
              src="./assets/images/sudent-work/pattern-bottom-right.svg"
              alt="pattern"
            />
            <Img
              w="5.753125rem"
              h="5.753125rem"
              pos="absolute"
              left="8rem"
              top="3rem"
              src="./assets/images/sudent-work/student-pattern-1.png"
              alt="pattern"
            />
            <Img
              w="3.25rem"
              h="3.25rem"
              pos="absolute"
              right="16rem"
              top="3rem"
              display={["none", "none", "none", "block"]}
              src="./assets/images/sudent-work/student-pattern-3.png"
              alt="pattern"
            />
            <Img
              w="8rem"
              h="8rem"
              pos="absolute"
              right="0"
              top="6rem"
              display={["none", "none", "none", "block"]}
              src="./assets/images/sudent-work/student-pattern-4.png"
              alt="pattern"
            />
            <Img
              w="5.25rem"
              h="5.25rem"
              pos="absolute"
              left={["60%", "60%", "60%", "8rem"]}
              bottom={["8rem", "8rem", "8rem", "6rem"]}
              src="./assets/images/sudent-work/student-pattern-2.png"
              alt="pattern"
            />
            <Img
              w="7rem"
              h="7rem"
              pos="absolute"
              right="8rem"
              bottom="10rem"
              display={["none", "none", "none", "block"]}
              src="./assets/images/sudent-work/student-pattern-5.png"
              alt="pattern"
            />
            <Heading textAlign="center" fontSize={["7xl", "9xl"]} color="brand.yellow.500">
              Our Students’ Portfolio
            </Heading>
            <Text textAlign="center" fontSize={["xl", "2xl", "4xl"]} color="brand.white">
              Results of our{' '}
              <Box as={'span'} fontWeight="700">
                {' '}
                Dedication{' '}
              </Box>{' '}
              and
              <Box as={'span'} fontWeight="700">
                {' '}
                Hard Work
              </Box>{' '}
            </Text>
          </Center>
        </MainContainer>
      </Box>
    </Box>
  )
}

export default Hero
