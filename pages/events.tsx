import React from 'react'
import { MainLayout } from '../layouts'
import { EventCommunity, EventHero, EventPlayback, EventTwitter } from '../features/events/'
const events = () => {
  return (
    <MainLayout>
      <EventHero />
      <EventCommunity/>
      <EventPlayback/>
      <EventTwitter/>
    </MainLayout>
  )
}

export default events
