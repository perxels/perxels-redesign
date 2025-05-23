import React, { useEffect, useRef } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  Button,
  Grid,
  Img,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
// import { data } from '../../constant'
import { RiTimer2Line } from 'react-icons/ri'
import { AiOutlineCalendar } from 'react-icons/ai'
import { EventForm } from './'
import { MainContainer } from '../../layouts'

import gsap from 'gsap'
import { formatDate, formatTime } from '../../utils/banner'

export const EventHero = ({ data }: any) => {
  const mainRef = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .from('.ama-title', { opacity: 0, y: 100, duration: 0.5, delay: 0.5 })
        .from('.ama-main-title', { opacity: 0, y: 100, duration: 1 })
        .from('.ama-other-content', { opacity: 0, y: 100, duration: 1 })
        .from('.speaker-section', { opacity: 0, y: 100, duration: 1 })
        .from('.speaker-form', { opacity: 0, y: 100, duration: 1 })
        .from('.about-speaker', { opacity: 0, y: 100, duration: 1 })
        .play()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <MainContainer
      bg={`url(./assets/images/heroBg.png) center/cover no-repeat`}
    >
      <Box py="2rem" w="full" ref={mainRef}>
        <Grid
          w="full"
          templateColumns={['1fr', '1fr', '1fr', '1.5fr 1fr']}
          gap={12}
        >
          <Box>
            <Button
              backgroundColor={'transparent'}
              border="1px solid #E3719C"
              color={'#E3719C'}
              borderRadius="5px"
              _hover={{
                backgroundColor: '#E3719C',
                color: '#fff',
              }}
              mb={{ base: 4, md: 7 }}
            >
              <Text>DESIGN DIGEST SESSION</Text>
            </Button>
            <Heading
              fontSize={{ base: '6xl', md: '7xl', lg: '8xl' }}
              color="brand.dark.100"
              lineHeight={'110%'}
              mb={{ base: 4, md: 4 }}
              className="ama-main-title"
            >
              {/* {data.mainTitle} */} {data.subTitle}
            </Heading>
            <Flex
              className="ama-other-content"
              columnGap={{ base: '0.5rem', lg: '1.3rem' }}
              mt={'1rem'}
            >
              <Box
                color={'brand.gray.400'}
                display={'flex'}
                alignItems={'center'}
                columnGap={{ base: '0.3rem', lg: '0.5625rem' }}
              >
                <Text
                  fontSize={{ base: '1rem', lg: '1.79875rem' }}
                  fontWeight={'bold'}
                >
                  <RiTimer2Line />
                </Text>
                <Text
                  fontSize={{ base: '0.7rem', lg: '1.295rem' }}
                  fontWeight={'bold'}
                >
                  {formatTime(data.startTime)} - {formatTime(data.endTime)}
                </Text>
              </Box>
              <Box
                color={'brand.gray.400'}
                display={'flex'}
                alignItems={'center'}
                columnGap={{ base: '0.3rem', lg: '0.5625rem' }}
              >
                <Text
                  fontSize={{ base: '1rem', lg: '1.79875rem' }}
                  fontWeight={'bold'}
                >
                  <AiOutlineCalendar />
                </Text>
                <Text
                  fontSize={{ base: '0.7rem', lg: '1.295rem' }}
                  fontWeight={'bold'}
                >
                  {formatDate(data.endDate)}
                </Text>
              </Box>
              <Box
                color={'brand.gray.400'}
                display={'flex'}
                alignItems={'center'}
                columnGap={{ base: '0.3rem', lg: '0.5625rem' }}
              >
                <Box
                  boxSize={{ base: '1rem', lg: '1.79875rem' }}
                  fontWeight={'bold'}
                >
                  <Img src="/assets/icons/gps.svg" alt="location" />
                </Box>
                <Text
                  fontSize={{ base: '0.7rem', lg: '1.295rem' }}
                  fontWeight={'bold'}
                >
                  {data.location}
                </Text>
              </Box>
            </Flex>

            {/* speaker card */}
            <Box
              className="speaker-section"
              mt={{ base: 4, md: 16 }}
              mb={{ base: 3.5, md: 10 }}
            >
              <Text
                fontSize={{ base: '0.9rem', lg: '1.25rem' }}
                fontWeight={'bold'}
                color={'brand.gray.400'}
                textTransform={'uppercase'}
                mb={{ base: 2, md: 4 }}
              >
                {/* Speaker: */}
                {/* Panelists: */}
                Facilitator
              </Text>
              <Flex
                mb="3rem"
                flexDir={['row', 'row']}
                rowGap={'3rem'}
                alignItems={'center'}
                columnGap={'1rem'}
                // alignItems="flex-start"
              >
                <Box boxSize={{ base: '5.1875rem', lg: '7.5rem' }}>
                  <Img
                    borderRadius={'50%'}
                    src={data.bannerImage}
                    alt="speakerImg"
                  />
                </Box>
                <Box>
                  <Text
                    fontSize={{ base: '1.10965rem', lg: '1.596875rem' }}
                    fontWeight={'bold'}
                    color={'brand.dark.100'}
                  >
                    {data.speakerName}
                  </Text>
                  <Text
                    fontSize={{ base: '0.806875rem', lg: '1.25rem' }}
                    color="#5F6368"
                  >
                    {data.speakerRole}
                  </Text>
                </Box>
              </Flex>
            </Box>

            {/* event description */}
            <Box className="about-speaker">
              <Text
                fontSize={{ base: '0.9rem', lg: '1.25rem' }}
                fontWeight={'bold'}
                color={'brand.gray.400'}
                textTransform={'uppercase'}
                mb={{ base: 2, md: 4 }}
              >
                About Session:
              </Text>
              <Text
                fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                color="brand.dark.200"
                lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
              >
                {data.description}
              </Text>
              <Text
                mt="20px"
                fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                color="brand.dark.200"
                lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
                fontWeight="bold"
              >
                Don't miss this opportunity to grasp:
              </Text>
              <UnorderedList>
                <ListItem>
                  {' '}
                  <Text
                    mt="20px"
                    fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                    color="brand.dark.200"
                    lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
                  >
                    {data.content1}
                  </Text>
                </ListItem>
                {data.content2 && (
                  <ListItem>
                    <Text
                      mt="10px"
                      fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                      color="brand.dark.200"
                      lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
                    >
                      {data.content2}
                    </Text>
                  </ListItem>
                )}
                {data.content3 && (
                  <ListItem>
                    <Text
                      mt="10px"
                      fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                      color="brand.dark.200"
                      lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
                    >
                      {data.content3}
                    </Text>
                  </ListItem>
                )}
                {data.content4 && (
                  <ListItem>
                    {' '}
                    <Text
                      mt="10px"
                      fontSize={{ base: '0.941875rem', lg: '1.306875rem' }}
                      color="brand.dark.200"
                      lineHeight={{ base: '1.626875rem', lg: '2.2575rem' }}
                    >
                      {data.content4}
                    </Text>
                  </ListItem>
                )}
              </UnorderedList>
            </Box>
          </Box>
          <Box>
            <EventForm />
          </Box>
        </Grid>
      </Box>
    </MainContainer>
  )
}
