import React from 'react'
import { Testimonial } from '../features/sponsorship'
import {
  AboutTeen,
  AdmissionProcess,
  CourseOutline,
  Expectation,
  TeensHero,
} from '../features/teens'
import { MainLayout } from '../layouts'

const Teens = () => {
  return (
    <MainLayout>
      <TeensHero />
      <AboutTeen />
      <CourseOutline />
      <AdmissionProcess />
      <Expectation />
      <Testimonial />
    </MainLayout>
  )
}

export default Teens
