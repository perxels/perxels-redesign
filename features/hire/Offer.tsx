import { Box, SimpleGrid } from '@chakra-ui/react'
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
            title="We have in 1000+ talents so you can hire without the cost, time and effort"
            subTitle="What we offer"
            maxW='936px'
          />

          <SimpleGrid columns={3} gap="1.85rem">
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
          </SimpleGrid>
        </Box>
      </MainContainer>
    </Box>
  )
}
