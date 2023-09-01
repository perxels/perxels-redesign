import React from 'react'
import { Hero, NewHero,SpaceType, HubFeats, HubForm, LocateHub } from '../features/hub'
import { MainLayout } from '../layouts'
const hub = () => {
  return (
    <div>
        {/* <Hero/> */}
        <MainLayout>
        <NewHero/>
        <SpaceType/>
        <HubFeats/>
        <HubForm/>
        <LocateHub/>
        </MainLayout>
    </div>
  )
}

export default hub