import React from 'react'
import { Hero, NewHero,SpaceType, HubFeats, HubForm, LocateHub, HubHeader } from '../features/hub'
import { MainLayout } from '../layouts'
import {Footer} from '../components'
const hub = () => {
  return (
    <div>
        {/* <Hero/> */}
        {/* <MainLayout> */}
        <HubHeader/>
        <NewHero/>
        <SpaceType/>
        <HubFeats/>
        <HubForm/>
        <LocateHub/>
        <Footer yellowFooterPill/>
        {/* </MainLayout> */}
    </div>
  )
}

export default hub