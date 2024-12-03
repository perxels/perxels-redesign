'use client'
import React from 'react'
import { SimpleGrid, Box, Stack, CircularProgress } from '@chakra-ui/react'
import { BlogCard } from './BlogCard'
import { LibraryAd } from './LibraryAd'
import { useFetchBlogs } from '../../hooks/useBlogs'
export const BlogCardLayout = () => {
  const { blogs, loading, refetchBlogs } = useFetchBlogs();
  return (
    <Box>
       {loading ? (
        <Stack w="full" alignItems="center" justifyContent="center">
          <CircularProgress
            isIndeterminate
            color="#34296B"
            thickness="10px"
            size={30}
          />
        </Stack>
      ) : (
        <>
         <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        {blogs.map((item, i) => {
          return (
            <BlogCard
              key={i}
              id={item.id}
              title={item.title}
              writer={item.writer}
              // duration={item.duration}
              image={item.image}
            />
          )
        })}
      </SimpleGrid>
        </>
      )}
    
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
