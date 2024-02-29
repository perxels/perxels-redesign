import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Bolutife"} name={"bolutife"} heroImg={"/assets/images/designher/bolutife.png"} />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"bolutife"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbybtjEHT4JubU05uRMRjOIk5rjkYOkg2s0dRt3RQe8UFOvjpm8l_VB6de3r3M7H8j3j5Q/exec" />
        </MainLayout>
    </div>
  )
}

export default designher