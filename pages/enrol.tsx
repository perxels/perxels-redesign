import React from 'react'
import {Box} from '@chakra-ui/react'
import { MainLayout } from '../layouts'
import { OurClassGroup } from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
const enrol = () => {
  return (
   <MainLayout>
        <Box py={["0rem", "3%"]} />
        <OurClassGroup/>
        <Testimonial />
   </MainLayout>
  )
}

export default enrol