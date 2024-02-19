import React from 'react'
import {SimpleGrid, Box, Text, Image, Flex, Button} from '@chakra-ui/react'
import { LibraryCards } from './LibraryCards'
import { LibraryAd } from './LibraryAd'
export const LibraryCardLayout = () => {
  return (
    <Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <LibraryCards/>
            <LibraryCards/>
            <LibraryCards/>
            <LibraryCards/>
        </SimpleGrid>
        <Box>
        <LibraryAd/>  
        </Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <LibraryCards/>
            <LibraryCards/>
            <LibraryCards/>
            <LibraryCards/>
        </SimpleGrid>
    </Box>
  )
}
