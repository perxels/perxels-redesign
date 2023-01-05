import { Box, Center, Flex, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import Slider from 'react-slick'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'

interface SliderDataProps {
  id: number
  img: string
  name: string
  title: string
}

const sliderData: SliderDataProps[] = [
  {
    id: 1,
    img: '/assets/images/speakers/speaker1.jpg',
    name: 'Nandi Manning',
    title: 'Senior XDR @ Intuit Mailchimp',
  },
  {
    id: 2,
    img: '/assets/images/speakers/speaker2.jpg',
    name: 'Chidinma Ukaegbu',
    title: 'Product Designer @ MyCover.ai',
  },
  {
    id: 3,
    img: '/assets/images/speakers/speaker3.jpg',
    name: 'Bryan Benibo',
    title: 'Saas Marketing Designer',
  },
  {
    id: 4,
    img: '/assets/images/speakers/speaker4.jpg',
    name: 'Jadesola Odujole',
    title: 'Content Designer @ chippercash',
  },
  {
    id: 5,
    img: '/assets/images/speakers/speaker5.jpg',
    name: 'James Baduor',
    title: 'Cofounder ADPList',
  },
  {
    id: 6,
    img: '/assets/images/speakers/speaker6.jpg',
    name: 'Ayomide Mobolaji',
    title: 'Product Designer KUUMBA',
  },
  {
    id: 7,
    img: '/assets/images/speakers/speaker7.jpg',
    name: 'Sebiomo',
    title: 'Head of Design @ VoyanceHQ',
  },
  {
    id: 8,
    img: '/assets/images/speakers/speaker8.jpg',
    name: 'Abiodun-Fiwa',
    title: 'CEO, Perxels',
  },
]

export const PastSpeakers = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 4,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    responsive: [
      {
        breakpoint: 1460,
        settings: {
          slidesToShow: 4,
          slidesToScroll: 4,
          initialSlide: 4,
        },
      },
      {
        breakpoint: 900,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 2,
          initialSlide: 2,
        },
      },
      {
        breakpoint: 600,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
        },
      },
    ],
  }
  
  return (
    <Box pb="4rem" pt="3rem" bg="brand.gray.300">
      <MainContainer bg="none">
        <SectionHeader
          subTitle="Past Speakers"
          title="Meet the experts that have come to share their knowledge."
        />
      </MainContainer>

      <Box pos="relative" overflow="hidden">
        <Slider {...settings}>
          {sliderData.map(({ id, img, name, title }) => (
            <Box px="0.75rem" key={id} overflowX="hidden">
              <Img rounded="5px" src={img} alt={name} w="full" h="auto" />

              <Flex gap="0.5rem" mt="1rem" alignItems="center">
                <Heading fontSize="sm" color="brand.dark.200">{name}</Heading>
                <Text fontSize="sm" color="brand.dark.200">|</Text>
                <Text fontSize="sm" color="brand.dark.200">{title}</Text>
              </Flex>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}
