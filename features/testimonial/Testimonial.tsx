import React from 'react'
import { SectionHeader } from '../../components'
import { testimonialContent } from '../../constant'
import { MainContainer } from '../../layouts'

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
      <TestimonyVideo />
      <TestimonialSlider />
      <TestimonialGrid testimonialContent={testimonialContent} />
    </MainContainer>
  )
}
