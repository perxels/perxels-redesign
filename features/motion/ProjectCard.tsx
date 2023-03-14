import React from 'react'
import {Box, Text, Image} from '@chakra-ui/react'

export const ProjectCard = () => {
  return (
    <Box
    ml={["1rem", '1rem']}
    >
       <Box
       maxWidth="22.6875rem"
       >
       <Image src="/assets/images/motion/project1.png" alt="projectImage" />
       </Box>
        <Text color="brand.dark.200" fontSize={["0.5rem","1rem"]} fontWeight="700" mt="1.125rem">CCIA &quot;A LIFE SHOULD BE LONG&quot;</Text>
    </Box>
  )
}
