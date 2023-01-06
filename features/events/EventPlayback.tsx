import React, { useEffect } from 'react'
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
import { EventCard } from './EventCard'

import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)


export const EventPlayback = () => {

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.eventPlayback', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: ".eventPlayback",
          start: "-900 top",
          end: "bottom bottom",
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <Box className='eventPlayback' my={'3rem'}>
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
            {eventPlayBack.map(({ imageSrc, link }, index) => (
              <EventCard key={imageSrc} index={index} imageSrc={imageSrc} link={link} />
            ))}
          </Grid>
        </Box>
      </MainContainer>
    </Box>
  )
}
