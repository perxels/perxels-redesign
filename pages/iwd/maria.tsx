import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Mary"}  name={"maria"} heroImg="/assets/images/designher/mary.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"maria"}/>
        <EventForm sheetUrl={"https://script.google.com/macros/s/AKfycbwdDl2ZsteZK9C1pset3-kLht5XAedwNy5MmAqFfJvMSDxxE4niDihXkQf7T1j1wZqd9g/exec"}/>
        </MainLayout>
    </div>
  )
}

export default designher