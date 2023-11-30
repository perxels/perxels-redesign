import React from 'react'
import { MainContainer } from '../../layouts'
import {Box, Heading, Img, Text, Center} from '@chakra-ui/react'
export const Overview = () => {
  return (
    <MainContainer>
        <Box bgColor="#F7F8F8" p="5%" rounded="2.625rem" mt="6.25rem">
            <Center flexDir="column" alignItems={["flex-start","center"]}>
                <Heading fontSize={["42px","4.5rem"]} textAlign={["left", "center"]}>
                Overview
                </Heading>
                <Text fontSize={["1.25rem","1.5rem"]} lineHeight={["2rem","2.4375rem"]} textAlign={["left","center" ]} width={["100%","70%"]} mt={["20px","40px"]}>
                On our quest to continue expanding and bringing design education to your doorstep, we have established a couple of physical learning spaces. your dorrstep, we have established couple of physical learning spaces. 
                </Text>
            </Center>
            <Box mt={["3rem","4.1875rem"]}>
                <Img display={["none", "block"]} src="/assets/images/evaluation/overview.png" alt="" />
                <Img display={["block", "none"]} src="/assets/images/evaluation/overviewMobile.png" alt="" />
            </Box>
        </Box>
    </MainContainer>
  )
}
