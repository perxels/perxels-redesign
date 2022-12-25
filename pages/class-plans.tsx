import React from 'react'
import {
  ClassLists,
  Hero,
  LeaningTools,
} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'

const ClassPlans = () => {
  return (
    <MainLayout>
      <Hero />
      <ClassLists />
      <LeaningTools />
      <Testimonial />
    </MainLayout>
  )
}

export default ClassPlans
