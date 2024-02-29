import React from 'react'
import {Hero, MarqueeComp, Info, OutlineSection, EventForm} from '../../features/designher'
import { MainLayout } from '../../layouts'
const designher = () => {
  return (
    <div>
        <MainLayout>
        <Hero heroName={"Mercy"} name="mercy" heroImg="/assets/images/designher/mercy.png" />
        <MarqueeComp/>
        <Info/>
        <OutlineSection name="mercy" />
        <EventForm sheetUrl="https://script.google.com/macros/s/AKfycbw5ScUTz-3CmbCdpylJxtid_Tm42T5NgEBZFzDqKlOh-HWnboIbIk2NQYF6Be_gVluH/exec"/>
        </MainLayout>
    </div>
  )
}

export default designher