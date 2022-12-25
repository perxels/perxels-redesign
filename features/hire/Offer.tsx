import { Box, Grid, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { hireCardContent } from '../../constant'
import { MainContainer } from '../../layouts'
import OfferCard from './OfferCard'

export const Offer = () => {
  return (
    <Box py="3.75rem">
      <MainContainer>
        <Box py="3.75rem">
          <SectionHeader
            title="Save time, energy, money trying to source skilled talents yourself and hire from the vetted talent pool in our ecosystem"
            subTitle="Why Hire from Perxels"
            maxW='1024px'
            headingSize={['3xl', '3xl', '4xl', '2.5rem']}
            headingColor="brand.dark.200"
          />

          <Grid gridTemplateColumns="repeat(3, 1fr)" overflowX="auto" gap={["0.75rem", "0.75rem", "0.75rem", "1.85rem"]}>
            {
                hireCardContent.map(({
                    title,
                    description,
                    icon,
                    bg,
                    w,
                    r
                }) => (
                    <OfferCard 
                        key={title}
                        title={title}
                        description={description}
                        icon={icon}
                        bg={bg}
                        w={w}
                        r={r}
                    />
                ))
            }
          </Grid>
        </Box>
      </MainContainer>
    </Box>
  )
}
