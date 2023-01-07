import { Box, Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { portfolioContent } from '../../constant/portfolioContent'
import { MainContainer } from '../../layouts'
import { PortfolioCard } from './PortfolioCard'

export const Portfolio = () => {
  return (
    <MainContainer>
      <SectionHeader
        subTitle="Our Portfolio"
        title="Meet some of our Alumni"
        paragraph="We are proud to see our students getting design jobs, impacting product teams with their skills and being paid well for their value."
        maxW={['240px', 'full']}
      />

      <SimpleGrid
        mb={['3.75rem', '3.75rem', '6.25rem']}
        columns={[2, 2, 2, 4]}
        spacing={['0.5rem', '0.5rem', '0']}
      >
        {portfolioContent.map(({ id, title, name, image }) => (
          <PortfolioCard
            key={id}
            title={title}
            name={name}
            image={image}
            id={id}
          />
        ))}
      </SimpleGrid>
    </MainContainer>
  )
}
