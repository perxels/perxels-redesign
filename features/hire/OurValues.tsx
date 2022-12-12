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

        <SimpleGrid columns={[1, 1, 1, 3]} gap={["0.75rem", "0.75rem", "1.25rem"]}>
          <Values
            icon="./assets/images/hire/like.svg"
            title="Pixels Perfection"
            description={`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            At adipiscing proin facilisis nulla ut suspendisse sit tempor.
            `}
          />
          <Values
            icon="./assets/images/hire/lightning.svg"
            title="Pixels Perfection"
            description={`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            At adipiscing proin facilisis nulla ut suspendisse sit tempor.
            `}
          />
          <Values
            icon="./assets/images/hire/bulb.svg"
            title="Pixels Perfection"
            description={`
            Lorem ipsum dolor sit amet, consectetur adipiscing elit. 
            At adipiscing proin facilisis nulla ut suspendisse sit tempor.
            `}
          />
        </SimpleGrid>
      </Box>
    </MainContainer>
  )
}
