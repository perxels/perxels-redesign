import { Box, Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'

export const LeaningTools = () => {
  return (
    <MainContainer>
      <Box w="full" py="6.375rem">
        <SectionHeader
          title="Learn with the industry’s best tools"
          subTitle="Learning tools"
          paragraph="We are proud to see our students getting design jobs, impacting product teams with their skills and being paid well for their value."
        />

        <SimpleGrid columns={[1, 1, 2, 3]} spacing="0">
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/figma.jpg"
            alt="figma"
          />
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/figjam.jpg"
            alt="figma"
          />
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/miro.jpg"
            alt="figma"
          />
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/meet.jpg"
            alt="figma"
          />
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/g-form.jpg"
            alt="figma"
          />
          <Img
            w="full"
            h="auto"
            src="/assets/images/class-group/illustrator.jpg"
            alt="figma"
          />
        </SimpleGrid>
      </Box>
    </MainContainer>
  )
}
