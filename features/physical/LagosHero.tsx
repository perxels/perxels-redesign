import React, { useEffect, useRef } from 'react'
import { Box, Heading, Image, Flex, Text, Center } from '@chakra-ui/react'
import Link from 'next/link'
import gsap from 'gsap'
export const LagosHero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))

  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .to(heroRef.current, { opacity: 1, duration: 1, delay: 1 })
        .to(headingRef.current, { opacity: 1, duration: 1 }, '-=0.5')
        .to('.descClass', { opacity: 1, duration: 1 }, '-=0.5')
        // .to('.hero-animation', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .play()
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box
    background={[`url(/assets/images/class-group/lagosMobile.png) no-repeat center center`,`url(/assets/images/class-group/lagosDesktop.png) no-repeat center center`]}
    minHeight={["43.75rem","25rem"]}
    backgroundSize="cover"
    opacity={0}
    ref={heroRef}
    >
        <Center
        flexDir="column"
        justifyContent="center"
        alignItems="center"
        minHeight={["43.75rem","25rem"]}
        >
        <Heading
        color="#FFFFFF"
        fontSize="2.8125rem"
        fontWeight="800"
        textAlign="center"
        opacity={0}
        ref={headingRef}
        >
            Lekki, Lagos
        </Heading>
        <Text
        color="#FFF"
        as={Link}
        href="/"
        opacity={0}
        className="descClass"
        >
        VIEW ON GOOGLE MAPS
        </Text>
        </Center>
    </Box>
  )
}
