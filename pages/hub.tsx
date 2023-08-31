import React from 'react'
import { Hero, NewHero,SpaceType, HubFeats, HubForm, LocateHub } from '../features/hub'
const hub = () => {
  return (
    <div>
        {/* <Hero/> */}
        <NewHero/>
        <SpaceType/>
        <HubFeats/>
        <HubForm/>
        <LocateHub/>
    </div>
  )
}

export default hub