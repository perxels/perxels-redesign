import React from 'react'
import {AbujaHero, AbujaSpace, StudentJob, ClassPlanAbj, OtherPhysCardLayout, MarqueeComp, AbujaPhysicalCardData} from '../../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../../features/classGroup'
import { Testimonial } from '../../features/testimonial'
import { MainLayout } from '../../layouts'
const ibadan = () => {
  return (
    <MainLayout>
        <AbujaHero/>
        <AbujaSpace/>
        <MarqueeComp/>
        <ClassPlanAbj/>
        <LeaningTools/>
        <OtherPhysCardLayout cardData={AbujaPhysicalCardData} />
        <StudentWorkWrapper/>
        {/* <StudentJob/> */}
        <Testimonial/>
    </MainLayout>
  )
}

export default ibadan