import React, {useEffect, useRef} from 'react'
import { Box, Heading, Text, Image, HStack, Center } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  useEffect(() => {
    let ctx = gsap.context(() =>{
      gsap.to(heroRef.current, { 
        opacity: 1,
        duration: 3,
        y: 0,
        x: 0,
        delay: 1,
      })
    })
    return () => ctx.revert()
 }, [])
  return (
    <Box py="2.5rem" px={['0', '10%']} position={'relative'} id="Hero">
      <Box  opacity={0} ref={heroRef} display="flex" flexDirection="column" alignItems="center">
        <Box
          bg="rgba(227, 113, 156, 0.1)"
          borderRadius={'30px'}
          padding={'1rem 1.5625rem'}
          display="flex"
          columnGap={'1rem'}
        >
          <Image src="assets/icons/pinkBadge.svg" alt="" />
          <Text
            fontSize={['1rem', '1.125rem']}
            fontWeight="700"
            color="#E3719C"
          >
            Perxels Design Challenge 2.0
          </Text>
        </Box>
        <Heading
          fontSize={['2.5rem', '3rem', '3rem', '5rem']}
          lineHeight={['2.72rem', '3.5rem', '3.5rem', '5.44rem']}
          textAlign="center"
          w={['full', '100%']}
          px={["17px", "0"]}
          mt="1.25rem"
        >
          Showcase your Design skill and win amazing prizes.
        </Heading>

        <Box
          maxW={['100%', '100%']}
          mt="2.5rem"
          zIndex="1"
          bottom="0"
          display={['none', 'block', 'block', 'block']}
        >
          <Image
            src="/assets/images/designChallenge/heroImage.png"
            alt="heroImage"
          />
        </Box>
        <Box
          maxW={['100%', '100%']}
          mt="2.5rem"
          zIndex="1"
          bottom="0"
          display={['block', 'none', 'none', 'none']}
        >
          <Image
            src="/assets/images/designChallenge/heroImageMobile.png"
            alt="heroImage"
          />
        </Box>
      </Box>
      <Box>
        <Center width="70%"></Center>
      </Box>
    </Box>
  )
}
