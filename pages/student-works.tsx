import { Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { StudentWorksData } from '../constant/studentWorks'
import { Hero, StudentWorksWrapper } from '../features/studentWork'
import { MainLayout } from '../layouts'

const StudentWorks = () => {
  return (
    <MainLayout isDark={true}>
        <Hero />
        <StudentWorksWrapper />
    </MainLayout>
  )
}

export default StudentWorks