import { Box } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { testimonialContent } from '../../constant'
import { MainContainer } from '../../layouts'
import { TestimonialGrid } from '../testimonial'
import { testimonialContent } from '../../constant'
export const Testimonial = () => {
  return (
    <MainContainer>
        <Box my="3.625rem">
            <SectionHeader
                subTitle="Testimonials"
                title="Our Students are getting jobs 100%"
            />
            <TestimonialGrid testimonialContent={testimonialContent} />
        </Box>
    </MainContainer>
  )
}
