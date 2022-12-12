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
                    title="Hire as a Company"
                    description={`
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. At
                        adipiscing proin facilisis nulla ut suspendisse sit tempor.
                    `}
                />
                <HireCard 
                    bgImage="./assets/images/hire/hireCard2.jpg"
                    icon="./assets/images/hire/iconStaff.svg"
                    title="Hire a Staff"
                    description={`
                        Lorem ipsum dolor sit amet, consectetur adipiscing elit. At
                        adipiscing proin facilisis nulla ut suspendisse sit tempor.
                    `}
                />
            </SimpleGrid>
        </MainContainer>
    </Box>
  )
}