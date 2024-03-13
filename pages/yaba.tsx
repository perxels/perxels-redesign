import React from 'react'
import {YabaHero, YabaSpace, StudentJob, ClassPlanYaba, OtherPhysCardLayout, MarqueeComp, AbujaPhysicalCardData} from '../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'
const ibadan = () => {
  return (
    <MainLayout>
        <YabaHero/>
        <YabaSpace/>
        <MarqueeComp/>
        <ClassPlanYaba/>
        <LeaningTools/>
        <OtherPhysCardLayout cardData={AbujaPhysicalCardData} />
        <StudentWorkWrapper/>
        {/* <StudentJob/> */}
        <Testimonial/>
    </MainLayout>
  )
}

export default ibadan