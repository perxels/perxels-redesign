import React from 'react'
import Marquee from 'react-fast-marquee'
import {Box, Text} from '@chakra-ui/react'
export const MarqueeComp = () => {
  return (
    <Box
    mb="4.375rem"
    >
         <Marquee gradientWidth={0}
         style={{
            backgroundColor:"#383084",
          
         }}
         >
            <Text
           color="#FFF"
           fontSize={["1.25rem","1.6875rem"]}
           fontWeight="700"
           padding=".9375rem .5625rem"
            >
           •  {" "}{" "}PERXELS IS{" "}<Text as="span" color="#FDE85C">
            ACCREDITED </Text> BY AMERICAN COUNCIL OF TRAINING AND DEVELOPMENT  • {" "}{" "}  PERXELS IS NOW {" "}<Text as="span" color="#FDE85C">
            ACCREDITED </Text>  BY AMERICAN COUNCIL OF TRAINING AND DEVELOPMENT {" "}{" "} 
            </Text>
        </Marquee>
    </Box>
  )
}
