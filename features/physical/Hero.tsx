import React, { useEffect, useRef } from 'react'
import { Box, Heading, Image, Flex, Text } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRefFirst = useRef<HTMLHeadingElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const imgRef = useRef<HTMLImageElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)

  const tl = useRef<any>(gsap.timeline({ paused: true }))
  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
      .to(headingRefFirst.current, { opacity: 1, duration: 1, delay: 1 })
        .to(headingRef.current, { opacity: 1, duration: 1, delay: 1 })
        .to(descRef.current, { opacity: 1, duration: 1 }, '-=0.5')
        .to(imgRef.current, { opacity: 1, duration: 1 }, '-=0.5')
        // .to('.hero-animation', { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .play()
    }, heroRef)

    return () => ctx.revert()
  }, [])

  return (
    <Box py={["8%","5%"]}
    ref={heroRef}
    >
    <MainContainer>
    <Flex
    justifyContent="space-between"
    alignItems="center"
    flexDir={["column", "row"]}
    rowGap="2rem"
    >
      <Box
      width={["100%","45%"]}
      
      
      >
        <Heading
        color="#121212"
        fontSize={["2.8rem","4.5rem"]}
        lineHeight="102%"
        fontWeight="800"
        ref={headingRefFirst}
        opacity={0}
        >
        Explore our 
        </Heading>
        <Heading
        color="#E3719C"
        fontSize={["2.8rem","4.5rem"]}
        lineHeight="102%"
        fontWeight="800"
        ref={headingRef}
        opacity={0}
        >
        Physical Spaces.
        </Heading>
        <Text
        fontSize={["0.9rem","1.25rem"]}
        color="#555"
        mt={["1rem","1.875rem"]}
        opacity={0}
        ref={descRef}
        >
        On our quest to continue expanding and bringing design education to your dorrstep, we have establishde a couple of physical learning spaces.
        </Text>
      </Box>
      <Box
      width={["100%","50%"]}
      ref={imgRef}
      opacity={0}
      >
        <Image src="/assets/images/class-group/physicalHero.png" alt="physical space hero" />
      </Box>
    </Flex>
    </MainContainer>
    </Box>
  )
}
