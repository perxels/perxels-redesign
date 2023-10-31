import React from 'react'
import {Box} from '@chakra-ui/react'
import {Hero, PhysCardLayout} from "../features/physical"
import {LeaningTools, StudentWorkWrapper} from '../features/classGroup'
import { Testimonial } from '../features/testimonial'
import { MainLayout } from '../layouts'
const physicalspace = () => {
  return (
    <MainLayout>
        <Hero/>
        <PhysCardLayout/>
        <LeaningTools/>
        <StudentWorkWrapper/>
        <Box py={["3rem", "0"]} />
        <Testimonial/>
    </MainLayout>
  )
}

export default physicalspace