import { Grid, GridItem, Heading, Img, Text, VStack } from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { MainContainer } from '../../layouts'

export const PartnersHero = () => {
  const mainRef = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .from('.partner-title', { opacity: 0, y: 100, duration: 0.5, delay: 0.5 })
        .from('.partner-desc', { opacity: 0, y: 100, duration: 1 })
        .from('.partner-img', { opacity: 0, y: 100, duration: 1 })
        .play()
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <MainContainer>
      <Grid
        ref={mainRef}
        templateColumns={['1fr', '1fr 526px']}
        gap={['2.5rem', '2.5rem', '2.5rem', '1rem']}
        py={['4rem', '4rem', '4rem', '8rem']}
      >
        <GridItem>
          <VStack h="full" alignItems="flex-start" justifyContent="center">
            <Heading
              w="full"
              color="#000"
              maxW={['490px']}
              fontSize={['6xl', '6xl', '6xl', '2xxl']}
              pr={['2rem', '2rem', '2rem', '0']}
              lineHeight="1.1"
              className='partner-title'
            >
              Equipping African Youths with digital skills
            </Heading>
            <Text
              color="brand.dark.200"
              maxW="470px"
              fontSize={['md', 'md', 'md', 'xl']}
              mt="1.5rem"
              className='partner-desc'
            >
              We are enabling the empowerment of young people in Africa with
              digital skills that would make them more valuable to themselves,
              their community, their nation and the African continent
            </Text>
          </VStack>
        </GridItem>
        <GridItem>
          <Img
            src="/assets/images/partners/partnersHero.png"
            w="full"
            h="auto"
            alt="Partners Hero"
            className='partner-img'
          />
        </GridItem>
      </Grid>
    </MainContainer>
  )
}
