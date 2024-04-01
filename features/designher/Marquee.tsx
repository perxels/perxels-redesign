import React from 'react'
import Marquee from 'react-fast-marquee'
import {Box, Text} from '@chakra-ui/react'
export const MarqueeComp = () => {
  return (
    <Box
    mb="4.375rem"
    // mt="4.375rem"
    transform={"rotate(355deg)"}
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
           textTransform={"uppercase"}
            >
           •  {" "}{" "}Competition{" "}{" "}•{" "}{" "}<Text as="span" color="#FDE85C">
            Portfolio </Text>{" "}{" "}{" "} • Design{" "}{" "} • {" "}{" "}{" "}<Text as="span" color="#FDE85C">
            Competition {" "}{" "}</Text> • <Text as="span" color="#FFF">UIUX Design {" "}{" "} </Text>• {" "}{" "}<Text as="span" color="#FDE85C">Design</Text> 
            </Text>
            <Text
           color="#FFF"
           fontSize={["1.25rem","1.6875rem"]}
           fontWeight="700"
           padding=".9375rem .5625rem"
           textTransform={"uppercase"}
            >
           •  {" "}{" "}Competition{" "}{" "}•{" "}{" "}<Text as="span" color="#FDE85C">
            Portfolio </Text>{" "}{" "}{" "} • Design{" "}{" "} • {" "}{" "}{" "}<Text as="span" color="#FDE85C">
          Competion {" "}{" "}</Text> • <Text as="span" color="#FFF">UIUX Design {" "}{" "} </Text>• {" "}{" "}<Text as="span" color="#FDE85C">Competition</Text>
            </Text>
        </Marquee>
  
    </Box>
  )
}
