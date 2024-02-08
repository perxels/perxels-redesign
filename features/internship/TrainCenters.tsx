import React from 'react'
import { Box, Heading, SimpleGrid } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import { TrainCenterCard } from './TrainCenterCard'
const LocationData = [
    {
        location: "Lagos",
        bgImage: "./assets/images/internship/location1.png"
    },
    {
        location: "Ibadan",
        bgImage: "./assets/images/internship/location2.png"
    },
    {
        location: "Abuja",
        bgImage: "./assets/images/internship/location3.png"
    },
]


export const TrainCenters = () => {
  return (
    <MainContainer bg="#FFF">
        <Box>
            <Heading textAlign="center" fontSize={["32px","54px"]}>Our Training Centers</Heading>
            <SimpleGrid columns={[1, 2, 3, 3]} spacing="40px" mt={["32px","50px"]}>
            {
                LocationData.map((location, index) => (
                <TrainCenterCard
                    key={index}
                    bgImage={location.bgImage}
                    location={location.location}
                />
                ))
            }
            </SimpleGrid>
        </Box>
    </MainContainer>
  )
}
