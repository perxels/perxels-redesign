import React, { useRef, useState } from 'react'
import { Box, Text, Image, Link, Center, Spinner, HStack, theme } from '@chakra-ui/react'
import { useAdvertisements } from '../../hooks/useAdvertisement'
import Slider from 'react-slick'
import { FaAngleLeft, FaAngleRight } from 'react-icons/fa'

export const LibraryAd = () => {
  const { advertisements, loading } = useAdvertisements()
  const [activeIndex, setActiveIndex] = useState(0);
  const sliderRef = useRef<any>();

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 1000,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 3000,
    cssEase: 'linear',
    beforeChange: (_: any, next: number) => setActiveIndex(next),
    responsive: [
      {
        breakpoint: 1460,
        settings: {
          slidesToShow: 1,
          slidesToScroll: 1,
          initialSlide: 1,
        },
      },
    ],
  }

  if (loading) return (
    <Center h={40} w="100%">
      <Spinner size="lg" />
    </Center>
  )

  return (
    <Box my={['82px', '5%']}>
      <Box>
        <Text fontSize={['16px', '18px']} color="#1A1A1A" mb={['24px']}>
          ADVERTISMENT
        </Text>
      </Box>

      <Box pos="relative">
        <Slider ref={sliderRef} {...settings}>
          {advertisements.map(({ link, name, imageUrl, openAnotherTab }) => (
            <Link href={link} key={name} target={openAnotherTab ? "_blank" : "_self"}>
              <Image draggable={false} src={imageUrl} alt={name} width="100%" height="auto" />
            </Link>
          ))}
        </Slider>

        <Center w={10} h={10} bgColor={theme.colors.gray[100]} onClick={() => sliderRef.current.slickPrev()} pos="absolute" cursor="pointer" rounded={8} left={-4} top="50%" transform="translateY(-50%)">
          <FaAngleLeft />
        </Center>
        <Center w={10} h={10} bgColor={theme.colors.gray[100]} onClick={() => sliderRef.current.slickNext()} pos="absolute" cursor="pointer" rounded={8} right={-4} top="50%" transform="translateY(-50%)">
          <FaAngleRight />
        </Center>

        <HStack alignItems="center" justifyContent="center" mt={2}>
          {advertisements?.map((_, i) => (
            <Box key={i} h="8px" rounded="8px" onClick={() => sliderRef.current.slickGoTo(i)} width={activeIndex === i ? "44px" : "10px"} bgColor={activeIndex === i ? "#34296B" : "#D9D9D9"} />
          ))}
        </HStack>

      </Box>
    </Box>
  )
}
