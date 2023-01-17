import React from 'react'
import {
  ClassLists,
  Hero,
  LeaningTools,
  StudentWorkWrapper,
} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'

const ClassPlans = () => {
  return (
    <MainLayout>
      <Hero />
      <ClassLists/>
      <StudentWorkWrapper />
      <LeaningTools />
      <Testimonial />
    </MainLayout>
  )
}

export default ClassPlans
