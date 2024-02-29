import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero  heroName={"Faith"} name={"faith"} heroImg="/assets/images/designher/heroImage.png"/>
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"faith"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycby1XxVWkDrU7q6WbllNTMLBulQcJUMabybxfWHt2GqJa8AB8xh5a2g4Qa75dzg67f0R/exec" />
        </MainLayout>
    </div>
  )
}

export default designher
