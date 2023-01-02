import React from 'react'
import { MainLayout } from '../layouts'
import { TestimonyGridContainer, TestimonyHero } from '../features/testimonyhero'

const testimonials = () => {
  return (
   <MainLayout>
        <TestimonyHero />
        <TestimonyGridContainer />
   </MainLayout>
  )
}

export default testimonials