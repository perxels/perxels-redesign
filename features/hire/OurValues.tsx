import { Box, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'
import Values from './Values'

export const OurValues = () => {
  return (
    <MainContainer bg="brand.gray.300">
      <Box py="3.125rem">
        <SectionHeader
          title="Core Values we always live by."
          subTitle="Our values"
        />

        <SimpleGrid
          columns={[1, 1, 1, 3]}
          gap={['0.75rem', '0.75rem', '1.25rem']}
        >
          <Values
            icon="./assets/images/hire/like.svg"
            title="Problem solving"
            description={`
            Solving problems with design is at the heart of everything we 
            do - we equip designers with the skills to solve problems with design.
            `}
          />
          <Values
            icon="./assets/images/hire/lightning.svg"
            title="Detail Oriented"
            description={`
            Attention to details is one of our priorities - 
            the biggest advantage a product has are in its smallest details and we focus on these details.
            `}
          />
          <Values
            icon="./assets/images/hire/bulb.svg"
            title="Impact driven"
            description={`
            Making positive impact is what drives us and 
            we are passionate and committed to making significant impact with every project.
            `}
          />
        </SimpleGrid>
      </Box>
    </MainContainer>
  )
}
