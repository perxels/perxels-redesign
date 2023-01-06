import {
  Box,
  Center,
  Container,
  Flex,
  GridItem,
  Heading,
  Icon,
  Img,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import gsap from 'gsap'
import React, { useEffect, useRef } from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { MainContainer } from '../../layouts'

export const Hero = () => {
  const mainRef = useRef<HTMLDivElement>(null)
  const videoRef = useRef<HTMLVideoElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    videoRef.current?.play()
    let ctx = gsap.context(() => {
      tl.current
        .from('.arrow-erica', { opacity: 0, y: 100, duration: 0.5, delay: 0.5 })
        .from('.class-plan-title', { opacity: 0, y: 100, duration: 0.5 })
        .from('.class-plan-heading', { opacity: 0, y: 100, duration: 0.5 })
        .from('.class-plan-trained', { opacity: 0, y: 100, duration: 1 })
        .from('.class-plan-thousand', { opacity: 0, y: 100, duration: 1 })
        .from('.arrow-mhiz', { opacity: 0, y: 100, duration: 1 })
        .play()

      gsap.from('.class-plan-video', { opacity: 0, scale: 0, duration: 1, delay: 1 })
    }, mainRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box
      ref={mainRef}
      w="full"
      bg={`url(./assets/images/heroBg.png) center/cover no-repeat`}
    >
      <MainContainer bg="none">
        <SimpleGrid py="2.5rem" columns={[1, 1, 1, 12]} spacing="2.5rem">
          <GridItem
            h="full"
            colSpan={[1, 1, 1, 5]}
            pt={['3rem', '3rem', '3rem', 0]}
          >
            <Flex
              pos="relative"
              h="full"
              flexDir="column"
              justifyContent="center"
            >
              <Img
                src="/assets/icons/arrow_erica.svg"
                width="157px"
                height="auto"
                pos="absolute"
                right="2rem"
                top="5rem"
                display={['none', 'none', 'none', 'block']}
                className="arrow-erica"
              />

              <Img
                src="/assets/icons/arrow_mhiz.svg"
                width="157px"
                height="auto"
                pos="absolute"
                right="8rem"
                top="21rem"
                display={['none', 'none', 'none', 'block']}
                className="arrow-mhiz"
                zIndex="4"
              />
              <Heading
                w="full"
                fontSize={['lg', 'lg', 'xl']}
                fontWeight="600"
                textTransform="uppercase"
                className="class-plan-title"
              >
                Enroll Page
              </Heading>
              <Heading
                maxW="505px"
                fontSize={['3rem', '3rem', '3.5rem']}
                fontWeight="black"
                lineHeight={1.15}
                className="class-plan-heading"
              >
                Building Top Designers for the World.
              </Heading>

              <Heading
                w="full"
                fontSize={['lg', 'lg', 'xl']}
                pt="1.5rem"
                fontWeight="600"
                textTransform="uppercase"
                className="class-plan-trained"
              >
                TRAINED
              </Heading>
              <Heading
                w="full"
                fontSize={['5.625rem', '5.625rem', '7.5rem']}
                lineHeight={1.2}
                color="brand.purple.300"
                fontWeight="black"
                className="class-plan-thousand"
              >
                3000+
              </Heading>
            </Flex>
          </GridItem>

          <GridItem h="full" colSpan={[1, 1, 1, 7]}>
            <Box
              roundedLeft="10px"
              overflow="hidden"
              mr={['0', '0', '0', '0', '-6rem', '0']}
              pos="relative"
              className='class-plan-video'
            >
              <video
                ref={videoRef}
                width="100%"
                height="auto"
                loop={true}
                controls={false}
                muted
                src="https://res.cloudinary.com/dhqvopvj4/video/upload/v1672846839/perxels/enrol_dgzjky.mp4"
              />
            </Box>
          </GridItem>
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
