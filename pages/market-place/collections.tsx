import React from 'react'
import { MainContainer } from '../../layouts'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import Slider from 'react-slick'
import MarketCardItem from '../../features/marketplace/MarketCardItem'
import { marketPlaceProducts } from '../../constant'
import { IoMdArrowDropleft } from 'react-icons/io'
import Link from 'next/link'

export const Collections = () => {
  // Remove initialSlide state and reference
  // const [initialSlide, setInitialSlide] = useState(0);

  // const totalSlides = 3 // Total number of slides

  const CustomNextArrow: React.FC = (props) => (
    <Box
      {...props}
      id="custom_collections_arrow"
      right={['10px', '20px', '20px', '20px']}
      width={['40px', '50px']}
      h={['40px', '50px']}
      style={{
        display: 'block',
        // Customize positioning and styling for your next arrow image
        backgroundImage: 'url(/assets/icons/right_collection_arrow.svg)', // Replace with your image path
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )

  const CustomPrevArrow: React.FC = (props) => (
    <Box
      {...props}
      id="custom_collections_arrow"
      left={['10px', '20px', '20px', '20px']}
      width={['40px', '50px']}
      h={['40px', '50px']}
      style={{
        display: 'block',
        // Customize positioning and styling for your prev arrow image
        backgroundImage: 'url(/assets/icons/left_collection_arrow.svg)', // Replace with your image path
        backgroundSize: 'cover',
        zIndex: '1000',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )

  const settings = {
    dots: true,
    arrows: true,
    infinite: true,
    speed: 500,
    slidesToShow: 2.5, // Display 2.5 screens at a time
    slidesToScroll: 2,
    centerPadding: '0px 50px',
    nextArrow: <CustomNextArrow />,
    prevArrow: <CustomPrevArrow />,
    responsive: [
      {
        breakpoint: 768,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1.5,
        },
      },
      {
        breakpoint: 576,
        settings: {
          slidesToShow: 1, // Adjust to display 1.5 slides on smaller screens
          slidesToScroll: 1,
        },
      },
      {
        breakpoint: 500,
        settings: {
          slidesToShow: 1, // Adjust to display 1 slide on smaller screens
          slidesToScroll: 1,
        },
      },
    ],
  }

  return (
    <MainContainer>
      <VStack w="full" overflow="hidden">
        <HStack
          w="full"
          alignItems="center"
          justifyContent="center"
          mt="50px"
          position="relative"
        >
          <Text
            as={Link}
            fontSize={['30px', '40px']}
            display="flex"
            alignItems="center"
            cursor="pointer"
            position="absolute"
            href="/market-place"
            left="0"
          >
            <IoMdArrowDropleft />{' '}
            <Text
              as="span"
              fontSize="18px"
              display={['none', 'none', 'block', 'block']}
            >
              back
            </Text>
          </Text>
          <Text
            as="h1"
            fontSize={['24px', '35px']}
            textAlign="center"
            color="#34296B"
          >
            Our Collections
          </Text>
        </HStack>
        <Box mt="50px" h={['530px', '580px', '580px', '580px']} w="full" >
          <Slider {...settings}>
            {marketPlaceProducts.map((item, i) => (
              <MarketCardItem key={i} item={item} />
            ))}
          </Slider>
        </Box>
      </VStack>
    </MainContainer>
  )
}

export default Collections
