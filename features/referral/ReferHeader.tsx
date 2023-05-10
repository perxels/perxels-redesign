import React from 'react'
import {Box, Flex, Text, Heading, Image, Button} from '@chakra-ui/react'

interface RefHeaderProps{
    title: string;
    subtitle: string;
    color: string;
}

export const ReferHeader = ({title, subtitle, color}: RefHeaderProps) => {
  return (
    <Box
    width="100%"
    overflow="hidden"
    maxWidth="100vw"
    position="relative"
    display="flex"
    alignItems="center"
    justifyContent="center"
    minHeight="12.5rem"
    >
        <Heading 
        position="absolute" 
        // width="100%"
        top="50%" 
        left="50%"
        transform="translate(-50%, -50%)" 
        fontSize="10rem" 
        lineHeight="10rem" 
        css={{
            '@supports(-webkit-text-stroke: 1px black)': {
                WebkitTextStroke: `1px ${color}`,
                WebkitTextFillColor: 'transparent',
            }
        }}
        whiteSpace="nowrap"
        zIndex="0"
        opacity="0.1"
        // textColor="transparent"
        >
            {title}
        </Heading>
     <Heading 
     as="h2" 
     fontSize={["2.5rem"]} 
     lineHeight={["2.8rem","3.5rem"]} 
     textAlign="center" 
     color={`${color}`}
     _before={{
            content: '""',
            height:"6px",
            width:"80px",
            background:"transparent"
            
     }}
     zIndex="1"
     > 
    {subtitle}
    </Heading>
    <Text>
        
    </Text>

    </Box>
  )
}
