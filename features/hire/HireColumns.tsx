import { Box, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { MainContainer } from '../../layouts'
import HireCard from './HireCard'

export const HireColumns = () => {
  return (
    <Box py="3.75rem">
      <MainContainer>
        <SimpleGrid py="3.75rem" columns={[1, 1, 1, 2]} gap="1.875rem">
          <HireCard
            bgImage="./assets/images/hire/hireCard1.jpg"
            icon="./assets/images/hire/iconCompany.svg"
            title="Hire Perxels"
            description={`
                    Get Perxels to use it’s best talents to handle the development of your 
                    organisation projects and save you management stress.
                    `}
          />
          <HireCard
            bgImage="./assets/images/hire/hireCard2.jpg"
            icon="./assets/images/hire/iconStaff.svg"
            title="Hire a talent."
            description={`
            Employ vetted skilled talents from Perxels ecosystem to join your 
            organisation and help you achieve your goals and objectives.
                    `}
          />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
