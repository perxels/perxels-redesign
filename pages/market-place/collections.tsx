import React from 'react'
import { MainContainer } from '../../layouts'
import { Box, HStack, Text, VStack } from '@chakra-ui/react'
import Slider from 'react-slick'
import MarketCardItem from '../../features/marketplace/MarketCardItem'
import { marketPlaceProducts } from '../../constant'

export const Collections = () => {
  // Remove initialSlide state and reference
  // const [initialSlide, setInitialSlide] = useState(0);

  // const totalSlides = 3 // Total number of slides

  const CustomNextArrow: React.FC = (props) => (
    <div
      {...props}
      id="custom_collections_arrow"
      style={{
        display: 'block',
        width: '50px',
        height: '50px',
        right: '20px',
        // Customize positioning and styling for your next arrow image
        backgroundImage: 'url(/assets/icons/right_collection_arrow.svg)', // Replace with your image path
        backgroundSize: 'contain',
        backgroundRepeat: 'no-repeat',
      }}
    />
  )

  const CustomPrevArrow: React.FC = (props) => (
    <div
      {...props}
      id="custom_collections_arrow"
      style={{
        display: 'block',
        width: '50px',
        height: '50px',
        // Customize positioning and styling for your prev arrow image
        backgroundImage: 'url(/assets/icons/left_collection_arrow.svg)', // Replace with your image path
        backgroundSize: 'cover',
        left: '20px',
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
    slidesToScroll: 1.5,
    // Remove initialSlide prop since it's not used anymore
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
        <HStack mt="50px">
          <Text
            as="h1"
            fontSize={['24px', '35px']}
            textAlign="center"
            color="#34296B"
          >
            Our Collections
          </Text>
        </HStack>
        <Box mt="50px" h="580px" w="full">
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
