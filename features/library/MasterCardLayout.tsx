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
import { AdminMasterClass } from '../../utils/types'
import { useFetchMasterClass } from '../../hooks/useAdminMasterclass'
import { MasterclassVideoCard } from './MasterclassVideoCard'

export const MasterCardLayout = () => {
  const { masterClasses, loading } = useFetchMasterClass()

  const sortedByOrder = useMemo(() => {
    // Create a copy of the videos array to avoid mutating the original
    return [...masterClasses].sort((a: AdminMasterClass, b: AdminMasterClass) => {
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
  }, [masterClasses])

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
              <MasterclassVideoCard 
                key={item.id}
                videoTitle={item.title}
                videoUrl={item.url}
                imageUrl={item.bannerImage}
                firstTag={item.firstTag}
                secondTag={item.secondTag}
                id={item.id}
              />
            ))}
          </>
        )}
      </SimpleGrid>
      <Box>
        <LibraryAd />
      </Box>
    </Box>
  )
}
