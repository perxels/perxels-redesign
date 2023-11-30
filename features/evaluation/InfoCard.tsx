import React from 'react'
import {Box, Heading, Text, Img,} from '@chakra-ui/react'
import {EvalInfoInterface } from '../../constant'



export const InfoCard = ({icon, title, description}: EvalInfoInterface) => {
  return (
    <Box bgColor="#FFFFFF" borderRadius="32px" padding="2.625rem 2rem">
        <Img src={icon} alt={title} />
        <Text fontSize={"24px"} fontWeight="600" mt={["2.6rem","115px"]} color="#1A1A1A" >
       {title}
        </Text>
        <Text  fontSize={"18px"} fontWeight="400" mt="1rem" color="#1A1A1A" >
       {description}
        </Text>
    </Box>
  )
}
