import { Box, Center, Img, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { MainContainer } from '../../layouts'

export const StudentJob = () => {
  return (
    <MainContainer>
         <Box w="full" py="6.375rem">
         <SectionHeader
          title="Where Our Students Work"
          subTitle="TESTIMONIALS"
          paragraph="We are proud to see our students getting design jobs, impacting product teams with their skills and being paid well for their value."
          isArrow
          arrowTopPos="3rem"
          arrowRightBottomPos="1rem"
          arrowRightPos="3rem"
        />


<SimpleGrid columns={[1, 1, 2, 5]} spacing="2.5rem">
          <Center
            w="full"
            h="147px"
            bg="brand.white"
            shadow="0px 7px 53px rgba(75, 75, 75, 0.06)"
            rounded="5px"
          >
            <Img w="162px" h="auto" src="/assets/images/studentjob/workLogo1.svg" alt="figma" />
          </Center>
          <Center
            w="full"
            h="147px"
            bg="brand.white"
            shadow="0px 7px 53px rgba(75, 75, 75, 0.06)"
            rounded="5px"
          >
            <Img
              w="187px"
              h="auto"
              src="/assets/images/studentjob/workLogo2.svg"
              alt="figjam"
            />
          </Center>
          <Center
            w="full"
            h="147px"
            bg="brand.white"
            shadow="0px 7px 53px rgba(75, 75, 75, 0.06)"
            rounded="5px"
          >
            <Img w="154px" h="auto" src="/assets/images/studentjob/workLogo3.svg" alt="miro" />
          </Center>
          <Center
            w="full"
            h="147px"
            bg="brand.white"
            shadow="0px 7px 53px rgba(75, 75, 75, 0.06)"
            rounded="5px"
          >
            <Img
              w="312.9px"
              h="auto"
              src="/assets/images/studentjob/workLogo4.svg"
              alt="google meet"
            />
          </Center>
          <Center
            w="full"
            h="147px"
            bg="brand.white"
            shadow="0px 7px 53px rgba(75, 75, 75, 0.06)"
            rounded="5px"
          >
            <Img
              w="290.07px"
              h="auto"
              src="/assets/images/studentjob/workLogo5.svg"
              alt="google form"
            />
          </Center>
        
        </SimpleGrid>
        </Box>
    </MainContainer>
  )
}
