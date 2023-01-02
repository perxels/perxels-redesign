import React from 'react'
import {
  Box,
  SimpleGrid,
  Image,
  Grid,
  Center,
  Button,
  Link,
  Icon,
} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import { SectionHeader } from '../../components'
import { eventPlayBack } from '../../constant/eventPlaybeck'
import { BsFillPlayCircleFill } from 'react-icons/bs'
import { EventCard } from './EventCard'
export const EventPlayback = () => {
  return (
    <Box my={'3rem'}>
      <MainContainer>
        <Box display="flex" justifyContent="center" alignItems="center">
          <Box w={{ base: '100%', md: '50%' }}>
            <SectionHeader
              subTitle="our past events"
              title="Run a Play back on our Past Sessions."
              paragraph=""
            />
          </Box>
        </Box>

        <Box
          overflow={{ base: 'scroll', md: 'scroll', lg: 'hidden' }}
          pb={'2.3075rem'}
        >
          <Grid
            templateColumns={{
              base: 'repeat(6, 1fr)',
              md: 'repeat(3, 1fr)',
              lg: 'repeat(3, 1fr)',
            }}
            gap={[4, 6, 6]}
          >
            {eventPlayBack.map(({ imageSrc, link }) => (
              <EventCard key={imageSrc} imageSrc={imageSrc} link={link} />
            ))}
          </Grid>
        </Box>
      </MainContainer>
    </Box>
  )
}
