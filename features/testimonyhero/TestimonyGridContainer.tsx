import React from 'react'
import {Box} from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
export const TestimonyGridContainer = () => {
  return (
   <Box
   p={["2rem 1.625rem","2rem 6.25rem"]}
   >
        <TestimonialGrid/>
        <TestimonyVideo/>
        <TestimonialSlider/>
   </Box>
  )
}
