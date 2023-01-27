import React from 'react'
import {Box, Text,} from '@chakra-ui/react'
export const Hero = () => {
  return (
    <Box
    w="100%"
    h={["90vh","100vh"]}
    bgImage="url('/assets/images/alumni/pattern.svg')"
    bgRepeat="no-repeat"
    bgColor="#34296B;"  
    boxSizing='border-box'
    >
        <Box
        display="flex"
        alignItems="center"
        p={["0 5%" ,"0 15%"]}
        // justifyContent="center"
        height={["100%","60%"]}
        >
            <Box
            display={['none','block']}
            >
                <Text
                fontSize={["2.5rem","4rem"]}
                textTransform="uppercase"
                maxW="1006px"
                color="#fff"
                lineHeight={["2.5rem","5rem"]}
                fontWeight="900"
                >Scale your design</Text>
                <Text
                 fontSize={["2rem","4rem"]}
                 textTransform="uppercase"
                 maxW="1006px"
                 color="#363576"
                 lineHeight={["2.5rem","5rem"]}
                 fontWeight="900"
                 padding={"0.01em 0.3em 0.01em 0.3em"}
                 backgroundColor=" #FEDA00"
                 display={"inline"}
                >career in 2023</Text>
            </Box>

            <Box
            display={['block','none']}
            >
                <Text
                  fontSize={["2.7rem","4rem"]}
                  textTransform="uppercase"
                  maxW="1006px"
                  color="#fff"
                  lineHeight={["3rem","5rem"]}
                  fontWeight="900"
                >Scale your</Text>
                <Text
                 fontSize={["2.7rem","4rem"]}
                 textTransform="uppercase"
                 maxW="1006px"
                 color="#fff"
                 lineHeight={["3rem","5rem"]}
                 fontWeight="900"
                > design career</Text>
                <Text
                fontSize={["2.7rem","4rem"]}
                textTransform="uppercase"
                maxW="1006px"
                color="#363576"
                lineHeight={["3rem","5rem"]}
                fontWeight="900"
                padding={"0.01em 0.3em 0.01em 0.3em"}
                backgroundColor=" #FEDA00"
                display={"inline"}
                >in 2023</Text>
            </Box>
        </Box>
    </Box>
  )
}
