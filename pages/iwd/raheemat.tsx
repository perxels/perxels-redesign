import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Raheemat"} name={"raheemat"} heroImg="/assets/images/designher/raheemat.png"/>
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"raheemat"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbzg6IsF9lX-lgPL2AVnU_gg6bZg1o4asQPANCn6xF5FGfU4XlsNnokZePMY-8RgDa-mMg/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher