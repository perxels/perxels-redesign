'use client'
import React from 'react'
import {SimpleGrid, Box, Text, Image, Flex, Button} from '@chakra-ui/react'
import { BlogCard } from './BlogCard'
import { LibraryAd } from './LibraryAd'
export const BlogCardLayout = () => {
    return (
        <Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
        </SimpleGrid>
        <Box>
        <LibraryAd/>  
        </Box>
        <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
        </SimpleGrid>
    </Box>
      )
}
