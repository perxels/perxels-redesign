import React from 'react'
import { Box, Image, Heading, Text, VStack } from '@chakra-ui/react'
import { SectionHeader } from '../../components'
import { MotionPlan } from '../../constant'
import {MotionClassCard} from './MotionClassCard'
export const MotionClassPlan = () => {
  return (
    <Box
    px="5%"
    bg="brand.gray.900"
    >
        <SectionHeader
            title=""
            subTitle="Class Plan"
            paragraph='We offer an Affordable class plan for either Physical or Virtual learning.'
        />
        <Box>
        <VStack>
            {
                MotionPlan.map((item, index) => (
                    <MotionClassCard key={index} {...item}/>
                ))
            }
        </VStack>      
        </Box>
    </Box>
  )
}
