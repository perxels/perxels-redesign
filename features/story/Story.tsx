import React, { useEffect, useState } from 'react'
import { Box, Flex, Heading, Img, Text } from '@chakra-ui/react'
import { StoryCard } from './StoryCard'
import { MainContainer } from '../../layouts'
import { StoryIcon } from '../../components'

import gsap from 'gsap'

import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const Story = () => {
  const [switcher, setSwitcher] = useState<Number>(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setSwitcher((prev) => (prev === 1 ? 2 : 1))
    }, 3000)
    return () => clearInterval(interval)
  }, [])

  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.story-section', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: ".story-section",
          start: "-900 top",
          end: "bottom bottom",
        }
      })
    })

    return () => ctx.revert()
  }, [])

  return (
    <Box className='story-section'>
      <MainContainer
        bg={switcher === 1 ? 'brand.purple.500' : 'brand.yellow.300'}
      >
        <Flex
          direction={{ base: 'column', lg: 'row' }}
          justify="space-between"
          align={{ base: 'flex-start', lg: 'center' }}
          w="100%"
          h="100%"
          py={['4.5rem', '3.4375rem']}
          bg={switcher === 1 ? 'brand.purple.500' : 'brand.yellow.300'}
        >
          <Box>
            <StoryIcon pathColor={switcher === 2 ? '#fff' : '#34296B'} circleColor={switcher === 1 ? '#fff' : '#34296B'} />

            <Heading
              fontSize={['7xl', '7xl', '7xl']}
              fontWeight="black"
              color={switcher === 1 ? 'brand.white' : 'brand.purple.500'}
              mt="1.5rem"
            >
              {switcher === 1 ? 'Our Mission' : 'Our Vision'}
            </Heading>

            <Text
              fontSize={['xl', '2xl']}
              color={switcher === 1 ? 'brand.white' : 'brand.purple.500'}
              mt="1.2rem"
              maxW={{ base: '100%', lg: '27.3125rem' }}
            >
              {
                switcher === 1 ? `
                  Equipping designers with the core design skills and soft skills to
                  become proficient in solving problems with design.
                ` : `
                  To solve the world problems with great designs.
                `
              }
            </Text>
          </Box>

          <Box
            w={{ base: '70%', lg: '55%' }}
            h={{ base: '100%', lg: '50%' }}
            mt={{ base: '2.5rem', lg: '0' }}
            alignContent="left"
          >
            <Img
              w={['15rem', '20rem', '22rem', '31.875rem']}
              h={['15rem', '20rem', '22rem', '31.875rem']}
              src={
                switcher === 1
                  ? '/assets/images/story/storyImage.png'
                  : '/assets/images/story/storyImage2.png'
              }
              alt="Story Image"
            />
            <Box
              pos="absolute"
              // width={{ base: '65%', lg: '29.9375rem' }}
              width={['80%', '65%', '29.9375rem', '29.9375rem']}
              transform={[
                'translate(10%, -60%)',
                'translate(40%, -80%)',
                'translate(40%, -80%)',
                'translate(10%, -80%)',
                'translate(40%, -80%)',
              ]}
            >
              <StoryCard switcher={switcher} />
            </Box>
          </Box>
        </Flex>
      </MainContainer>
    </Box>
  )
}
