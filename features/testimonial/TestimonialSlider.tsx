import { Box, Center, HStack, Icon } from '@chakra-ui/react'
import React from 'react'

import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { testimonialSliderContent } from '../../constant'
import { TestimonialSliderCard } from './TestimonialSliderCard'

export const TestimonialSlider = () => {
  return (
    <Center mt="1.875rem">
      <HStack justifyContent="space-between" w="full" maxW="932px" h={["auto", "auto", "171px"]} spacing="1rem">
        <Center w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor="brand.purple.500"
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
          >
            <Icon as={FiArrowLeft} fontSize="1.5rem" color="brand.purple.500" />
          </Center>
        </Center>
        <HStack justifyContent="space-between" spacing="1.25rem" display={["none", "none", "none", "flex"]} w="100%" h="full">
          {
            testimonialSliderContent.map(({ title, name, id, imgUrl, smallImgUrl }) => (
              <TestimonialSliderCard 
                key={id}
                title={title}
                name={name}
                imgUrl={imgUrl}
                id={id}
                active={id === 2}
                smallImgUrl={smallImgUrl}
              />
            ))
          }
        </HStack>
        <Center  w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor="brand.purple.500"
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
          >
            <Icon as={FiArrowRight} fontSize="1.5rem" color="brand.purple.500" />
          </Center>
        </Center>
      </HStack>
    </Center>
  )
}
