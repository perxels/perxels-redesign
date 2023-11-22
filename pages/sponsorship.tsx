import React from 'react'
import {
  ClassPlan,
  Instructions,
  SponsorHero,
  Testimonial,
} from '../features/sponsorship'
import {MarqueeComp} from '../features/physical'
import { MainLayout } from '../layouts'

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
