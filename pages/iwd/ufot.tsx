import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Ufot"}  name={"ufot"} heroImg="/assets/images/designher/ufot.png"/>
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"ufot"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbxas9DxQ895JkUDBJgsNQc5SLFYyLrOKsCY7yEYQfsDO13XZhTyc92x0EpaUx431cX1/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher