import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Rukayat"}  name={"rukayat"} heroImg="/assets/images/designher/rukayat.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"rukayat"} />
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbxFtWUa3tt9ier0Ik2RzYJ7MSompc1NvuANnVlmWMsun2pkmejiT1LA4LaaI_dpztZv/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher