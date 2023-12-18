import React from 'react'
import {Box, Flex, Heading, Text, Img, Button} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import Link from 'next/link'
export const Hero = () => {
  return (
   <MainContainer>
    <Flex justifyContent="space-between" alignItems="center" flexDir={["column", "row"]} rowGap="3rem" mt={["50px","90px"]}>
      <Box width={["100%","60%"]}>
        <Box display={["none", "block"]} padding="8px 16px" bgColor="#FAFAFA" maxW={"24.375rem"} rounded=".75rem">
          <Text fontSize="1.125rem" color="#1A1A1A" >
        📚 The premier examination to set you apart.
        </Text>
        </Box>
      <Heading fontSize={["2.1875rem","3.625rem"]} fontWeight="800" lineHeight={["2.4875rem","4rem"]}>
      Evaluate competencies with design examination
      </Heading>
      <Text fontSize={["1rem","1.175rem"]} color={"#1A1A1A"} lineHeight={["1.3rem","1.675rem" ]}mt={["1rem","1.5rem"]} w={["100%","70%"]}>
      Elevate your UI/UX design career by obtaining certification through examination. Enhance your CV and gain a competitive edge in the field
      </Text>
      <Flex mt={["1rem","1.675rem"]} justifyContent={["center", "flex-start"]}>
      <Button as={Link} href="/exam/register" rounded=".3125rem" fontSize={["1rem","1.25rem"]}  w={["12.25rem","16.375rem"]}>
      Apply
      </Button>
      </Flex>
      <Flex  bgColor="#FAFAFA" mt="1.675rem" p=".5rem .75rem" rounded=".5rem" maxWidth="25.9375rem" alignItems="center" display={["none", "flex"]}>
        <Text size="14px" color="#1D1D1D" w="100%">
        ACCREDITED BY THE AMERICAN COUNCIL 
        OF TRAINING AND DEVELOPMENT
        </Text>
        <Box >
       <Img src="/assets/icons/americanTraining.svg" alt="" />
       </Box>
      </Flex>
      </Box>
      <Box width={["100%","40%"]}>
        <Img src="/assets/images/evaluation/heroImg.png" alt="" />
        <Flex  bgColor="#FAFAFA" mt="1.675rem" p=".5rem .75rem" rounded=".5rem" maxWidth="25.9375rem" alignItems="center" display={["flex", "none"]}>
        <Text fontSize={["12px","14px"]} color="#1D1D1D" w="100%" >
        ACCREDITED BY THE AMERICAN COUNCIL 
        OF TRAINING AND DEVELOPMENT
        </Text>
        <Box >
       <Img src="/assets/icons/americanTraining.svg" alt="" />
       </Box>
      </Flex>
      </Box>
    
    </Flex>
   </MainContainer>
  )
}
