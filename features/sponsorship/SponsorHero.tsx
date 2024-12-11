import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import gsap from 'gsap'
import Link from 'next/link'
import React, { useEffect, useRef } from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { MainContainer } from '../../layouts'

export const SponsorHero = () => {
  const tl = useRef<any>(gsap.timeline({ paused: true }))
  const heroRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .to('.subHeading', { opacity: 1, duration: 1, delay: 1 })
        .to('.heading', { opacity: 1, duration: 1 }, '-=0.5')
        .to('.desc', { opacity: 1, duration: 1 }, '-=0.5')
        .to('.full-desc', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .to('.sponsor-cta', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .play()
    }, heroRef)

    gsap.to('.sponsor-image', {
      opacity: 1,
      ease: 'linear',
      duration: 1.5,
      delay: 1.5,
    })

    return () => ctx.revert()
  }, [])
  return (
    <MainContainer>
      <SimpleGrid
        py={['3rem', '3rem', '3rem', '0', '0']}
        columns={[1, 1, 1, 2]}
        gap="3rem"
        w="full"
        h={['auto', 'auto', 'auto', 'auto', '100vh']}
        ref={heroRef}
      >
        <Flex flexDir="column" justifyContent="center" w="full" h="full">
          <HStack
            as="span"
            w="auto"
            maxW={['300px', '300px', '350px', '400px']}
            bg="brand.purple.100"
            p="4px"
            rounded="1rem"
            className="subHeading"
            opacity={0}
          >
            <Box
              fontSize={['0.65rem', 'sm', 'sm', 'lg']}
              fontWeight="500"
              as="span"
              bg="brand.white"
              rounded="1rem"
              px="10px"
              py="2px"
            >
          Annual Sponsorship
            </Box>
            <HStack spacing="4px">
              <Box
                fontSize={['0.65rem', 'sm', 'sm', 'lg']}
                fontWeight="500"
                as="span"
                px="10px"
                py="2px"
              >
                Apply Below
              </Box>
              <Icon as={IoMdArrowForward} />
            </HStack>
          </HStack>

          {/* <Heading
            fontSize={['6xl', '6xl', '6xl', '8xl']}
            maxW={['350px', '350px', '350px', '550px']}
            fontWeight="700"
            mt="1.25rem"
            color="brand.dark.300"
            className="desc"
            opacity={0}
          >
          Get 25% Discount Off From June Tuition Fees
          </Heading> */}
          <Heading
            fontSize={['6xl', '6xl', '6xl', '8xl']}
            maxW={['350px', '350px', '350px', '550px']}
            fontWeight="700"
            mt="1.25rem"
            color="brand.dark.300"
            className="desc"
            opacity={0}
          >
             LOBAXTIMI is Offering30% Off Tuition Fees for the January 2025 Cohort!
          </Heading>
          <Text
            fontSize={['lg', 'lg', 'lg', 'xl']}
            color="brand.dark.200"
            maxW="500px"
            mt="1.25rem"
            className="full-desc"
            opacity={0}
          >
       Perxels, in collaboration with Loba and Timi, is offering a 30% discount for anyone looking to kickstart their career in UI/UX design!
          </Text>

          <Button
            opacity={0}
            className="sponsor-cta"
            h="3.125rem"
            px="3.875rem"
            maxW="212px"
            mt="2rem"
            as={Link}
            href="/sponsorship#instructions"
          >
            Apply Now
          </Button>
        </Flex>

        <Box
          className="sponsor-image"
          opacity={0}
          pos="relative"
          mb={['2rem', '2rem', '2rem', '0']}
        >
          <Img
            src="./assets/images/sponsorship/sponsorHero.png"
            alt="sponsor hero"
            w="full"
            h="auto"
            pos={['static', 'static', 'static', 'absolute']}
            right="-6rem"
          />
        </Box>
      </SimpleGrid>
    </MainContainer>
  )
}
