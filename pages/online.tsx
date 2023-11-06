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
import {OtherPhysCardLayout, OnlinePhysicalCardData} from '../features/physical'
import {Box} from '@chakra-ui/react'
const ClassPlans = () => {
  return (
    <MainLayout>
      {/* <BookBanner/> */}
      <Hero />
      <ClassLists/>
      {/* <HeroBook/> */}
      <StudentWorkWrapper />
      {/* <Box py="3rem"/> */}
      <LeaningTools />
      {/* <Box py="3rem"/> */}
      <OtherPhysCardLayout cardData={OnlinePhysicalCardData} />
      <Testimonial />
    </MainLayout>
  )
}

export default ClassPlans
