'use client'

import React, { useMemo } from 'react'
import {
  SimpleGrid,
  Box,
  Text,
  Image,
  Flex,
  Button,
  Stack,
  CircularProgress,
} from '@chakra-ui/react'
import { VideoCard } from './VideoCard'
import { LibraryAd } from './LibraryAd'
import { useFetchVideos } from '../../hooks/useVideos'
import { Video } from '../../utils/types'

export const VideoCardLayout = () => {
  const { videos, loading } = useFetchVideos()

  const sortedByOrder = useMemo(() => {
    // Create a copy of the videos array to avoid mutating the original
    return [...videos].sort((a: Video, b: Video) => {
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
  }, [videos])

  return (
    <Box>
      <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
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
            {sortedByOrder.map((item) => (
              <VideoCard {...item} key={item.id} />
            ))}
          </>
        )}
      </SimpleGrid>
      <Box>
        <LibraryAd />
      </Box>
      {/* <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        <VideoCard />
        <VideoCard />
        <VideoCard />
        <VideoCard />
      </SimpleGrid> */}
    </Box>
  )
}
