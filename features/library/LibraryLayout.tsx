import React, { PropsWithChildren } from 'react'
import { LibraryCardLayout } from './LibraryCardLayout'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './Sidebar'
import { MainContainer } from '../../layouts'
import { Hero } from './Hero'

interface LibraryLayoutProps extends PropsWithChildren {
  
}

export const LibraryLayout = ({ children }: LibraryLayoutProps) => {
  return (
    <MainContainer>
      <Hero />
      <Flex
        flexDir={['column', 'row']}
        mt="5%"
        columnGap={'5%'}
      >
        <Box width={['100%', '30%']}>
          <Sidebar />
        </Box>
        <Box width={['100%', '70%']}>{children}</Box>
      </Flex>
    </MainContainer>
  )
}
