import React from 'react'
import {
  ClassLists,
  Hero,
  LeaningTools,
  StudentWorkWrapper,
} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'
import {HeroBook, BookBanner} from '../features/book'

const ClassPlans = () => {
  return (
    <MainLayout>
      <BookBanner/>
      <Hero />
      <ClassLists/>
      <HeroBook/>
      <StudentWorkWrapper />
      <LeaningTools />
      <Testimonial />
    </MainLayout>
  )
}

export default ClassPlans
