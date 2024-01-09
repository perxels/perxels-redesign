import React from 'react'
import {Box, Text} from '@chakra-ui/react'

export const ExpectationCard = ({bgImage, description}: {bgImage: string; description: string}) => {
  return (
    <Box
     height={["22.6875rem","399px"]}
    background={`url(${bgImage}) no-repeat center center`}
    backgroundSize="cover"
    borderRadius="10px"
    position="relative"
    width="100%"
    >
        {/* overlay gradient  */}
        <Box
        position="absolute"
        bottom="0"
        left="0"
        right="0"
        top="0"
        backgroundImage="linear-gradient(180deg, rgba(0, 0, 0, 0) 0%, #000000 100%)"
        borderRadius="10px"
        zIndex="1"
      />

        <Text position="absolute" bottom="0" left="0" right="0" p={["0.5rem 1rem","1rem"]} color="#FCFCFC" borderRadius="10px" margin={["15px","15px 25px"]} zIndex="2" textAlign="center" fontSize="35px">
          {description}
        </Text>
    </Box>
  )
}
