import React from 'react'
import {Box, SimpleGrid} from '@chakra-ui/react'
import { ProcessCard } from './ProcessCard'
import { MotionProcessContent } from '../../constant'
import { SectionHeader } from '../../components'
export const Process = () => {
  return (
    <Box
    px="5%"
    pt={["60%","60%","60%","30%"]}
    pb="10%"
    // py="6.25rem"
    bg="brand.gray.900"
    >
        <SectionHeader
            title="How will you learn?"
            subTitle="Our Teaching process"
            paragraph='Becoming a motion designer in the 21st Century will make you the best of the best'
            headingColor={"#121212"}

        />
        <SimpleGrid
            columns={{ base: 1, md: 3 }}
            spacing={"40px"}
        >
           {
                MotionProcessContent.map((item, index) => (
                    <ProcessCard key={index} {...item}/>
                )
                )
           }    
        </SimpleGrid>
    </Box>
  )
}
