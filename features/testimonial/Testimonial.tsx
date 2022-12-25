import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'

import { TestimonialGrid } from './TestimonialGrid'
import { TestimonialSlider } from './TestimonialSlider'
import { TestimonyVideo } from './TestimonyVideo'
import { testimonialContent } from '../../constant'
export const Testimonial = () => {
  return (
    <MainContainer>
      <SectionHeader
        subTitle="Testimonials"
        title="Hear what they say about us."
      />
      <TestimonyVideo />
      <TestimonialSlider />
      <TestimonialGrid  testimonialContent={testimonialContent}/>
    </MainContainer>
  )
}
