import React from 'react'
import { Box, Image, Heading, Text } from '@chakra-ui/react'
import { MotionProcessInterface } from '../../constant'
export const ProcessCard = ({title, description, image}:MotionProcessInterface) => {
  return (
    <Box
    rounded="5px"
    bg="#FFF"
    px="1.1875rem"
    py="2.625rem"
    >
        
        <Box
        mb="3.9375rem"
        >
            <Image boxSize='53px' objectFit={"contain"} src={image} alt={title} />
        </Box>
        <Box 
        mb="1.375rem"
        >
            <Heading
              fontSize={"1.5625rem"}
              color="#121212"
              fontWeight="700"
            >{title}</Heading>
        </Box>
        <Box>
            <Text
            fontSize="1.25rem"
            fontWeight="400"
            color="#707070"
            lineHeight="1.91rem"
            >
                {description}
            </Text>
        </Box>
    </Box>
  )
}
