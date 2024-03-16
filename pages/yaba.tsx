import React from 'react'
import {YabaHero, YabaSpace, StudentJob, ClassPlanYaba, OtherPhysCardLayout, MarqueeComp,  OnlinePhysicalCardData} from '../features/physical'
import {LeaningTools, StudentWorkWrapper} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'
const yaba = () => {
  return (
    <MainLayout>
        <YabaHero/>
        <YabaSpace/>
        <MarqueeComp/>
        <ClassPlanYaba/>
        <LeaningTools/>
        <OtherPhysCardLayout cardData={OnlinePhysicalCardData} />
        <StudentWorkWrapper/>
        {/* <StudentJob/> */}
        <Testimonial/>
    </MainLayout>
  )
}

export default yaba