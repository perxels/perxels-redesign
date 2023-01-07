import React from 'react'
import { OurClassGroup, StudentWorkWrapper } from '../features/classGroup'
import { HeroSubSection } from '../features/home'
import {
  ClassPlan,
  InternationalHero,
  MarqueeComp,
} from '../features/international'
import { Expectation } from '../features/teens'
import { Testimonial } from '../features/sponsorship'
import { MainLayout } from '../layouts'

const international = () => {
  return (
    <MainLayout>
      <InternationalHero />
      <HeroSubSection />
      <MarqueeComp />
      <ClassPlan />
      <StudentWorkWrapper />
      {/* <Expectation  title={"A glimpse into what you would be able to do at the end of the training."}/> */}
      <Testimonial />
    </MainLayout>
  )
}

export default international
