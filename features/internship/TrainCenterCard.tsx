import React from 'react'
import {Box, Heading} from '@chakra-ui/react'


interface TrainCenterCardProps {
    bgImage: string;
    location: string;
}


export const TrainCenterCard = ({bgImage, location}:TrainCenterCardProps) => {
  return (
    <Box
    background={`url(${bgImage}) no-repeat center center`}
    backgroundSize="cover"
    borderRadius=".625rem"
    position="relative"
    minHeight={["300px","430px"]}
    width="100%"
>

    <Box  p={["0 0 2.125rem 1.625rem","0 0 2.5rem 2.375rem"]} position="absolute" bottom={"0"} left="0" >
    <Heading
    color="#FFFFFF"
    fontSize={["2rem","2.8125rem"]}
    fontWeight="600"
    >
    {location}
    </Heading>
    </Box>
    </Box>
  )
}
