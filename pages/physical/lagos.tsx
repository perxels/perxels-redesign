import React from 'react'
import {LagosHero, LagSpace, StudentJob, ClassPlan, OtherPhysCardLayout, MarqueeComp} from '../../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../../features/classGroup'
import { Testimonial } from '../../features/testimonial'
import { MainLayout } from '../../layouts'
const lagos = () => {
  return (
    <MainLayout>
        <LagosHero/>
        <LagSpace/>
        <MarqueeComp/>
        <ClassPlan/>
        <LeaningTools/>
        <OtherPhysCardLayout/>
        <StudentWorkWrapper/>
        <StudentJob/>
        <Testimonial/>
    </MainLayout>
  )
}

export default lagos