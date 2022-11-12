import React from 'react'
import { ClassLists, LeaningTools, StudentWorkWrapper } from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { TestimonyVideo } from '../features/testimonial/TestimonyVideo'
import { MainLayout } from '../layouts'

const ClassPlans = () => {
  return (
    <MainLayout>
        <ClassLists />
        <StudentWorkWrapper />
        <LeaningTools />
        <Testimonial />
    </MainLayout>
  )
}

export default ClassPlans