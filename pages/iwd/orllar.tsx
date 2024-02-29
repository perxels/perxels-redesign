import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Orllar"}  name={"orllar"}  heroImg="/assets/images/designher/ollar.png"/>
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"orllar"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbz0Z3vj9X804nbjp93ExIHP6vXwPyhKSRjuW5E6ZRpswvO6fc2zegSzbaDMUHR-5-169Q/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher