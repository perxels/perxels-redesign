import { Box, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'

export const HeroAnimation = () => {
  return (
    <SimpleGrid mt="2.625rem" columns={[1, 1, 1, 3]} gap={["4rem", "4rem", "4rem", "2rem", "6rem"]}>
      <Box display={['none', 'none', 'none', 'block']}>
        <Image
          width={226}
          height={370}
          alt="hero"
          src="/assets/images/hero/2.png"
        />
      </Box>
      <Box pos="relative">
        <Img
          display={['none', 'none', 'none', 'block']}
          pos="absolute"
          left="-60%"
          top={["60%", "60%", "60%", "60%", "40%"]}
          src="/assets/icons/arrow_01.svg"
          alt="arrow left"
          width="11.65rem"
          height="11.65rem"
        />
        <Img
          display={['none', 'none', 'none', 'block']}
          pos="absolute"
          right="-60%"
          top={["60%", "60%", "60%", "60%", "40%"]}
          src="/assets/icons/arrow_02.svg"
          alt="arrow left"
          width="11.65rem"
          height="11.65rem"
        />
        <Img
          width={["295px", "295px", "295px", "354px"]}
          height={["466px", "466px", "466px", "559px"]}
          mx="auto"
          maxW="auto"
          alt="hero"
          src="/assets/images/hero/1.png"
        />

        <Box
          as="span"
          bg="brand.pink.500"
          rounded="20px"
          px="1rem"
          py={["0.875rem", "1.5rem"]}
          pos="absolute"
          bottom={["-2rem", "-2rem", "-2rem", "-3rem"]}
          right={["0.5rem", "0.5rem", "6rem", "-7rem"]}
        >
          <Heading fontSize={["md", "lg", "lg", "xl"]} color="brand.white">
            Mosope Awolowo.
          </Heading>
          <Text fontSize={["md", "lg", "xl"]} color="brand.white">
            Accountant turned UI/UX Designer
          </Text>
        </Box>
      </Box>
      <Box ml="auto" display={['none', 'none', 'none', 'block']}>
        <Image
          width={226}
          height={370}
          alt="hero"
          src="/assets/images/hero/3.png"
        />
      </Box>
    </SimpleGrid>
  )
}
