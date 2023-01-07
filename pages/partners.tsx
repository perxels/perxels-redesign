import React from 'react'
import { Funding, OurWhy, PartnersHero } from '../features/partners'
import { OurGoal } from '../features/partners/OurGoal'
import { Portfolio } from '../features/portfolio'
import { MainLayout } from '../layouts'

const partners = () => {
  return (
    <MainLayout>
      <PartnersHero />
      <OurWhy />
      <Funding />
      <OurGoal />
      <Portfolio />
    </MainLayout>
  )
}

export default partners
