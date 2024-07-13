'use client'
import React from 'react'
import { SimpleGrid, Box, Text, Image, Flex, Button } from '@chakra-ui/react'
import { BlogCard } from './BlogCard'
import { LibraryAd } from './LibraryAd'
import { blogContentDataArray } from '../../constant/blogContent'
export const BlogCardLayout = () => {
  return (
    <Box>
      <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        {blogContentDataArray.map((item, i) => {
          return (
            <BlogCard
              key={i}
              id={item.id}
              title={item.title}
              writer={item.writer}
              duration={item.duration}
              image={item.image}
            />
          )
        })}
        {/* <BlogCard/>
            <BlogCard/>
            <BlogCard/> */}
      </SimpleGrid>
      <Box>
        <LibraryAd />
      </Box>
      {/* <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
            <BlogCard/>
        </SimpleGrid> */}
    </Box>
  )
}
