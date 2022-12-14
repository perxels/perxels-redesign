import { Box, Button, Center, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
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
        <Box pos="relative" py={["3rem", "3rem", "3rem", "9rem"]}>
          <Center flexDir="column" alignItems={["center", "center", "center", "flex-start"]} h="full">
            <Heading textAlign={["center", "center", "center", "left"]} fontSize={["6xl", "6xl", "6xl", "9xl"]} color="brand.dark.200">
              Teens too can...
            </Heading>
            <Box
              borderWidth="1px"
              borderColor="brand.purple.500"
              px={["1.5rem", "1.5rem", "1.5rem", "2.5rem"]}
              py={["0.75rem", "0.75rem", "0.75rem", "1rem"]}
              mt={["1.125rem", "1.125rem", "1.125rem", "1.5rem"]}
              pos="relative"
            >
              <Box 
                pos="absolute"
                top="-4px"
                left="-4px"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                top="-4px"
                left="50%"
                transform="translateX(-50%)"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                top="-4px"
                right="-4px"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                bottom="-4px"
                left="-4px"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                bottom="-4px"
                left="-4px"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                bottom="-4px"
                left="50%"
                transform="translateX(-50%)"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Box 
                pos="absolute"
                bottom="-4px"
                right="-4px"
                w="8px"
                h="8px"
                bg="brand.purple.500"
              />
              <Heading fontSize={["6xl", "6xl", "6xl", "1xxl"]} textTransform="uppercase">
                Design
              </Heading>
            </Box>
            <Text textAlign={["center", "center", "center", "left"]} fontSize={["md", "md", "md", "xl"]} color="brand.dark.100" mt="1.4rem" maxW="460px">
              We are empowering the next generation of young design creatives.
              Register your Children to learn the future skill now at Perxels.
            </Text>

            <Button mt="1.25rem" h="3.125rem">Get Started</Button>
          </Center>
          <Img
            pos="absolute"
            top="-10rem"
            right="-26rem"
            w="55rem"
            h="auto"
            src="./assets/images/teens/teens.png"
            display={["none", "none", "none", "block"]}
          />
        </Box>
      </MainContainer>
    </Box>
  )
}
