import React from 'react'
import {IbadanHero, IbadanSpace, StudentJob, ClassPlanIb, OtherPhysCardLayout, MarqueeComp} from '../../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../../features/classGroup'
import { Testimonial } from '../../features/testimonial'
import { MainLayout } from '../../layouts'
const ibadan = () => {
  return (
    <MainLayout>
        <IbadanHero/>
        <IbadanSpace/>
        <MarqueeComp/>
        <ClassPlanIb/>
        <LeaningTools/>
        <OtherPhysCardLayout/>
        <StudentWorkWrapper/>
        {/* <StudentJob/> */}
        <Testimonial/>
    </MainLayout>
  )
}

export default ibadan