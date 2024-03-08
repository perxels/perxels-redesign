'use client'

import React from 'react'
import {SimpleGrid, Box, Text, Image, Flex, Button} from '@chakra-ui/react'
import { PdfCards } from './PdfCard'
import { LibraryAd } from './LibraryAd'
export const PdfCardLayout = () => {
  return (
    <Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
        </SimpleGrid>
        <Box>
        <LibraryAd/>  
        </Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
            <PdfCards/>
        </SimpleGrid>
    </Box>
  )
}
