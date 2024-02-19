import React from 'react'
import { LibraryCardLayout } from './LibraryCardLayout'
import { Box, Flex } from '@chakra-ui/react'
import { Sidebar } from './Sidebar'
import { MainContainer } from '../../layouts'

export const LibraryLayout = () => {
  return (
    <MainContainer>
      <Flex flexDir={["column","row"]} mt="5%" columnGap="5%">
        <Box width={["100%","30%"]}>
          <Sidebar />
        </Box>
        <Box width={["100%","70%"]}>
          <LibraryCardLayout />
        </Box>
      </Flex>
    </MainContainer>
  )
}
