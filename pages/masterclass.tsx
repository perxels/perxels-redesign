import { Box } from '@chakra-ui/react'
import React from 'react'
import { MasterclassHero, WhatToExpect } from '../features/masterclass'
import { Portfolio } from '../features/portfolio'
import { MainLayout } from '../layouts'

const masterclass = () => {
  return (
    <Box maxW="100vw" overflowX="hidden">
      <MainLayout>
          <MasterclassHero />
          <WhatToExpect />
          <Portfolio />
      </MainLayout>
    </Box>
  )
}

export default masterclass