import { Box, Center, Heading, Icon, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import Slider from 'react-slick'

import { testimonialSliderContent } from '../../constant'

export const MobileTestimonialSlider = () => {
  const settings = {
    dots: true,
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
    <Box>
      <Slider {...settings}>
        {testimonialSliderContent.map(({ id, name, title, imgUrl }) => (
          <Box key={id}>
            <Box
                key={id}
                w="full"
                h={['226px', '226px', '226px']}
                overflow="hidden"
                rounded="10px"
                pos="relative"
            >
                <Img
                w="full"
                h="full"
                src={imgUrl}
                alt="Testimonial Video"
                display={['none', 'none', 'block', 'block']}
                />
                <Img
                w="full"
                h="full"
                objectFit={'cover'}
                src={imgUrl}
                alt="Testimonial Video"
                display={['block', 'block', 'none', 'none']}
                />

                <Center
                w="full"
                h="full"
                bg="brand.overlay.100"
                pos="absolute"
                top="0"
                left="0"
                cursor="pointer"
                flexDir="column"
                >
                <Center
                    w={['3.5rem', '4.375rem', '6.25rem']}
                    h={['3.5rem', '4.375rem', '6.25rem']}
                    bg="brand.yellow.300"
                    rounded="full"
                >
                    <Icon as={BsFillPlayFill} fontSize={['2rem', '3rem']} />
                </Center>

                <Heading
                    px={['0.5rem', '0']}
                    fontSize={['md', 'xl', '3xl']}
                    textAlign="center"
                    color="brand.white"
                    mt="1rem"
                >
                    “I landed a job as a product designer with a company in the US.”
                </Heading>

                <Heading
                    fontSize={['xl', '3xl', '4xl']}
                    textAlign="center"
                    color="brand.white"
                    mt="1rem"
                >
                    - {name}
                </Heading>

                <Text
                    fontSize={['sm', 'xl', '3xl']}
                    color="brand.white"
                    mt="1rem"
                >
                    {title}
                </Text>
                </Center>
            </Box>
          </Box>
        ))}
      </Slider>
    </Box>
  )
}
