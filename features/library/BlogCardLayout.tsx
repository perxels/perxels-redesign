'use client'
import React, { useMemo } from 'react'
import { SimpleGrid, Box, Stack, CircularProgress } from '@chakra-ui/react'
import { BlogCard } from './BlogCard'
import { LibraryAd } from './LibraryAd'
import { useFetchBlogs } from '../../hooks/useBlogs'
import { Blog } from '../../utils/types'
export const BlogCardLayout = () => {
  const { blogs, loading, refetchBlogs } = useFetchBlogs()

  const sortedByOrder = useMemo(() => {
    // Create a copy of the videos array to avoid mutating the original
    return [...blogs].sort((a: Blog, b: Blog) => {
      // If both videos have order, sort by order
      if (a.order !== undefined && b.order !== undefined) {
        return a.order - b.order
      }
      // If only one has order, put the one with order first
      if (a.order !== undefined) return -1
      if (b.order !== undefined) return 1
      // If neither has order, maintain original order
      return 0
    })
  }, [blogs])

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
            {sortedByOrder.map((item, i) => {
              return (
                <BlogCard
                  key={i}
                  id={item.id}
                  title={item.title}
                  writer={item.writer}
                  blog={item.blog}
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
    </Box>
  )
}
