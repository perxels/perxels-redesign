import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Desewa"}  name={"desewa"} heroImg="/assets/images/designher/desewa.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection  name={"desewa"}/>
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbxYgA0ixPHtUW3GN308Dv0K2b3W7sxIWw5gL3DjAsKwQN_L156nGjSpsIKBcFC5oQ/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher