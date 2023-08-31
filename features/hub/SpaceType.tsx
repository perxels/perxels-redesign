import React from 'react'
import {Box, Flex, Heading, Text, Spacer, Button, SimpleGrid} from '@chakra-ui/react'
import {SectionHeader} from '../../components'
import {MainContainer} from '../../layouts'
import {SpaceCard} from './SpaceCard'

const SpaceTypeData = [
    {
        bgImage: "/assets/images/hub/spaceType1.png",
        spaceTypeName: "Work Station",
        spaceTypeIcon: "/assets/images/hub/spaceTypeIcon1.svg",
        spaceTypeDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        spaceTypePrice: "₦1,500",
        link: "/", 
    },
    {
        bgImage: "/assets/images/hub/spaceType2.png",
        spaceTypeName: "Boardroom",
        spaceTypeIcon: "/assets/images/hub/spaceTypeIcon2.svg",
        spaceTypeDescription: "Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor.",
        spaceTypePrice: "₦10,000",
        link: "/", 
    }
]

export const SpaceType = () => {
  return (
    <Box>
        <MainContainer>
            <Box px="5%" >
            <SectionHeader
                subTitle="Type of space we offer"
                title="Flexible Solutions for You - Choose What Works Best for You."
            />
            </Box>
            <SimpleGrid columns={[1, 1, 2, 2]} spacing="1.875rem" px="0" py="2rem">
                {
                    SpaceTypeData.map((data, index) => (
                        <SpaceCard
                            key={index}
                            bgImage={data.bgImage}
                            spaceTypeName={data.spaceTypeName}
                            spaceTypeIcon={data.spaceTypeIcon}
                            spaceTypeDescription={data.spaceTypeDescription}
                            spaceTypePrice={data.spaceTypePrice}
                            link={data.link}
                        />
                    ))
                }
            </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
