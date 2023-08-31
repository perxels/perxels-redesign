import React from 'react'
import {Box, Flex, Image, Text, VStack} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
import {FormComp} from './FormComp'
export const HubForm = () => {
  return (
    <Box  >
        <MainContainer bg="linear-gradient(0deg, rgba(52, 41, 107, 0.10) 0%, rgba(52, 41, 107, 0.10) 100%), #FFF;">
            <Flex pt="5%" pb="10%">
                <Box zIndex="1">
                    <Image src="assets/images/hub/hubFormImage.png" alt="hubform" />
                </Box>
                <Box zIndex="3" transform="translate(-5%, 5%)">
                    <FormComp/>
                </Box>
            </Flex>
        </MainContainer>
    </Box>
  )
}
