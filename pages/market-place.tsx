import React from 'react'
import { MarketGridWrapper, MarketHero } from '../features/marketplace'
import { MainContainer, MainLayout } from '../layouts'

const MarketPlace = () => {
  return (
    <MainLayout>
        <MainContainer>
            <MarketHero />
            <MarketGridWrapper />
        </MainContainer>
    </MainLayout>
  )
}

export default MarketPlace