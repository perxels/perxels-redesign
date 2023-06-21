import { Box, Img } from '@chakra-ui/react'
import React from 'react'
import Marquee from 'react-fast-marquee'
import { MainContainer } from '../../layouts'

interface MarqueeDataProps {
  id: number
  img: string
}

const marqueeData: MarqueeDataProps[] = [
  {
    id: 1,
    img: '/assets/images/international/flag1.svg',
  },
  {
    id: 2,
    img: '/assets/images/international/flag2.svg',
  },
  {
    id: 3,
    img: '/assets/images/international/flag3.svg',
  },
  {
    id: 4,
    img: '/assets/images/international/flag4.svg',
  },
  {
    id: 5,
    img: '/assets/images/international/flag5.svg',
  },
  {
    id: 6,
    img: '/assets/images/international/flag1.svg',
  },
  {
    id: 7,
    img: '/assets/images/international/flag2.svg',
  },
  {
    id: 8,
    img: '/assets/images/international/flag3.svg',
  },
]

export const MarqueeComp = () => {
  return (
    <Box pb="5rem">
      <MainContainer>
        <Marquee gradientWidth={25}>
          {marqueeData.map((item) => (
            <Img key={item.id} src={item.img} alt="flag" h="3.75rem" w="auto" />
          ))}
        </Marquee>
      </MainContainer>
    </Box>
  )
}
