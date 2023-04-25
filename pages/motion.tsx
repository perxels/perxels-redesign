import React from 'react'
import { Footer } from '../components'
import { AdmitMotion, Hero, MotionClassPlan, MotionTools, Process, MotionProjects, NewHero } from '../features/motion'

const motion = () => {
  return (
    <div>
        {/* <Hero/> */}
        <NewHero/>
        <AdmitMotion/>
        <MotionClassPlan/>
        <Process/>
        <MotionTools/>
        <MotionProjects/>
        <Footer yellowFooterPill/>
    </div>
  )
}

export default motion