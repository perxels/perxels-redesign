'use client'

import React from 'react'
import {SimpleGrid, Box, Text, Image, Flex, Button} from '@chakra-ui/react'
import { VideoCard } from './VideoCard'
import { LibraryAd } from './LibraryAd'
export const VideoCardLayout = () => {
  return (
    <Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
        </SimpleGrid>
        <Box>
        <LibraryAd/>  
        </Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
            <VideoCard/>
        </SimpleGrid>
    </Box>
  )
}
