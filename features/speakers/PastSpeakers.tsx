import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
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
    img: '/assets/images/speakers/sebiomo.png',
    name: 'Sebiomo Anuoluwapo',
    title: 'Design Lead, Voyance',
  },
  {
    id: 2,
    img: '/assets/images/speakers/donye.png',
    name: 'Donye Collins',
    title: 'Design Manager',
  },
  {
    id: 3,
    img: '/assets/images/speakers/bryan.png',
    name: 'Bryan Benibo',
    title:
      'Product Designer and Instructor, TechCreek | Saas Marketing Designer ',
  },
  {
    id: 4,
    img: '/assets/images/speakers/felix.png',
    name: 'Felix Ayoola',
    title: 'Design and Art Director',
  },
  {
    id: 5,
    img: '/assets/images/speakers/abbas.png',
    name: 'Abbas Rianat',
    title: 'Product Designer, Plaqad',
  },
  {
    id: 6,
    img: '/assets/images/speakers/nike.png',
    name: 'Nike Adesanoye',
    title: 'Product Designer',
  },
  {
    id: 7,
    img: '/assets/images/speakers/chidinma.png',
    name: 'Chidinma Ukaegbu',
    title: 'Product Designer',
  },
  {
    id: 8,
    img: '/assets/images/speakers/debbie.png',
    name: 'Deborah Dada',
    title: 'Product Designer, Grupp',
  },
]

export const PastSpeakers = () => {
  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    responsive: [
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
    <Box>
      <MainContainer>
        <SectionHeader
          subTitle="Past Speakers"
          title="Meet the experts that have come to share their knowledge."
        />
      </MainContainer>

      <Box pos="relative" overflow="hidden">
        <Box
          pos="absolute"
          w="full"
          top={['-8rem', '-8rem', '-8rem', '-6rem']}
          left="0"
          h="150px"
          bg="brand.white"
          zIndex="1"
          roundedBottomRight={['25%', '25%', '25%', '25%']}
          roundedBottomLeft={['25%', '25%', '25%', '25%']}
        />
        <Box
          pos="absolute"
          w="full"
          bottom={['-8rem', '-8rem', '-8rem', '-8rem']}
          left="0"
          h="150px"
          bg="brand.white"
          zIndex="1"
          roundedTopRight={['25%', '25%', '25%', '25%']}
          roundedTopLeft={['25%', '25%', '25%', '25%']}
        />
        <Slider {...settings}>
          {sliderData.map(({ id, img, name, title }) => (
            <Box key={id} pos="relative" px="1rem">
              <Box overflowX="hidden">
                <Img src={img} alt={name} w="full" h="auto" />

                <Center pos="absolute" w="full" bottom={["0.5rem", "0.5rem", "0.5rem", "0"]}>
                  <Center
                    justifyContent="flex-start"
                    flexDir="column"
                    py={['1rem', '1rem', '1rem', '2rem']}
                    bg="brand.yellow.500"
                    pos="absolute"
                    h="14rem"
                    rounded={['20%', '20%', '20%', '50%']}
                    left="46.7%"
                    transform="translateX(-50%)"
                    w="95%"
                  >
                    <Heading fontSize="4xl" textAlign="center">
                      {name}
                    </Heading>
                    <Text maxW="352px" px="1rem" textAlign="center">
                      {title}
                    </Text>
                  </Center>
                </Center>
              </Box>
            </Box>
          ))}
        </Slider>
      </Box>
    </Box>
  )
}
