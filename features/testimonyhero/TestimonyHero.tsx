import React, { useEffect, useRef } from 'react'
import { Box, Heading, Text, Button, Center, Img } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import TestimonialTooltip from '../testimonial/TestimonialTooltip'

import gsap from 'gsap'
import Link from 'next/link'

export const TestimonyHero = () => {
  const mainRef = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .from('.testimonial-title', { opacity: 0, y: 0, duration: 1, delay: 1 })
        .from('.testimonial-desc', { opacity: 0, y: 100, duration: 1 })
        .from('.testimonial-sub-desc', { opacity: 0, y: 100, duration: 1 })
        .from('.testimonial-button', { opacity: 0, duration: 1 })
        .play()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box ref={mainRef}>
      <MainContainer
        bg={[
          '',
          "url('/assets/images/testimonial/Map.png') no-repeat center center",
          "url('/assets/images/testimonial/Map.png') no-repeat center center",
        ]}
      >
        <Box
          mt="3.5625rem"
          mb={['1.04rem', '3.04rem', '6.043125rem']}
          display={'flex'}
          justifyContent={'center'}
          h={['auto', 'auto', '100vh']}
          p={['0 0rem', '0 0']}
          pb={['8rem', '0', '0']}
          lineHeight={['0.7', 'auto', 'auto']}
          position="relative"
        >
          <Box
            display={['flex']}
            flexDirection={['column']}
            alignItems={['flex-start', 'center']}
          >
            <Heading
              textAlign={['left', 'center', 'center']}
              fontSize={['4xl', '4xl', '6xl', '8xl', '9xl']}
              fontWeight={['800']}
              lineHeight={['2.196875rem', '3.89rem', '4.475625rem']}
              mb={['0.9375rem', '1.375rem']}
              w={['100%', '70%']}
              className="testimonial-title"
            >
              Here&apos;s what our Alumni’s have to say about learning at
              Perxels
            </Heading>
            <Text
              textAlign={['left', 'center', 'center']}
              maxW={['505px']}
              fontSize={['lg', 'xl']}
              lineHeight={['2.005rem', '1.64rem']}
              color={'brand.dark.200'}
              mb={['1.15rem', '1.5rem']}
              className="testimonial-desc"
            >
              The story of each person that has gone through Perxels really
              counts for something more, and that is why we are intentional
              about collecting and sharing them with you because it&apos;s worth
              it.
            </Text>

            <Text
              textAlign={['left', 'center', 'center']}
              fontSize={['lg', 'xl', '2xl']}
              lineHeight={['2.005rem', '1.64rem']}
              color={'brand.dark.200'}
              mb={['1rem', '1.375rem']}
              fontWeight="bold"
              className="testimonial-sub-desc"
            >
              Want to create your own story with Perxels?
            </Text>
            <Center className="testimonial-button">
              <Button as={Link} href="/enrol">
                Enroll Now
              </Button>
            </Center>
            <Box
              display={['block', 'none', 'none']}
              mt={['.5rem']}
              boxSize={['100%', '100%', '100%']}
            >
              <Img src="/assets/images/testimonial/Map.png" alt="Map" />
            </Box>
          </Box>
          <Box
            pos={'absolute'}
            top={['61%', '20%', '20%']}
            left={['16%', '10%', '10%']}
          >
            <TestimonialTooltip />
          </Box>
          <Box
            pos={'absolute'}
            top={['65%', '40%', '40%']}
            left={['20%', '20%', '20%']}
          >
            <TestimonialTooltip />
          </Box>
          <Box
            pos={'absolute'}
            bottom={['27%', '20%', '20%']}
            left={['75%', '40%', '28%']}
          >
            <TestimonialTooltip />
          </Box>
          <Box
            pos={'absolute'}
            bottom={['28%', '20%', '25%']}
            left={['49%', '40%', '53%']}
          >
            <TestimonialTooltip />
          </Box>

          <Box
            pos={'absolute'}
            bottom={['23%', '20%', '37%']}
            left={['52%', '40%', '80%']}
          >
            <TestimonialTooltip />
          </Box>
          <Box
            pos={'absolute'}
            bottom={['37%', '20%', '57%']}
            left={['80%', '40%', '73%']}
          >
            <TestimonialTooltip />
          </Box>
        </Box>
      </MainContainer>
    </Box>
  )
}
