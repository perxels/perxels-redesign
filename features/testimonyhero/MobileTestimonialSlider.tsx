import { Box, Button, Center, Heading, Icon, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import Slider from 'react-slick'

import { setSelectedTestimonial } from '../../state/features/TestimonialSlice'

import { testimonialSliderContent } from '../../constant'
import { useAppDispatch, useAppSelector } from '../../state/store'
import { IoIosClose } from 'react-icons/io'

export const MobileTestimonialSlider = () => {
  const dispatch = useAppDispatch()

  const videoRef = React.useRef<HTMLVideoElement>(null)

  const { selectedTestimonial } = useAppSelector((state) => state.testimonial)

  const [isVideoOpen, setIsVideoOpen] = React.useState(false)

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
        {testimonialSliderContent.map(
          ({ id, name, title, imgUrl, smallImgUrl, video, content }) => (
            <Box key={id}>
              <Box
                key={id}
                w="full"
                h={['226px', '226px', '226px']}
                overflow="hidden"
                rounded="10px"
                pos="relative"
                onClick={() => {
                  dispatch(
                    setSelectedTestimonial({
                      id,
                      name,
                      title,
                      imgUrl,
                      smallImgUrl,
                      video,
                    }),
                  )
                  setIsVideoOpen(true)
                  videoRef.current?.play()
                }}
              >
                <Img
                  w="full"
                  h="full"
                  src={smallImgUrl}
                  alt="Testimonial Video"
                  display={['none', 'none', 'block', 'block']}
                />
                <Img
                  w="full"
                  h="full"
                  objectFit={'cover'}
                  src={smallImgUrl}
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
                    maxW="220px"
                  >
                    {content}
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
          ),
        )}
      </Slider>

      {isVideoOpen && (
        <Center
          onClick={() => {
            setIsVideoOpen(false)
            videoRef.current?.pause()
          }}
          px="1rem"
          pos="fixed"
          top="0"
          left="0"
          w="100vw"
          h="100vh"
          bg="rgba(0, 0, 0, .4)"
          zIndex="999"
        >
          <Box pos="relative" w="full" rounded="8px" overflow="hidden">
            <video
              autoPlay={true}
              controls={true}
              ref={videoRef}
              src={selectedTestimonial.video}
            />
          </Box>
          <Button
            onClick={() => {
              setIsVideoOpen(false)
              videoRef.current?.pause()
            }}
            pos="absolute"
            top="13rem"
            right="1rem"
            w="2rem"
            h="2rem"
            px="1.5rem"
            bg="brand.purple.500"
            rounded="8px"
          >
            <Icon as={IoIosClose} fontSize="2rem" color="brand.white" />
          </Button>
        </Center>
      )}
    </Box>
  )
}
