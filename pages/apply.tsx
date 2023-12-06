import React from 'react'
import {
  ClassPlanApply,
  Instructions,
  SponsorHero,
} from '../features/sponsorship'
import {MarqueeComp} from '../features/physical'
import { MainLayout } from '../layouts'
import { TestimonialSch } from '../features/testimonial'

const sponsorship = () => {
  return (
    <MainLayout>
     <SponsorHero />
    <Instructions />
    <MarqueeComp/>
    <ClassPlanApply/>
      <TestimonialSch />
    </MainLayout>
  )
}

export default sponsorship
