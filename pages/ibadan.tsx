import React from 'react'
import { OurClassGroup, StudentWorkWrapper } from '../features/classGroup'
import { HeroSubSection } from '../features/home'
import {
  ClassPlan,
    PrivateHero,
  MarqueeComp,
  ClassVid,
} from '../features/ibClass'
import { Expectation } from '../features/teens'
import { Testimonial } from '../features/sponsorship'
import { MainLayout } from '../layouts'
import {LeaningTools} from '../features/classGroup'

const privateClass = () => {
  return (
    <MainLayout>
      <PrivateHero />
      <HeroSubSection />
      <MarqueeComp />
      <ClassPlan />
      <StudentWorkWrapper />
      <LeaningTools />
      <ClassVid/>
      {/* <Expectation  title={"A glimpse into what you would be able to do at the end of the training."}/> */}
      <Testimonial />
    </MainLayout>
  )
}

export default privateClass
