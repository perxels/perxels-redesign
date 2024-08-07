import React from 'react'
import { SimpleGrid, Box } from '@chakra-ui/react'
import { PhysicalCard } from './PhysicalCard'
import { MainContainer } from '../../layouts'
import { SectionHeader } from '../../components'
import { useRouter } from 'next/router'
const PhysicalCardData = [
  {
    bgImage: '/assets/images/class-group/lagosPhysical.png',
    location: 'Lekki, Lagos',
    locationLink: '/lekki',
  },
  {
    bgImage: '/assets/images/class-group/ibadanPhysical.png',
    location: 'Ring Road, Ibadan',
    locationLink: '/ibadan',
  },
  {
    bgImage: '/assets/images/class-group/abujaPhysical.png',
    location: 'Perxels Abuja',
    locationLink: '/abuja',
  },
  {
    bgImage: '/assets/images/class-group/yabaPhysical.png',
    location: 'Yaba',
    locationLink: '/yaba',
  },
]

export const OnlinePhysicalCardData = [
  {
    bgImage: '/assets/images/class-group/lagosPhysical.png',
    location: 'Lekki, Lagos',
    locationLink: '/lekki',
  },
  {
    bgImage: '/assets/images/class-group/ibadanPhysical.png',
    location: 'Ring Road, Ibadan',
    locationLink: '/ibadan',
  },
  {
    bgImage: '/assets/images/class-group/abujaPhysical.png',
    location: 'Perxels Abuja',
    locationLink: '/abuja',
  },
]

export const OtherPhysicalCardData = [
  {
    bgImage: '/assets/images/class-group/ibadanPhysical.png',
    location: 'Ring Road, Ibadan',
    locationLink: '/ibadan',
  },
  {
    bgImage: '/assets/images/class-group/abujaPhysical.png',
    location: 'Perxels Abuja',
    locationLink: '/abuja',
  },
  {
    bgImage: '/assets/images/class-group/internationalPhysical.png',
    location: 'Perxels International',
    locationLink: '/international',
  },
]

export const IbadanPhysicalCardData = [
  {
    bgImage: '/assets/images/class-group/lagosPhysical.png',
    location: 'Lekki, Lagos',
    locationLink: '/lekki',
  },
  {
    bgImage: '/assets/images/class-group/abujaPhysical.png',
    location: 'Perxels Abuja',
    locationLink: '/abuja',
  },
  {
    bgImage: '/assets/images/class-group/internationalPhysical.png',
    location: 'Perxels International',
    locationLink: '/international',
  },
]

export const AbujaPhysicalCardData = [
  {
    bgImage: '/assets/images/class-group/lagosPhysical.png',
    location: 'Lekki, Lagos',
    locationLink: '/lekki',
  },
  {
    bgImage: '/assets/images/class-group/ibadanPhysical.png',
    location: 'Ring Road, Ibadan',
    locationLink: '/ibadan',
  },
  {
    bgImage: '/assets/images/class-group/internationalPhysical.png',
    location: 'Perxels International',
    locationLink: '/international',
  },
]

export const PhysCardLayout = () => {
  const router = useRouter()
  const currentPath = router.pathname
  return (
    <Box>
      <MainContainer>
        <SimpleGrid
          columns={[1, 1, 2, 2]}
          spacing={
            currentPath.includes('/library/courses')
              ? ['2.75rem', '40px']
              : ['2.75rem', '88px']
          }
        >
          {PhysicalCardData.map((data, index) => (
            <PhysicalCard
              key={index}
              bgImage={data.bgImage}
              location={data.location}
              locationLink={data.locationLink}
            />
          ))}
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}

interface PhysCardInterface {
  cardData: any
}

export const OtherPhysCardLayout = ({ cardData }: PhysCardInterface) => {
  return (
    <Box pb="10%">
      <MainContainer>
        <SectionHeader
          subTitle="PHYSICAL SPACES"
          title="Check Our Other Amazing Spaces"
        />
        <SimpleGrid columns={[1, 1, 2, 3]} spacing={['1.2rem', '1.5rem']}>
          {cardData?.map((data: any, index: any) => (
            <PhysicalCard
              key={index}
              bgImage={data?.bgImage}
              location={data?.location}
              locationLink={data?.locationLink}
              heightValue="25.3125rem"
              fontSizeProp="2.1rem"
            />
          ))}
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
