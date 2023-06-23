import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import React, {useEffect, useRef} from 'react'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
export const MasterclassHero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({paused: true}))
  useEffect(() => {
    let ctx = gsap.context(() =>{
      //fade in on start
      gsap.to(heroRef.current, { 
        opacity: 1,
        duration: 3,
        y: 0,
        x: 0,
        delay: 1,
      })
      // tl.current
      // .to(heroRef.current, {
      //     opacity: 1,
      //     duration: 3,
      //     y: 0,
      //     x: 0,
      //     delay: 0.1,
      // }).from(".heroText", {
      //   duration: 0.3,
      //   y: 150,
      //   autoAlpha: 0,
      //   ease: "power4.out",
      //   stagger: 1.5,
      //   opacity: 0,
      //   immediateRender: true
      // }).from(".heroImg", {
      //   duration: 0.5,
      //   y: 200,
      //   autoAlpha: 0,
      //   ease: "elastic.out(1, 1)",
      //   opacity:0,
      //   stagger: {
      //     each: 0.75,
      //     amount: 0.5
      //   },
      //   immediateRender: true
      // },  "+=0.25").play()
    })
     return () => ctx.revert()
  }, [])
  return (
    <Box
      ref={heroRef}
      bg="url('/assets/images/masterclass/masterclassHeroBg.png')"
      bgRepeat="no-repeat"
      bgSize="cover"
      opacity={0}
    >
      <MainContainer bg="none">
        <Center  flexDir="column" pt="4rem" >
          <Heading
            maxW="810px"
            lineHeight="1.2"
            fontSize={['2rem', '2.5rem', '2.5rem', '4.30rem']}
            textAlign="center"
            className="heroText"
        
          >
            Free UIUX Design Masterclass
          </Heading>

          <Text
            maxW="556px"
            textAlign="center"
            fontSize="2xl"
            color="brand.dark.200"
            mt="1.125rem"
            className="heroText"
          >
             {/* A  special design masterclass to help you transition into UIUX design */}
             A Free Physical Masterclass For <b>Residents Of Ibadan, Oyo State.</b> 
          </Text>
        </Center>

        <Center flexDir="column" pb="2rem" pt="4rem" pos="relative">
          <Img
            src="/assets/images/masterclass/main_screen.png"
            alt="Masterclass Hero"
            w="full"
            h="auto"
            maxW="577px"
            className="heroImg"
          />

          {/* positioned left top */}
          <Img
            src="/assets/images/masterclass/screen1.png"
            alt="Masterclass Hero"
            w="full"
            h="auto"
            maxW="312px"
            pos="absolute"
            top="-10rem"
            left="0"
            display={['none', 'none', 'none', 'none', 'block']}
            className="heroImg"
          />

          {/* positioned left bottom */}
          <Img
            src="/assets/images/masterclass/screen2.png"
            alt="Masterclass Hero"
            w="full"
            h="auto"
            maxW="226px"
            pos="absolute"
            top="10rem"
            left="4rem"
            className="heroImg"
            display={['none', 'none', 'none', 'none', 'block']}
          />

          {/* positioned right top */}
          <Img
            src="/assets/images/masterclass/screen3.png"
            alt="Masterclass Hero"
            w="full"
            h="auto"
            maxW="312px"
            pos="absolute"
            top="-10rem"
            right="0"
            display={['none', 'none', 'none', 'none', 'block']}
            className="heroImg"
          />

          {/* positioned right bottom */}
          <Img
            src="/assets/images/masterclass/screen4.png"
            alt="Masterclass Hero"
            w="full"
            h="auto"
            maxW="245px"
            pos="absolute"
            top="10rem"
            right="4rem"
            display={['none', 'none', 'none', 'none', 'block']}
            className="heroImg"
          />
        </Center>
      </MainContainer>
    </Box>
  )
}
