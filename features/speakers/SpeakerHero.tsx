import { Box, Heading, VStack, SimpleGrid, Text, Img } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { MainContainer } from '../../layouts'
import { SpeakerForm } from './SpeakerForm'

export const SpeakerHero = () => {
  const mainRef = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .from(mainRef, { background: '#fff', duration: 0.5, delay: 0.5 })
        .from('.speaker-top', { opacity: 0, y: 100, duration: 0.5 })
        .from('.blue-pattern', { opacity: 0, duration: 0.5 })
        .from('.speaker-heading', { opacity: 0, y: 100, duration: 0.75 })
        .from('.speaker-desc', { opacity: 0, y: 100, duration: 0.75 })
        .from('.speaker-bottom', { opacity: 0, y: 100, duration: 0.75 })
        .from('.pattern5', { opacity: 0, duration: 0.75 })
        .play()

      gsap.from('.speaker-form', { opacity: 0, scale: 0, duration: 1, delay: 0.75 })
    }, mainRef)

    return () => ctx.revert()
  }, [])
  return (
    <Box
      backgroundImage={["", "url('/assets/images/speakers/hero.svg')"]}
      backgroundRepeat="no-repeat"
      backgroundSize={'cover'}
      ref={mainRef}
    >
      <MainContainer bg="none">
        <SimpleGrid columns={[1, 1, 1, 2]} gap="2rem" py="4rem">
          <VStack pt={["2rem", "2rem", "2rem", "0"]} pb={["4rem", "4rem", "4rem", "0"]} justifyContent="center" position="relative">

            <Img
              src="/assets/images/speakers/speaker-top.png"
              w="3rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-2rem"
              left="-2rem"
              className='speaker-top'
            />

            <Img
              src="/assets/images/speakers/blue.svg"
              w="1.5rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              top="-2rem"
              left="16rem"
              className='blue-pattern'
            />

            <Img
              src="/assets/images/speakers/pattern5.svg"
              w={["2rem", "2rem", "2rem", "3rem"]}
              h="auto"
              alt="pattern"
              pos="absolute"
              bottom={["1rem", "1rem", "1rem", "3rem"]}
              left="0"
              className='pattern5'
            />

            <Img
              src="/assets/images/speakers/speaker-bottom.png"
              w="3rem"
              h="auto"
              alt="pattern"
              pos="absolute"
              bottom={["-1rem", "-1rem", "-1rem", "-2rem"]}
              left="12rem"
              className='speaker-bottom'
            />

            <Heading className='speaker-heading' as="h1" fontSize={["6xl", "6xl", "7xl", "8xl"]} pr={["2rem", "2rem", "2rem", "0"]} color="brand.dark.200">
              Thank you for accepting to speak at our{' '}
              <Box as="span" color="brand.pink.700">
                AMA Session
              </Box>
            </Heading>
            <Text className='speaker-desc' fontSize={["xl", "xl", "xl", "3xl"]} color="brand.dark.200">
              You have the knowledge and the expertise, we have the platform.
              Join us up-skill the next generation of tech talents..
            </Text>
          </VStack>

          <SpeakerForm />
        </SimpleGrid>
      </MainContainer>
      <Img
        src="/assets/images/speakers/bottomPattern.png"
        w={["auto", "auto", "auto", "full"]}
        h={["3rem", "3rem", "3rem", "auto"]}
        alt="bottom pattern"
        objectFit="cover"
      />
    </Box>
  )
}
