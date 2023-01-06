import React, { useEffect } from 'react'
import { Box, Button, Text, Heading, Link } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import { AiOutlineRightCircle } from 'react-icons/ai'

import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const EventTwitter = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.event-twitter', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.event-twitter',
          start: '-900 top',
          end: 'bottom bottom',
        },
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <Box className='event-twitter'>
      <MainContainer>
        <Box
          bg={{
            base: `linear-gradient(360deg, #352A6C 23.68%, rgba(53, 42, 108, 0) 106.41%),url(assets/images/events/twittermobile.png) center/cover no-repeat`,
            lg: `linear-gradient(90deg, #34296B 47.57%, rgba(52, 41, 107, 0) 140.52%),url(assets/images/events/twitterevent.png) center/cover no-repeat`,
          }}
          w="full"
          h={{ base: 'auto', lg: '29.5rem' }}
          position="relative"
          borderRadius="1.875rem"
          p={{
            base: '10.3125rem 1.25rem 2.1875rem 1.25rem',
            lg: '8.3125rem 5.3125rem',
          }}
          my={{ base: '1.25rem', lg: '2.5rem' }}
        >
          <Box>
            <Heading
              color={'brand.white'}
              fontSize={{ base: '1.705rem', md: '3.125rem' }}
              fontWeight="bold"
            >
              Join Our Twitter Spaces.
            </Heading>
            <Text
              color={'brand.white'}
              fontSize={{ base: '1.125rem', md: '1.125rem' }}
              lineHeight={{ base: '1.555625rem', md: '1.555625rem' }}
              maxWidth={{ base: '100%', md: '50%' }}
              mt={'1.25rem'}
            >
              We host twitter spaces every
              <Text as="span" fontWeight={'bold'} textTransform="uppercase">
                {' '}
                wednesday{' '}
              </Text>
              to discuss trending topics. Follow us on Twitter and get notified
              everytime.
            </Text>
            <Button
              background={'transparent'}
              border={'1px solid #FDE85C'}
              color={'brand.yellow.300'}
              mt={'1.25rem'}
              fontSize={{ base: '1.125rem', md: '1.125rem' }}
              p={{ base: '0.625rem 1.25rem', md: '1.25rem 1.3125em' }}
              as={Link}
              href="https://twitter.com/perxels"
              target="_blank"
            >
              Follow Us on Twitter
              <Text ml="0.6875rem">
                <AiOutlineRightCircle />
              </Text>
            </Button>
          </Box>
        </Box>
      </MainContainer>
    </Box>
  )
}
