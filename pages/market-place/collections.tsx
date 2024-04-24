import React from 'react'
import { MainContainer } from '../../layouts'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import Slider from 'react-slick'
import MarketCardItem from '../../features/marketplace/MarketCardItem'
import { marketPlaceProducts } from '../../constant'

export const collections = () => {
  const totalSlides = 6 // Total number of slides
  const initialSlide = Math.max(0, totalSlides - 2.5) // Calculate initial slide index
  const CustomNextArrow: React.FC = (props) => (
    <div
      {...props}
      style={{
        display: 'block',
        background: 'green',
        width: '50px',
        height: '50px',
      }}
    >
      Next
    </div>
  )

  const CustomPrevArrow: React.FC = (props) => (
    <div
      {...props}
      style={{
        display: 'block',
        background: 'blue',
        width: '50px',
        height: '50px',
      }}
    >
      Prev
    </div>
  )

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2.5, // Display 2.5 screens at a time
    slidesToScroll: 1.5,
    // initialSlide: initialSlide,
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1.5, // Adjust to display 1.5 slides on smaller screens
        },
      },
    ],
  }

  return (
    <MainContainer>
      <VStack w="full" overflow="hidden">
        <HStack mt="50px">
          <Text as="h1" fontSize="35px" textAlign="center" color="#34296B">
            Our Collections
          </Text>
        </HStack>
        <Box mt="50px" h="530px" w="full">
          <Slider {...settings}>
            {marketPlaceProducts.map((item, i) => {
              return <MarketCardItem key={i} item={item} />
            })}
          </Slider>
        </Box>
      </VStack>
    </MainContainer>
  )
}

export default collections
