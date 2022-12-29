import React from 'react'
import { EventPlayback } from '../features/events'
import { HeroSubSection } from '../features/home'
import { PastSpeakers, SpeakerHero } from '../features/speakers'
import { MainLayout } from '../layouts'

const speakers = () => {
  return (
    <MainLayout>
        <SpeakerHero />
        <HeroSubSection />
        <PastSpeakers />
        <EventPlayback />
    </MainLayout>
  )
}

export default speakers