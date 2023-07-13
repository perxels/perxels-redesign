import React from 'react'
import { Testimonial } from '../features/sponsorship'
import {
  AboutTeen,
  AdmissionProcess,
  CourseOutline,
  Expectation,
  TeensHero,
  TeenTesti
} from '../features/teens'
import { MainLayout } from '../layouts'

const Teens = () => {
  return (
    <MainLayout>
      <TeensHero />
      <AboutTeen />
      <CourseOutline />
      <AdmissionProcess />
      <Expectation title="A glimpse into what the teens would be able to do at the end of the training" />
      {/* <Testimonial /> */}
      <TeenTesti/>
    </MainLayout>
  )
}

export default Teens
