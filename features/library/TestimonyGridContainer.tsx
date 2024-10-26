import React, { useState } from 'react'
import { Box, CircularProgress, Stack } from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContentSecond } from '../../constant'
import { MobileTestimonialSlider } from '../testimonyhero/MobileTestimonialSlider'
import { useFetchTestimonials } from '../../hooks/useTestimonials'
export const TestimonyGridContainer = () => {
  const { testimonials, loading, refetchTestimonials } = useFetchTestimonials()
  return (
    <Box>
      <Box display={['none', 'none', 'none', 'block']}>
        <TestimonyVideo />
        <TestimonialSlider />
      </Box>
      {loading ? (
        <Stack w="full" alignItems="center" justifyContent="center">
          <CircularProgress
            isIndeterminate
            color="#34296B"
            thickness="10px"
            size={30}
          />
        </Stack>
      ) : (
        <>
          <TestimonialGrid
            columns={[1, 2, 2, 2]}
            testimonialContent={testimonials}
            isTestimonial
          />

          <Box display={['block', 'block', 'block', 'none']}>
            <MobileTestimonialSlider />
          </Box>
        </>
      )}
    </Box>
  )
}
