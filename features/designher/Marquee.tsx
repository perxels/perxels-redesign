import React from 'react'
import Marquee from 'react-fast-marquee'
import {Box, Text} from '@chakra-ui/react'
export const MarqueeComp = () => {
  return (
    <Box
    mb="4.375rem"
    mt="4.375rem"
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
           •  {" "}{" "}Empower{" "}{" "}•{" "}{" "}<Text as="span" color="#FDE85C">
            Inclusion </Text>{" "}{" "}{" "} • Design{" "}{" "} • {" "}{" "}{" "}<Text as="span" color="#FDE85C">
            Her {" "}{" "}</Text> • <Text as="span" color="#FFF">Future {" "}{" "} </Text>• {" "}{" "}<Text as="span" color="#FDE85C">Development</Text> •{" "}{" "} <Text as="span" color="#FFF"> Equality</Text>
            </Text>
            <Text
           color="#FFF"
           fontSize={["1.25rem","1.6875rem"]}
           fontWeight="700"
           padding=".9375rem .5625rem"
           textTransform={"uppercase"}
            >
           •  {" "}{" "}Empower{" "}{" "}•{" "}{" "}<Text as="span" color="#FDE85C">
            Inclusion </Text>{" "}{" "}{" "} • Design{" "}{" "} • {" "}{" "}{" "}<Text as="span" color="#FDE85C">
            Her {" "}{" "}</Text> • <Text as="span" color="#FFF">Future {" "}{" "} </Text>• {" "}{" "}<Text as="span" color="#FDE85C"> Development</Text> •{" "}{" "} <Text as="span" color="#FFF"> Equality</Text>
            </Text>
        </Marquee>
  
    </Box>
  )
}
