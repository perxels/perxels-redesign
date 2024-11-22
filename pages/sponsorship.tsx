import React from 'react'
import { ClassPlan, Instructions, SponsorHero } from '../features/sponsorship'
import { MarqueeComp } from '../features/physical'
import { MainLayout } from '../layouts'
import { TestimonialSch } from '../features/testimonial'

const sponsorship = () => {
  return (
    <MainLayout>
      <SponsorHero />
      <Instructions />
      <MarqueeComp />
      <ClassPlan />
      <TestimonialSch />
    </MainLayout>
  )
}

export default sponsorship
