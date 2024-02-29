import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Tomiwa"}  name={"tomiwa"} heroImg="/assets/images/designher/tomiwa.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"tomiwa"} />
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbyDqH8xAoelIHgHKHuekENBXTCxiv89k9i0D6FL9JmEOkNY-rPvTCZHUwA_hKvLHDy2/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher