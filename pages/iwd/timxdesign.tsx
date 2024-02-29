import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"TimxDesign"} name={"timxdesign"} heroImg="/assets/images/designher/timX.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"timxdesign"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbz31AdNvyByvkstURy8Uz178uJJHO2kcB1cgEnN4jt1Hcgc19PTDAKgkjzLVAhhk_e4/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher