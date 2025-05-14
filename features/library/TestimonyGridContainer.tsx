import React, { useMemo, useState } from 'react'
import { Box, CircularProgress, Stack } from '@chakra-ui/react'
import { TestimonialGrid } from '../testimonial'
import { TestimonyVideo } from '../testimonial/TestimonyVideo'
import { TestimonialSlider } from '../testimonial/TestimonialSlider'
import { SectionHeader } from '../../components'
import { testimonialContentSecond } from '../../constant'
import { MobileTestimonialSlider } from '../testimonyhero/MobileTestimonialSlider'
import { useFetchTestimonials } from '../../hooks/useTestimonials'
import { Testimonial } from '../../utils/types'
export const TestimonyGridContainer = () => {
  const { testimonials, loading, refetchTestimonials } = useFetchTestimonials()
  
  const sortedByOrder = useMemo(() => {
    // Create a copy of the videos array to avoid mutating the original
    return [...testimonials].sort((a: Testimonial, b: Testimonial) => {
      // If both videos have order, sort by order
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      // If only one has order, put the one with order first
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      // If neither has order, maintain original order
      return 0
    })
  }, [testimonials])
  
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
            testimonialContent={sortedByOrder}
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
