import React, {useState} from 'react'
import { Box } from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContentSecond} from '../../constant'
export const TestimonyGridContainer = () => {
  
 

  return (
    <Box p={['2rem 1.625rem', '2rem 1.1rem', '2rem 6.25rem']}>
      <TestimonialGrid testimonialContent={testimonialContentSecond} isTestimonial />
      <Box display={['block', 'block', 'block', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>
    </Box>
  )
}
