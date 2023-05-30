import React from 'react'
import {Box, Text, Heading, Image, SimpleGrid, Flex} from '@chakra-ui/react'
import {WinnerContent} from '../../constant'
import {MainContainer} from '../../layouts'
import Slider from 'react-slick'

export const Winners = () => {

    const settings = {
        dots: true,
        arrows: true,
        infinite: true,
        rows: 9,
        slidesPerRow: 1,
        autoPlay: true,
        autoplaySpeed: 3000,
        cssEase: 'linear',
    }


  return (
    <MainContainer bg="#FFFFFFF">
        <Box
        py="6.625rem"
        id="winners"
        >
    <Flex
    bg="#34296B"
    borderRadius="1.25rem 1.25rem 0px 0px"
    alignItems="center"
    columnGap={["0.5rem","1.375rem"]}
    display={["flex","inline-flex"]}
    p="2rem 2rem"
    >
        <Heading
        color="#FFFFFF"
        fontWeight="700"
        fontSize={["1.2rem","2.5rem"]}
        textTransform="uppercase"
        >
        Top 50 Designers
        </Heading>
        <Image src="/assets/icons/medalWin.svg" alt="" boxSize={["40px","80px"]} />
    </Flex>
    <Box
    bg="rgba(202, 202, 202, 0.1)"
    px="2.5rem"
    py="3.125rem"
    >
        <Box display={["none", "none", "block", "block"]}>
      <SimpleGrid columns={[1,1,2,3]} spacing="2.3125rem">
      {
            WinnerContent.map((winner, index) => (
                <Box key={index} bg="#FFFFFF" display="flex" flexDir={"column"} alignItems="center" rowGap={["1rem","1.5rem"]} p="20px" rounded="1.25rem">
                    <Text
                    fontSize="1.25rem"
                    fontWeight="700"
                    textTransform="uppercase"
                    textAlign="center"
                    >
                        {winner}
                    </Text>
                </Box>
            ))
        }
    </SimpleGrid>
    </Box>
    <Box display={["block", "block", "none", "none"]}>
    <Slider {...settings}>
    {
            WinnerContent.map((winner, index) => (
                <Box key={index} bg="#FFFFFF" display="flex" flexDir={"column"} alignItems="center" rowGap={["1rem","1.5rem"]} p="20px" rounded="1.25rem" mb="2.3rem" border=" 0.925414px solid #D2D2D2">
                    <Text
                    fontSize="1.125rem"
                    fontWeight="700"
                    textTransform="uppercase"
                    textAlign="center"
                    >
                        {winner}
                    </Text>
                </Box>
            ))
        }
    </Slider>
    </Box>
    </Box>
    </Box>
    </MainContainer>
  )
}
