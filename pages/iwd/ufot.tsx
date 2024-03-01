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
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbygZkQVPyJtnqdyUNpe83Bt8ToDLAZYlUyQWGi_2qO-nK68kh4OnEmPDgHO54qrZGT9/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher