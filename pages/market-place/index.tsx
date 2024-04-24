import React, { Fragment } from 'react'
import { Box } from '@chakra-ui/react'
import { MarketNav } from '../../features/marketplace/MarketNav'
import { MainContainer } from '../../layouts'
import { MarketHero } from '../../features/marketplace'
import { MarketHeroGrid } from '../../features/marketplace/MarketHeroGrid'

const MarketPlace = () => {
  return (
    <Fragment>
      <MarketNav />
      <MainContainer>
        <MarketHero />
        <MarketHeroGrid />
      </MainContainer>
    </Fragment>
  )
}

export default MarketPlace

{
  /* <MainLayout>
        <MainContainer>
          <MarketHero />
          <MarketGridWrapper />
        </MainContainer>
      </MainLayout> */
}
