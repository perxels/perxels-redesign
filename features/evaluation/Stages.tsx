import React from 'react'
import {Box, Text, Flex, Img , Heading }from '@chakra-ui/react'
import { StagesCard } from './StagesCard'
import { MainContainer } from '../../layouts'
export const Stages = () => {
  return (
    <MainContainer>
    <Box mt="5rem">
        <Heading fontSize="72px" mb="8.25rem" fontWeight={"700"}>
        Stages 
        </Heading>
        <Flex >
            <Box>
                <StagesCard/>   
            </Box>
            <Box width="90%" display={["none", "block"]}>
                <Img src="/assets/images/evaluation/stageImg.png" alt="" />
            </Box>
        </Flex>
    </Box>
    </MainContainer>
  )
}
