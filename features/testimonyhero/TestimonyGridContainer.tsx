import React from 'react'
import { Box } from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContent } from '../../constant'
export const TestimonyGridContainer = () => {
  return (
    <Box p={['2rem 1.625rem', '2rem 1.1rem', '2rem 6.25rem']}>
      <Box display={['block', 'block', 'none', 'none']}>
        <SectionHeader
          subTitle="Testimonials"
          title="Hear what they say about us."
        />
        <TestimonyVideo />
      </Box>
      <TestimonialGrid testimonialContent={testimonialContent} />
      <Box display={['none', 'none', 'block', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>
    </Box>
  )
}
