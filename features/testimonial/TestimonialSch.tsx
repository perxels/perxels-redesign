import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { testimonialContent } from '../../constant'
import { MainContainer } from '../../layouts'
import { MobileTestimonialSlider } from '../testimonyhero/MobileTestimonialSliderSch'
import { TestimonialSlider } from './TestimonialSliderSch'
import { TestimonyVideo } from './TestimonyVideoSch'
import { TestimonialGrid2 } from './TestimonialGrid2'
export const TestimonialSch = () => {
  return (
    <MainContainer>
      <SectionHeader
        subTitle="Testimonials"
        title="Hear what they say about us."
      />
      <Box display={['none', 'none', 'none', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>
      <Box display={['block', 'block', 'block', 'none']}>
        <MobileTestimonialSlider />
      </Box>
      <TestimonialGrid2 testimonialContent={testimonialContent} />
    </MainContainer>
  )
}
