import React from 'react'
import { HeroSubSection } from '../features/home'
import { SpeakerHero } from '../features/speakers'
import { MainLayout } from '../layouts'

const speakers = () => {
  return (
    <MainLayout>
        <SpeakerHero />
        <HeroSubSection />
    </MainLayout>
  )
}

export default speakers