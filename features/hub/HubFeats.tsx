import React from 'react'
import {Box, Heading, Text, Image, SimpleGrid} from '@chakra-ui/react'
import {HubFeatCard} from './HubFeatCard'
import { MainContainer } from '../../layouts'
import {HubFeatsContent} from '../../constant'
export const HubFeats = () => {
  return (
    <Box>
        <MainContainer>
        <SimpleGrid py="81px" columns={[1,1,2,3]} spacing="1.5rem">
            {
                HubFeatsContent.map((data, index) => (
                    <HubFeatCard
                        key={index}
                        icon={data.icon}
                        title={data.title}
                        description={data.description}
                    />
                ))
            }
        </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
