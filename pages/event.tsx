import React from 'react'
import { MainLayout } from '../layouts'
import {
  EventCommunity,
  EventHero,
  EventPlayback,
  EventTwitter,
} from '../features/events'
import { PastSpeakers } from '../features/speakers'
import { useActiveBanner } from '../hooks/useActiveBanner'
import { Box, Spinner } from '@chakra-ui/react'
const Events = () => {
  const { banner, loading } = useActiveBanner()
  return (
    <MainLayout>
      {loading ? (
        <Box textAlign="center" p={5}>
          <Spinner size="xl" />
        </Box>
      ) : (
        <>{banner && <EventHero data={banner} />}</>
      )}

      <EventCommunity />
      <EventPlayback />
      <PastSpeakers />
      <EventTwitter />
    </MainLayout>
  )
}

export default Events
