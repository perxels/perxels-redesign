import React from 'react'
import { Box, Text, Heading, Flex } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
export const Benefits = () => {
  return (
    <MainContainer>
      <Flex bgColor="#F7F8F8" padding={["30px","5%"]}    mt={["3.75rem","4.5625rem"]} rounded="2.625rem" columnGap="1.25rem"
      flexDir={["column", "row"]}
      rowGap="2rem"
      >
        <Box
          position="relative"
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          w={["100%","40%"]}
          rounded="2rem"
        >
          <Text
            fontSize={["72px"]}
            color="#1A1A1A"
            fontWeight="400"
            textAlign="right"
            mb={["3.0625rem","6.875rem"]}
           
          >
            01
          </Text>
          <Text fontSize={["32px","42px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]}>
            Be Recognized for your skill
          </Text>
          <Text fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt={["1rem","2rem"]}  color="#707070">
            Demonstrate your capability to deliver project outcomes at a certain
            level
          </Text>
        </Box>
        <Box position="relative" 
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          w={["100%","30%"]}
          rounded="2rem"
          >
          <Text
              fontSize="54px"
              color="#626262"
              fontWeight="400"
              textAlign="right"
              mb={["3.0625rem","6.875rem"]}
          >02</Text>
          <Box bottom={0} position={["relative","absolute"]} top="70%">
            <Text
            fontSize={["32px","36px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]}
            >Give yourself competitive edge</Text>
           <Text fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt="2rem" display={["block","none"]}  color="#707070">
            Demonstrate your capability to deliver project outcomes at a certain
            level
          </Text>
          </Box>
        </Box>
        <Box position="relative" 
          bgColor="#FFFFFF"
          p={["2rem 5%","3.875rem 2.625rem"]}
          w={["100%","30%"]}
          rounded="2rem"
          >
          <Text
              fontSize="54px"
              color="#626262"
              fontWeight="400"
              textAlign="right"
              mb={["3.0625rem","6.875rem"]}
          >03</Text>
          <Box bottom={0} position={["relative","absolute"]} top="70%">
            <Text
            fontSize={["32px","36px"]} color="#1A1A1A" lineHeight={["2.4362rem","3.25rem"]}
            >Empower 
            your career growth</Text>
           <Text fontSize={["18px","24px"]} lineHeight={["1.125rem","36px"]} mt="2rem" display={["block","none"]} color="#707070"> 
           Demonstrate your capability to deliver project outcomes at a certain level 
            level
          </Text>
          </Box>
        </Box>
      </Flex>
    </MainContainer>
  )
}
