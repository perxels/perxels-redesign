import React from 'react'
import { MainContainer } from '../../layouts'
import { SimpleGrid, Box } from '@chakra-ui/react'
import {EvalInfoContent} from '../../constant'
import {InfoCard} from './InfoCard'
export const Info = () => {
  return (
        <MainContainer>
            <Box
            bgColor="#F7F8F8"
            padding={["2.625rem 5%", "6.75rem 3.875rem"]}
            rounded="1.375rem"
            mt={["3.75rem","4.5625rem"]}
            >
                <SimpleGrid columns={[1, 1, 2, 3]} spacing= "20px">
                    {
                    EvalInfoContent.map((data, index) => (
                        <InfoCard 
                        key={index}
                        icon={data.icon}
                        title={data.title}
                        description={data.description}
                        />
                    ))    
                    }
                </SimpleGrid>
            </Box>
        </MainContainer>
  )
}
