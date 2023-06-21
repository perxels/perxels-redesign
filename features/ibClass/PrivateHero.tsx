import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import Link from 'next/link'
import { MainContainer } from '../../layouts'

export const PrivateHero = () => {
  return (
    <Box pb="4rem">
      <MainContainer>
        <SimpleGrid columns={[1, 1, 1, 2]} spacing="3rem" py="2rem">
          <Center flexDir="column" alignItems="flex-start" pos="relative">
            <Heading
              fontSize={['6xl', '6xl', '6xl', '7xl']}
              color="brand.pink.700"
              width={["100%", "80%"]}
            >
              IBADAN {' '}
              <Box color="brand.dark.200" as="span" textTransform="uppercase">
              UIUX
              </Box>{' '}
              <Box color="brand.dark.200" as="span" textTransform="uppercase">
              Design training.
              </Box>
            </Heading>

            <Text
              fontSize={['xl', 'xl', 'xl', '3xl']}
              color="brand.dark.200"
              mt="0.75rem"
              maxW="524px"
            >
             Physical training and mentorship to build
              your design skills to solve problems and create delightful products.
            </Text>

            <Link href="#pricing" passHref>
            <Button h="3rem" mt="1.25rem">
              Get Started
            </Button>
            </Link>
          </Center>

          <Img
            src="/assets/images/private/heroImage.png"
            alt="international hero"
            w="full"
            h="auto"
          />
        </SimpleGrid>
      </MainContainer>
      <Img
        src="/assets/images/international/bottomPattern.jpg"
        alt="bottom pattern"
        w="full"
        h="auto"
      />
      {/* <MainContainer bg="brand.purple.500">
        <Flex alignItems="center" justifyContent="space-between" py="1.875rem">
          <Box>
            <Heading
              textTransform="uppercase"
              fontSize={['2xl', '2xl', '2xl', '4xl']}
              color="brand.white"
            >
              We have the vision to train in 2023{' '}
            </Heading>
            <Heading
              textTransform="uppercase"
              fontSize={['7xl', '7xl', '7xl', '9xl']}
              color="brand.white"
            >
              2000+
            </Heading>
          </Box>

          <Button
            h="3.75rem"
            w="12.75rem"
            variant="outline"
            borderColor="brand.white"
            color="brand.white"
            _hover={{
              bg: 'brand.yellow.500',
              color: 'brand.dark.200',
              borderColor: 'brand.yellow.500',
            }}
          >
            Enroll Now
          </Button>
        </Flex>
      </MainContainer> */}
    </Box>
  )
}
