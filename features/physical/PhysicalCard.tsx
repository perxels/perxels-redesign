import React from 'react'
import {Box, Image, Heading, Text, Icon, Flex} from '@chakra-ui/react'
import {AiOutlineArrowRight} from 'react-icons/ai'
import Link from 'next/link'

interface PhysicalCardInterface{
    bgImage: string;
    location: string;
    locationLink: string;
    heightValue?: string;
    fontSizeProp?: string;
}
export const PhysicalCard = ({bgImage, location, locationLink, heightValue, fontSizeProp}: PhysicalCardInterface) => {
  return (
    <Box
    background={`url(${bgImage}) no-repeat center center`}
    backgroundSize="cover"
    borderRadius=".625rem"
    position="relative"
    minHeight={heightValue ? heightValue : ["27.5rem","31.5625rem"]}
   
    >
       <Box  p={["0 0 2.125rem 1.625rem","0 0 2.5rem 2.9375rem"]} position="absolute" bottom={"0"} left="0" >
        <Heading
        color="#FFFFFF"
        fontSize={fontSizeProp ? fontSizeProp : ["2rem","2.8125rem"]}
        fontWeight="800"

        >
        {location}
        </Heading>
        <Flex
        alignItems="center"
        >
        <Text
         color="#FFFFFF"
         fontSize={["1.25rem","1.25rem"]}
         fontWeight="400"
         as={Link}
         href={locationLink}
        >
        Explore Now
        </Text>
        <Icon as={AiOutlineArrowRight} color="#FFFFFF" fontSize="1.25rem" ml="1.25rem" />
        </Flex>
       </Box>
    </Box>
  )
}
