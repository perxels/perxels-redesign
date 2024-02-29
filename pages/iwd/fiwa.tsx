import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Fiwa"}  name={"fiwa"} heroImg="/assets/images/designher/heroImage.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"fiwa"}/>
        <EventForm sheetUrl='https://script.google.com/macros/s/AKfycbxYSNRrJ1wv1hioFIB7Iuyxg6K_Kos2vgtqCTkKYcQ5xwz5GDkGlxi0O6LaFsjJuSwn/exec'/>
        </MainLayout>
    </div>
  )
}     

export default designher