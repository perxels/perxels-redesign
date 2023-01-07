import React from 'react'
import { MainLayout } from '../layouts'
import {
  EventCommunity,
  EventHero,
  EventPlayback,
  EventTwitter,
} from '../features/events'
import { PastSpeakers } from '../features/speakers'
const events = () => {
  return (
    <MainLayout>
      <EventHero />
      <EventCommunity />
      <EventPlayback />
      <PastSpeakers />
      <EventTwitter />
    </MainLayout>
  )
}

export default events
