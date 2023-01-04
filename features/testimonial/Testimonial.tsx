import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { testimonialContent } from '../../constant'
import { MainContainer } from '../../layouts'
import { MobileTestimonialSlider } from '../testimonyhero/MobileTestimonialSlider'

import { TestimonialGrid } from './TestimonialGrid'
import { TestimonialSlider } from './TestimonialSlider'
import { TestimonyVideo } from './TestimonyVideo'
export const Testimonial = () => {
  return (
    <MainContainer>
      <SectionHeader
        subTitle="Testimonials"
        title="Hear what they say about us."
      />
      <Box display={["none", "none", "none", "block"]}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>
      <Box display={['block', 'block', 'block', 'none']}>
        <MobileTestimonialSlider />
      </Box>
      <TestimonialGrid testimonialContent={testimonialContent} />
    </MainContainer>
  )
}
