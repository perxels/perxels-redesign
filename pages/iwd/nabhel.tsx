import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Nabhel"} name="nabhel" heroImg="/assets/images/designher/nabhel.png"/>
        <MarqueeComp/>
        <Info/>
        <OutlineSection name="nabhel"/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbyDnRuQLyV6DoiHiSMv11fGz_Hs13zrtuouLlNvugmGyuHMVAWabudMc4CNo3yMuzOvzQ/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher