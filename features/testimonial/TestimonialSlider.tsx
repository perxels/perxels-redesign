import { Center, HStack, Icon } from '@chakra-ui/react'
import React from 'react'

import { FiArrowLeft, FiArrowRight } from 'react-icons/fi'
import { testimonialSliderContent } from '../../constant'
import {
  setSelectedTestimonial,
  setSelectedTestimonialIndex,
} from '../../state/features/TestimonialSlice'
import { useAppDispatch, useAppSelector } from '../../state/store'
import { TestimonialSliderCard } from './TestimonialSliderCard'

export const TestimonialSlider = () => {
  const dispatch = useAppDispatch()
  const { selectedTestimonial, selectedTestimonialIndex } = useAppSelector(
    (state) => state.testimonial,
  )
      
  return (
    <Center mt="1.875rem">
      <HStack
        justifyContent="space-between"
        w="full"
        maxW="932px"
        h={['auto', 'auto', '171px']}
        spacing="1rem"
      >
        <Center w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor={
              selectedTestimonialIndex === 1
                ? 'brand.gray.10'
                : 'brand.purple.500'
            }
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            as="button"
            disabled={selectedTestimonialIndex === 1}
            onClick={() => {
              dispatch(
                setSelectedTestimonial(
                  testimonialSliderContent[selectedTestimonialIndex - 1],
                ),
              )
              dispatch(
                setSelectedTestimonialIndex(selectedTestimonialIndex - 1),
              )
            }}
          >
            <Icon
              as={FiArrowLeft}
              fontSize="1.5rem"
              color={
                selectedTestimonialIndex === 1
                  ? 'brand.gray.10'
                  : 'brand.purple.500'
              }
            />
          </Center>
        </Center>
        <HStack
          justifyContent="space-between"
          spacing="1.25rem"
          display={['none', 'none', 'none', 'flex']}
          w="100%"
          h="full"
        >
          <TestimonialSliderCard
            title={testimonialSliderContent[selectedTestimonialIndex - 1]?.title}
            name={testimonialSliderContent[selectedTestimonialIndex - 1]?.name}
            imgUrl={
              testimonialSliderContent[selectedTestimonialIndex - 1]?.imgUrl
            }
            id={testimonialSliderContent[selectedTestimonialIndex - 1]?.id}
            smallImgUrl={
              testimonialSliderContent[selectedTestimonialIndex - 1]?.smallImgUrl
            }
          />
          <TestimonialSliderCard
            title={testimonialSliderContent[selectedTestimonialIndex]?.title}
            name={testimonialSliderContent[selectedTestimonialIndex]?.name}
            imgUrl={testimonialSliderContent[selectedTestimonialIndex]?.imgUrl}
            id={testimonialSliderContent[selectedTestimonialIndex]?.id}
            active={true}
            smallImgUrl={
              testimonialSliderContent[selectedTestimonialIndex]?.smallImgUrl
            }
          />
          <TestimonialSliderCard
            title={testimonialSliderContent[selectedTestimonialIndex + 1]?.title}
            name={testimonialSliderContent[selectedTestimonialIndex + 1]?.name}
            imgUrl={
              testimonialSliderContent[selectedTestimonialIndex + 1]?.imgUrl
            }
            id={testimonialSliderContent[selectedTestimonialIndex + 1]?.id}
            smallImgUrl={
              testimonialSliderContent[selectedTestimonialIndex + 1]?.smallImgUrl
            }
            active={
              selectedTestimonialIndex === testimonialSliderContent.length - 1
            }
          />
        </HStack>
        <Center w="3.125rem" h="full">
          <Center
            w="3.125rem"
            h="3.125rem"
            borderWidth="1px"
            borderColor={
              selectedTestimonialIndex + 2 ===
              testimonialSliderContent[testimonialSliderContent.length - 1].id
                ? 'brand.gray.10'
                : 'brand.purple.500'
            }
            rounded="full"
            cursor="pointer"
            transition="all 0.2s ease-in-out"
            as="button"
            disabled={
              selectedTestimonialIndex + 2 ===
              testimonialSliderContent[testimonialSliderContent.length - 1].id
            }
            onClick={() => {
              dispatch(
                setSelectedTestimonial(
                  testimonialSliderContent[selectedTestimonialIndex + 1],
                ),
              )
              dispatch(
                setSelectedTestimonialIndex(selectedTestimonialIndex + 1),
              )
            }}
          >
            <Icon
              as={FiArrowRight}
              fontSize="1.5rem"
              color={
                selectedTestimonialIndex + 2 ===
                testimonialSliderContent[testimonialSliderContent.length - 1].id
                  ? 'brand.gray.10'
                  : 'brand.purple.500'
              }
            />
          </Center>
        </Center>
      </HStack>
    </Center>
  )
}
