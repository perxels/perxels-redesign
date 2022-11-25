import React from 'react'
import { Box, SimpleGrid, Image, Grid, Center, Button } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import { SectionHeader } from '../../components'
import { eventPlayBack } from '../../constant/eventPlaybeck'
export const EventPlayback = () => {
  return (
    <Box my={"3rem"}>
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
            gap={6}
          >
            {eventPlayBack.map(({ imageSrc }) => (
              <Box
                key={imageSrc}
                w={{ base: '23rem', md: '100%', lg: '100%' }}
                h="100%"
              >
                <Image src={imageSrc} alt="event" />
              </Box>
            ))}
          </Grid>
        </Box>

        <Center>
          <Button
            bg="transparent"
            border="1px solid #34296B"
            color="brand.purple.500"
            fontSize={'1.560625rem'}
            p={'1.5rem 3rem'}
          >
            Load More
          </Button>
        </Center>
      </MainContainer>
    </Box>
  )
}
