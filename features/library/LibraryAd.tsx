import React from 'react'
import { Box, Text, Image, Link, Center, Spinner } from '@chakra-ui/react'
import { useAdvertisements } from '../../hooks/useAdvertisement'
import Slider from 'react-slick'

export const LibraryAd = () => {
  const { advertisements, loading } = useAdvertisements()

  const settings = {
    dots: false,
    arrows: false,
    infinite: true,
    speed: 500,
    slidesToShow: 1,
    slidesToScroll: 1,
    autoplay: true,
    autoplaySpeed: 2000,
    cssEase: 'linear',
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

      <Box pos="relative" overflow="hidden">
        <Slider {...settings}>
          {advertisements.map(({ link, name, imageUrl, openAnotherTab }) => (
            <Link href={link} key={name} target={openAnotherTab ? "_blank" : "_self"}>
              <Image draggable={false} src={imageUrl} alt={name} width="100%" height="auto" />
            </Link>
          ))}
        </Slider>
      </Box>
      {/* <Box
        background="url('./assets/images/library/libraryAd.png') no-repeat center center"
        height={["262px","345px"]}
        backgroundSize="cover"
        padding={["0 5%","0 5%"]}
        borderRadius={"8px"}
      >
        <Flex 
        h="100%"  
        flexDir="column" 
        justifyContent="center"
       
        >
          <Heading 
          as="h1" 
          fontSize={["22px","32px" ]}
          color="#FFF" 
          textAlign="left"
          fontWeight={700}
          lineHeight="102.3%"
          width={["100%","60%"]}
          >
            Embark on a Learning Journey with Our Premium Courses!
          </Heading>
          <Text
          fontSize={["12px","16px"]}
          fontWeight={"400"}
          color="#FFF"
          lineHeight={"138%"}
          width={["100%","70%"]}
          >
            Ready to take your knowledge to new heights? Unleash your potential
            with our premium paid courses designed to empower and transform.
          </Text>
          <Button width={["50%","30%"]} height={["46px", "64px"]} color="#34296B" background="#FDE85C" size="lg" mt="24px"
          rightIcon={<BiChevronRightCircle size="24px" color="#34296B" />}
          >
          Enroll now
        </Button>
        </Flex>
      </Box> */}
    </Box>
  )
}
