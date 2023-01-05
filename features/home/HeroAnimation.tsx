import { Box, Heading, Img, SimpleGrid, Text } from '@chakra-ui/react'
// import Image from 'next/image'
import React, { useEffect, useMemo, useRef, useState } from 'react'

type animationContentType = {
  name: string,
  desc: string,
  color: string
}

export const HeroAnimation = () => {
  const [switcher, setSwitcher] = useState<Number>(1)

  useEffect(() => {
    const interval = setInterval(() => {
      setSwitcher((prev) => (prev === 1 ? 2 : prev === 2 ? 3 : 1))
    }, 4000)
    return () => clearInterval(interval)
  }, [])

  const mainImage = useMemo(() => {
    return switcher === 1
      ? '/assets/images/hero/1-hero.png'
      : switcher === 2
      ? '/assets/images/hero/2-hero.png'
      : '/assets/images/hero/3-hero.png'
  }, [switcher])
  const leftImage = useMemo(() => {
    return switcher === 1
      ? '/assets/images/hero/2-hero.png'
      : switcher === 2
      ? '/assets/images/hero/3-hero.png'
      : '/assets/images/hero/1-hero.png'
  }, [switcher])
  const rightImage = useMemo(() => {
    return switcher === 1
      ? '/assets/images/hero/3-hero.png'
      : switcher === 2
      ? '/assets/images/hero/1-hero.png'
      : '/assets/images/hero/2-hero.png'
  }, [switcher])

  const animationContent: animationContentType = useMemo(() => {
    if (switcher === 1)
      return {
        name: 'Mosope Awolowo',
        desc: 'Accountant turned UI/UX Designer',
        color: '#FF9CAE',
      }

    if (switcher === 2)
      return {
        name: 'Anita Opara',
        desc: 'Site Engineer turned UI/UX Designer',
        color: '#7971FF',
      }

    return {
      name: 'Gbenro Abimbola',
      desc: 'Lawyer turned UI/UX Designer',
      color: '#7971FF',
    }
  }, [switcher])

  return (
    <SimpleGrid
      mt="2.625rem"
      columns={[1, 1, 1, 3]}
      gap={['4rem', '4rem', '4rem', '2rem', '6rem']}
      className="hero-animation"
    >
      <Box display={['none', 'none', 'none', 'block']}>
        <Img width="226px" height="auto" alt="hero" src={leftImage} />
      </Box>
      <Box pos="relative">
        <Img
          display={['none', 'none', 'none', 'block']}
          pos="absolute"
          left="-60%"
          top={['60%', '60%', '60%', '60%', '40%']}
          src="/assets/icons/arrow_01.svg"
          alt="arrow left"
          width="11.65rem"
          height="11.65rem"
        />
        <Img
          display={['none', 'none', 'none', 'block']}
          pos="absolute"
          right="-60%"
          top={['60%', '60%', '60%', '60%', '40%']}
          src="/assets/icons/arrow_02.svg"
          alt="arrow left"
          width="11.65rem"
          height="11.65rem"
        />
        <Img
          width={['295px', '295px', '295px', '354px']}
          height={['466px', '466px', '466px', '559px']}
          mx="auto"
          maxW="auto"
          alt="hero"
          src={mainImage}
        />

        <Box
          as="span"
          bg={animationContent.color}
          rounded="20px"
          px="1rem"
          py={['0.875rem', '1.5rem']}
          pos="absolute"
          bottom={['-2rem', '-2rem', '-2rem', '-3rem']}
          right={['0.5rem', '0.5rem', '6rem', '-7rem']}
        >
          <Heading fontSize={['md', 'lg', 'lg', 'xl']} color="brand.white">
            {animationContent?.name}
          </Heading>
          <Text fontSize={['md', 'lg', 'xl']} color="brand.white">
            {animationContent?.desc}
          </Text>
        </Box>
      </Box>
      <Box ml="auto" display={['none', 'none', 'none', 'block']}>
        <Img width="226px" height="auto" alt="hero" src={rightImage} />
      </Box>
    </SimpleGrid>
  )
}
