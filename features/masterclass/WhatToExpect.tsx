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
        <Box py="4rem">
          <SectionHeader
            title="Everything you need to know about this Masterclass."
            subTitle="what to expect"
            paragraph="This is a 2 Days Free Masterclass."
          />
        </Box>
      </MainContainer>
      <Basic />
      <Intermediate />
    </Box>
  )
}
