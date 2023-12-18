import { Box, Flex, Img, Link, Heading } from '@chakra-ui/react'
import React, { useEffect, useRef } from 'react'
import { Logo } from '../../components'

const SideImage = () => {
  return (
    <Flex
      bg="brand.pink.700"
      w="90%"
      h="full"
      px="2rem"
      alignItems="flex-end"
      position="relative"
      display={['none', 'none', 'none', 'flex']}
    >
      <Box as={Link} href="/" pos="absolute" top="3.125rem" left="6.25rem">
        <Logo color="#fff" />
      </Box>
      <Heading color="#FFF" fontSize="3.375rem" lineHeight="120%" mb="50%">
      Evaluate competencies
with design examination
      </Heading>
      <Img src="/assets/images/evaluation/rightTop.png"  alt="" position="absolute" top="0" right="0"
      opacity={0.5}
      />
      <Img src="/assets/images/evaluation/leftBottom.png"  alt="" position="absolute" left="0" bottom="0"
      opacity={0.5}
      />
      {/* <Img
        src="/assets/images/register/registerHero.png"
        alt="Register Hero"
        w="100%"
        maxW="500px"
        mx="auto"
        className="enrol-hero"
      /> */}
    </Flex>
  )
}

export default SideImage
