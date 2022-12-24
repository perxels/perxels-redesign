import {
  Box,
  Center,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiOutlineLink } from 'react-icons/ai'
import { SectionHeader } from '../../components'
import { StudentWorks } from '../../constant'
import { MainContainer } from '../../layouts'
import StudentWorkCard from './StudentWorkCard'

export const StudentWorkWrapper = () => {
  return (
    <Box bg="brand.purple.500">
      <Box
        bg={`url(./assets/images/class-group/class-group-bg.png) center/cover no-repeat`}
      >
        <MainContainer bg="none">
          <Box py="5.75rem" pos="relative">
            <SectionHeader
              title="See Our Students’ work"
              subTitle="Students’ portfolio"
              isWhite
              isArrow
            />

            <Img
              src="/assets/icons/arrow-right-up.svg"
              pos="absolute"
              width="12rem"
              height="auto"
              bottom="-3rem"
              right="0"
              display={['none', 'none', 'none', 'block']}
            />

            <SimpleGrid
              pt={['1rem', '1rem', '1rem', '2.5rem']}
              columns={[1, 1, 1, 2]}
              gap={['1.25rem', '1.25rem', '1.25rem', '3.75rem']}
            >
              {StudentWorks.map(({ imgUrl, link }) => (
                <StudentWorkCard key={imgUrl} imgUrl={imgUrl} link={link} />
              ))}
            </SimpleGrid>
          </Box>
        </MainContainer>
      </Box>
    </Box>
  )
}
