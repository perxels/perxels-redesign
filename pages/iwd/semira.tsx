import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Semira"}  name={"semira"} heroImg="/assets/images/designher/heroImg.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"semira"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbzSlBQPsgNb1wtXUjkhVQVVJoxf7x4J41WdSP0pTI4HdHsOlxgfUo6ZgUo_UN3l5A9K/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher