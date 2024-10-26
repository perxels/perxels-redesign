import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { TestimonialGrid2 } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContentSecond } from '../../constant'
import { MobileTestimonialSlider } from './MobileTestimonialSlider'
export const TestimonyGridContainer = () => {
  return (
    <Box p={['2rem 1.625rem', '2rem 1.1rem', '2rem 6.25rem']}>
      <TestimonialGrid2
        testimonialContent={testimonialContentSecond}
        isTestimonial
      />
      <Box display={['none', 'none', 'none', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>

      <Box display={['block', 'block', 'block', 'none']}>
        <MobileTestimonialSlider />
      </Box>
    </Box>
  )
}
