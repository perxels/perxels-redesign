import { Box, Button, Center, Img, Text } from '@chakra-ui/react'
import React from 'react'

import Slider from 'react-slick'

import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'

interface SliderDataProps {
  id: number
  img: string
  cat: string
  title: string
}

const sliderData: SliderDataProps[] = [
  {
    id: 1,
    img: './assets/images/teens/alpha.jpg',
    cat: 'UI/UX',
    title: 'Fashion Commerce App',
  },
  {
    id: 2,
    img: './assets/images/teens/coinpro.jpg',
    cat: 'UI/UX',
    title: 'Coinpro - Cryptocurrency App',
  },
  {
    id: 3,
    img: './assets/images/teens/alpha.jpg',
    cat: 'UI/UX',
    title: 'Fashion Commerce App',
  },
  {
    id: 4,
    img: './assets/images/teens/coinpro.jpg',
    cat: 'UI/UX',
    title: 'Coinpro - Cryptocurrency App',
  },
]

export const Expectation = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 3,
  }

  return (
    <Box
      bg="brand.purple.500"
      backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
      py="6.75rem"
    >
      <MainContainer bg="none">
        <SectionHeader
          isWhite
          subTitle="What to expect"
          title="A glimpse into what the teens would be able to do at the end of the training"
        />

        <Slider {...settings}>
          {sliderData.map(({ id, img, cat, title }) => (
            <Box px="1rem" key={id}>
              <Box w="full" p="1.1rem" rounded="1rem" bg="brand.white">
                <Img src={img} alt={title} w="full" h="auto" rounded="1rem" />
                <Text mt="1.5rem" fontSize="xl" color="brand.gray.200">
                  {cat}
                </Text>
                <Text mt="0.5rem" fontSize="2xl" color="brand.dark.100">
                  {title}
                </Text>
              </Box>
            </Box>
          ))}
        </Slider>

        <Center mt="4rem">
          <Button
            px="4rem"
            h="4.5rem"
            bg="brand.white"
            color="brand.purple.500"
            _hover={{ bg: 'brand.yellow.500', color: 'brand.purple.500', roundedBottomRight: "0", roundedTopLeft: "0" }}
          >
            Apply Now
          </Button>
        </Center>
      </MainContainer>
    </Box>
  )
}
