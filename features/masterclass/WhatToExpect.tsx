import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import { Basic } from './Basic'
import { Intermediate } from './Intermediate'

export const WhatToExpect = () => {
  return (
    <Box mb="3rem">
      <MainContainer>
        <Box py="4rem" pb={['1rem', '1rem', '1rem', '4rem']}>
          <SectionHeader
            title="Everything you need to know about this Masterclass."
            subTitle="what to expect"
            paragraph="This is a <b>1 DAY FREE PHYSICAL</b> Masterclass."
            maxW={['300px', '300px', '300px', 'full']}
            headingColor="brand.dark.200"
          />
        </Box>
      </MainContainer>
      <Basic />
      {/* <Intermediate /> */}
    </Box>
  )
}
