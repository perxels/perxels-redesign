import React from 'react'
import {Box, Heading} from '@chakra-ui/react'
export const ClassVid = () => {
  return (
    <Box>
        <Heading textAlign="center" mb={["1rem","1.5rem"]}>
        Catch a glimpse into the unique training experience
        </Heading>
        <Box
        px={["5%","20%"]}
        >
            <iframe width="100%" height="500" src="https://www.youtube.com/embed/t1JBaCIprAo" title="YouTube video player" allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen></iframe>
        </Box>
    </Box>
  )
}
