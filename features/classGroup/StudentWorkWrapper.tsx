import { Box, Img, SimpleGrid, Text } from '@chakra-ui/react'
import React from 'react'
import { SectionHeader } from '../../components'
import { StudentWorks } from '../../constant'
import { MainContainer } from '../../layouts'

export const StudentWorkWrapper = () => {
  return (
    <MainContainer
      bg="brand.purple.500"
      // bg={`url(/assets/images/class-group/class-group-bg.png), brand.purple.500 center/cover no-repeat`}
    >
      <Box py="5.75rem" pos="relative">
        <SectionHeader
          title="See Our Students’ work"
          subTitle="Students’ portfolio"
          isWhite
        />

        <Img 
          src="/assets/icons/arrow-left-down.svg"
          pos="absolute"
          width="12rem"
          height="auto"
          top="6rem"
          left="0"
        />

        <Img 
          src="/assets/icons/arrow-right-down.svg"
          pos="absolute"
          width="12rem"
          height="auto"
          top="2rem"
          right="10rem"
        />
        
        <Img 
          src="/assets/icons/arrow-right-up.svg"
          pos="absolute"
          width="12rem"
          height="auto"
          bottom="-3rem"
          right="0"
        />

        <SimpleGrid pt="2.5rem" columns={2} gap="3.75rem">
          {StudentWorks.map((imgUrl) => (
            <Img
              key={imgUrl}
              src={imgUrl}
              alt="student work"
              w="100%"
              h="auto"
            />
          ))}
        </SimpleGrid>
      </Box>
    </MainContainer>
  )
}
