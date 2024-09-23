'use client'

import React from 'react'
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
export const VideoCardLayout = () => {
  const { videos, loading } = useFetchVideos()
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
            {videos.map((item, i) => {
              return <VideoCard {...item} key={i} />
            })}
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
