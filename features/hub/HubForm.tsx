import React from 'react'
import {Box, Flex, Image, Text, VStack} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
import {FormComp} from './FormComp'
export const HubForm = () => {
  return (
    <Box  
    background={['url("/assets/images/hub/hubFormBg.png")', 'linear-gradient(0deg, rgba(52, 41, 107, 0.10) 0%, rgba(52, 41, 107, 0.10) 100%), #FFF;']}
    // backgroundColor={["none","]}
    id="bookspace"
    >
        <MainContainer bg="transparent">
            <Flex pt="5%" pb="10%">
                <Box zIndex="1" display={["none","block"]} >
                    <Image src="assets/images/hub/hubFormImage.png" alt="hubform" />
                </Box>
                <Box zIndex="3" transform={["translate(0%)","translate(-5%, 5%)"]}>
                    <FormComp/>
                </Box>
            </Flex>
        </MainContainer>
    </Box>
  )
}
