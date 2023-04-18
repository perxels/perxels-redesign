import React from 'react'
import { Box, SimpleGrid, Heading, Center } from '@chakra-ui/react'
import { ProjectCard } from './ProjectCard'
import Slider from 'react-slick'
import { SectionHeader } from '../../components'
import {MotionProjectsContent} from '../../constant'
export const MotionProjects = () => {
  const settings = {
    dots: false,
    infinite: true,
    speed: 500,
    slidesToShow: 3,
    arrows: false,
    slidesToScroll: 1,
    // centerMode: true,
    responsive: [
      {
        breakpoint: 1024,
        settings: {
          slidesToShow: 2,
          slidesToScroll: 1,
          infinite: true,
          dots: false,
        },
      },
    ],
  }
  return (
    <Box py={["5%"]} background="brand.dark.200">
      
      <Center>
        <Box
          as="span"
          py="0.75rem"
          px="0.688rem"
          bg="#FDE85C"
          fontSize={['xs', 'xs', 'xl']}
          fontWeight="bold"
          textTransform="uppercase"
          rounded="10px"
          color="brand.dark.200"
        >
        WHAT TO EXPECT
        </Box>
      </Center>
      <Heading
        color={"brand.white"}
        textAlign="center"
        fontSize={['2rem', '2rem', '7xl']}
        maxW={'auto'}
        m="0 auto"
        mb="1rem"
        mt="1.25rem"
      >
        Similar Projects you would be able to do.
      </Heading>
      <Box pl={["2%","5%"]} mt="2.5rem">
        <Slider {...settings}>
        {
          MotionProjectsContent.map((item, index) => (
            <ProjectCard key={index} imageUrl={item.imageUrl} title={item.title} />
          ))
        }
        
        </Slider>
      </Box>
    </Box>
  )
}
