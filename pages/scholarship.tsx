import React from 'react'
import {
  ClassPlan,
  Instructions,
  SponsorHero,
} from '../features/sponsorship'
import {MarqueeComp} from '../features/physical'
import { MainLayout } from '../layouts'
import { Testimonial } from '../features/testimonial'

const sponsorship = () => {
  return (
    <MainLayout>
     <SponsorHero />
    <Instructions />
    <MarqueeComp/>
    <ClassPlan />
      <Testimonial />
    </MainLayout>
  )
}

export default sponsorship
