import React from 'react'
import { Heading, Text, Box, Flex, Button, Icon, Image } from '@chakra-ui/react'
import { Wave } from './Wave'
export const Hero = () => {
  return (
    <Box
      w="full"
      bg={`url(./assets/images/motion/heroImage.png) center/cover no-repeat`}
      position="relative"
      h="100vh"
      p="1.625rem 5%"
    >
      {/* overlay on background */}
      <Box
        position="absolute"
        w="full"
        h="full"
        bg="rgba(0,0,0,0.5)"
        zIndex={1}
        top="0"
        left="0"
      />
      <Box position="absolute" zIndex={2} bottom="15%">
        <Heading
          color="brand.white"
          fontSize="2.5rem"
          fontWeight="800"
          textTransform={'uppercase'}
          lineHeight="3.045rem"
          mb=".625rem"
        >
          Welcome To
        </Heading>
        <Heading
          fontSize="6.25rem"
          fontWeight="800"
          lineHeight="98.3px"
          textTransform={'uppercase'}
          color="brand.yellow.300"
          maxW="70%"
        >
          Perxels Motion School!
        </Heading>
      </Box>
      <Box position="absolute" zIndex={2} bottom="10%" right="5%">
        <Text fontSize="20px" fontWeight="700" color="#BFBFBF">
          HAVAIANAS &quot;THIS IS HAVAIANAS&quot;;
        </Text>
        <Text fontSize="20px" fontWeight="700" color="#BFBFBF" textAlign="right">
          -Stash Media.
        </Text>
        {/* <Wave/> */}
      </Box>
    </Box>
  )
}
