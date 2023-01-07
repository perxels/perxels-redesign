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
  const { testimonials } = useAppSelector((state) => state.testimonial)

  return (
    <Center mt="1.875rem">
      <HStack
        justifyContent="space-between"
        w="full"
        maxW="800px"
        h={['auto', 'auto', '171px']}
        spacing="1rem"
      >
        <HStack
          justifyContent="space-between"
          spacing="1.25rem"
          display={['none', 'none', 'none', 'flex']}
          w="100%"
          h="full"
        >
          <TestimonialSliderCard
            title={testimonials[1]?.title}
            name={testimonials[1]?.name}
            imgUrl={testimonials[1]?.imgUrl}
            id={testimonials[1]?.id}
            smallImgUrl={testimonials[1]?.smallImgUrl}
            video={testimonials[1]?.video}
            index={1}
          />
          <TestimonialSliderCard
            title={testimonials[2]?.title}
            name={testimonials[2]?.name}
            imgUrl={testimonials[2]?.imgUrl}
            id={testimonials[2]?.id}
            active={true}
            smallImgUrl={testimonials[2]?.smallImgUrl}
            video={testimonials[2]?.video}
            index={2}
          />
          <TestimonialSliderCard
            title={testimonials[3]?.title}
            name={testimonials[3]?.name}
            imgUrl={testimonials[3]?.imgUrl}
            id={testimonials[3]?.id}
            smallImgUrl={testimonials[3]?.smallImgUrl}
            video={testimonials[3]?.video}
            index={3}
          />
        </HStack>
        {/* <Center w="3.125rem" h="full">
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
        </Center> */}
      </HStack>
    </Center>
  )
}
