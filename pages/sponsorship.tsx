import React from 'react'
import { ClassPlan, Instructions, SponsorHero, Testimonial } from '../features/sponsorship'
import { MainLayout } from '../layouts'

const sponsorship = () => {
  return (
    <MainLayout>
      <SponsorHero />
      <Instructions />
      <ClassPlan />
      <Testimonial />
    </MainLayout>
  )
}

export default sponsorship
