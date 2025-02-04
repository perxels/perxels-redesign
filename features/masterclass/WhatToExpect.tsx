import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import { Basic } from './Basic'
import {
  useFetchMasterClass,
  useFetchMasterclassHero,
} from '../../hooks/useMasterClass'
// import { Intermediate } from './Intermediate'

export const WhatToExpect = () => {
  const { classes } = useFetchMasterClass()
  const { heroData } = useFetchMasterclassHero()

  return (
    <Box mb="3rem">
      <MainContainer>
        <Box py="4rem" pb={['1rem', '1rem', '1rem', '4rem']}>
          <SectionHeader
            title={heroData[0]?.expect_title}
            subTitle="what to expect"
            paragraph={heroData[0]?.expect_desc}
            maxW={['300px', '300px', '300px', 'full']}
            headingColor="brand.dark.200"
          />
        </Box>
      </MainContainer>
      {classes?.map((item, i) => {
        return <Basic {...item} key={i} />
      })}
      {/* <Intermediate /> */}
    </Box>
  )
}
