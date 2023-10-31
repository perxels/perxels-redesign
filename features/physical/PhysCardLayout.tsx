import React from 'react'
import {SimpleGrid, Box} from '@chakra-ui/react'
import {PhysicalCard} from './PhysicalCard'
import { MainContainer } from '../../layouts'
import {SectionHeader} from '../../components'
const PhysicalCardData=[
    {
        bgImage: "/assets/images/class-group/lagosPhysical.png",
        location: "Lekki, Lagos",
        locationLink: "/physical/lagos"
    },
    {
        bgImage: "/assets/images/class-group/ibadanPhysical.png",
        location: "Ring Road, Ibadan",
        locationLink: "/physical/ibadan"
    },
    {
        bgImage: "/assets/images/class-group/abujaPhysical.png",
        location: "Perxels Abuja",
        locationLink: "/physical/perxels-abuja",
        isComing: true
    },
    {
        bgImage: "/assets/images/class-group/internationalPhysical.png",
        location: "Perxels International",
        locationLink: "/international"
    }
]
const OtherPhysicalCardData=[
  
    {
        bgImage: "/assets/images/class-group/ibadanPhysical.png",
        location: "Ring Road, Ibadan",
        locationLink: "/physical/ibadan"
    },
    {
        bgImage: "/assets/images/class-group/abujaPhysical.png",
        location: "Perxels Abuja",
        locationLink: "/physical/perxels-abuja",
        isComing: true
    },
    {
        bgImage: "/assets/images/class-group/internationalPhysical.png",
        location: "Perxels International",
        locationLink: "/international"
    }
]

export const PhysCardLayout = () => {
  return (
    <Box>
        <MainContainer>
       
        <SimpleGrid columns={[1, 1, 2, 2]} spacing={["2.75rem","88px"]}>
        {
            PhysicalCardData.map((data, index) => (
                <PhysicalCard
                key={index}
                bgImage={data.bgImage}
                location={data.location}
                locationLink={data.locationLink}
                isComing={data?.isComing}
                />
            ))
        }
        </SimpleGrid>
        </MainContainer>
    </Box>
  )
}

export const OtherPhysCardLayout = () => {
    return (
      <Box pb="10%">
          <MainContainer>
          <SectionHeader
        subTitle="PHYSICAL SPACES"
        title="Check Our Other Amazing Spaces"
        />  
          <SimpleGrid columns={[1, 1, 2, 3]} spacing={["1.2rem","1.5rem"]}>
          {
              OtherPhysicalCardData.map((data, index) => (
                  <PhysicalCard
                  key={index}
                  bgImage={data.bgImage}
                  location={data.location}
                  locationLink={data.locationLink}
                  heightValue="25.3125rem"
                  fontSizeProp="2.1rem"
                  isComing={data?.isComing}
                  />
              ))
          }
          </SimpleGrid>
          </MainContainer>
      </Box>
    )
  }