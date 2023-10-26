import React from 'react'
import { Box, Heading, Image, Flex, Text } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
export const Hero = () => {
  return (
    <Box py={["8%","5%"]}>
    <MainContainer>
    <Flex
    justifyContent="space-between"
    alignItems="center"
    flexDir={["column", "row"]}
    rowGap="2rem"
    >
      <Box
      width={["100%","50%"]}
      >
        <Heading
        color="#121212"
        fontSize={["2.8rem","5rem"]}
        lineHeight="102%"
        fontWeight="800"

        >
        Explore our 
        </Heading>
        <Heading
        color="#E3719C"
        fontSize={["2.8rem","5rem"]}
        lineHeight="102%"
        fontWeight="800"
        >
        Physical Spaces.
        </Heading>
        <Text
        fontSize={["0.9rem","1.25rem"]}
        color="#555"
        mt={["1rem","1.875rem"]}
        >
        On our quest to continue expanding and bringing design education to your dorrstep, we have establishde a couple of physical learning spaces.
        </Text>
      </Box>
      <Box
      width={["100%","45%"]}
      >
        <Image src="/assets/images/class-group/physicalHero.png" alt="physical space hero" />
      </Box>
    </Flex>
    </MainContainer>
    </Box>
  )
}
