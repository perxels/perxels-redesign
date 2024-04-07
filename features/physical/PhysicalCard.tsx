import React from 'react'
import {Box, Image, Heading, Text, Icon, Flex} from '@chakra-ui/react'
import {AiOutlineArrowRight} from 'react-icons/ai'
import Link from 'next/link'
import Marquee from 'react-fast-marquee'
interface PhysicalCardInterface{
    bgImage: string;
    location: string;
    locationLink: string;
    heightValue?: string;
    fontSizeProp?: string;
    isComing?: boolean
}
export const PhysicalCard = ({bgImage, location, locationLink, heightValue, fontSizeProp, isComing}: PhysicalCardInterface) => {
  return (
    <Box
    background={`url(${bgImage}) no-repeat center center`}
    backgroundSize="cover"
    borderRadius=".625rem"
    position="relative"
    minHeight={heightValue ? heightValue : ["27.5rem","31.5625rem"]}
    // as={!isComing ? Link : Box}
    // href={locationLink }
    width="100%"
    >
    {
      isComing &&   <Box
      mt="10%"
      width="100%"
      position="absolute"
      >
           <Marquee gradientWidth={0}
           style={{
              backgroundColor:"#FDE85C",
           }}
           >
              <Text
             color="#121212"
             fontSize={["1.25rem"]}
             fontWeight="700"
             padding=".9375rem .5625rem"
              >
             • COMING SOON • {" "}{" "} COMING SOON{" "}{" "}• COMING SOON{" "}{" "}• COMING SOON{" "}{" "} 
              </Text>
          </Marquee>
      </Box>
    }
      
     <Box  p={["0 0 2.125rem 1.625rem","0 0 2.5rem 2.9375rem"]} position="absolute" bottom={"0"} left="0" >
      <Heading
      color="#FFFFFF"
      fontSize={fontSizeProp ? fontSizeProp : ["2rem","2.8125rem"]}
      fontWeight="800"
      >
      {location}
      </Heading>
      {
      !isComing &&  
      <Flex
      alignItems="center"

      >
      <Text
       color="#FFFFFF"
       fontSize={["1.25rem","1.25rem"]}
       fontWeight="400"
       as={Link}
       href={locationLink}
       _hover={{
        color: "#FCD900"
      }}
      display="flex"
      alignItems="center"
      >
      Explore Now
      <Icon  _hover={{
        color: "#FCD900"
      }} as={AiOutlineArrowRight} color="#FFFFFF" fontSize="1.25rem" ml="1.25rem" />
      </Text>
      </Flex>
      }
     </Box>
     
    </Box>
  )
}
