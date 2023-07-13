import React from 'react'
import {Box, SimpleGrid} from '@chakra-ui/react'
import {TeenTestiCard} from './TeenTestiCard'
import { teenTestimonial } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'
import { SectionHeader } from '../../components'
export const TeenTesti = () => {
  return (
    <Box py="6rem">
        <MainContainer>
        <SectionHeader subTitle="Testimonials" title={"Here is what teenagers have to say"} />
        <SimpleGrid columns={[1,2,3]}  >
            {
                teenTestimonial.map(({id, name, title, content, imgUrl}) => (
                    <TeenTestiCard key={id} id={id} name={name} title={title} content={content} imgUrl={imgUrl} />
                ))
            }
        </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
