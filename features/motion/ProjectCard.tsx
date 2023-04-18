import React from 'react'
import {Box, Text, Image} from '@chakra-ui/react'
import {MotionProjectInterface} from '../../constant'
export const ProjectCard = ({imageUrl, title}: MotionProjectInterface) => {
  return (
    <Box
    ml={["1rem", '1rem']}
    >
       <Box
       maxWidth="22.6875rem"
       >
       <Image src={imageUrl} alt="projectImage" />
       </Box>
        <Text color="brand.white" fontSize={["0.5rem","1rem"]} fontWeight="700" mt="1.125rem">{title}</Text>
    </Box>
  )
}
