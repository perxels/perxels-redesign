import React from 'react'
import {Hero, EventInfo, Speaker, Expectation} from '../features/retreat'
import {MainLayout} from '../layouts' 
const retreat = () => {
  return (
    <MainLayout>
      <Hero/>
      <EventInfo/>
      <Speaker/>
      <Expectation/>
    </MainLayout>
  )
}

export default retreat