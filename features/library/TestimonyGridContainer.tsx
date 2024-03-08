import React, { useState } from 'react'
import { Box } from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContentSecond } from '../../constant'
import { MobileTestimonialSlider } from '../testimonyhero/MobileTestimonialSlider'
export const TestimonyGridContainer = () => {
  return (
    <Box>

<Box display={['none', 'none', 'none', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>

      <TestimonialGrid
        columns={[1, 2, 2, 2]}
        testimonialContent={testimonialContentSecond}
        isTestimonial
      />
    

      <Box display={['block', 'block', 'block', 'none']}>
        <MobileTestimonialSlider />
      </Box>
    </Box>
  )
}
