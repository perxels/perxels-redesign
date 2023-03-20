import React from 'react'
import { Footer } from '../components'
import { AdmitMotion, Hero, MotionClassPlan, MotionTools, Process, MotionProjects } from '../features/motion'

const motion = () => {
  return (
    <div>
        <Hero/>
        <Process/>
        <MotionClassPlan/>
        <MotionTools/>
        <MotionProjects/>
        <AdmitMotion/>
        <Footer yellowFooterPill/>
    </div>
  )
}

export default motion