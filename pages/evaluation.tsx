import React from 'react'
import {Hero, Overview, InfoLayout, Stages, Pricing, Testimonial} from '../features/evaluation'
import { MainLayout } from '../layouts'
const evaluation = () => {
  return (
   <MainLayout>
        <Hero/>
        <Overview/>
        <InfoLayout/>
        <Stages/>
        <Pricing/>
        <Testimonial/>
    </MainLayout>
  )
}

export default evaluation