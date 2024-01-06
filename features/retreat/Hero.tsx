import React, {useEffect, useRef} from 'react'
import {Box, Heading, Text, Image, Center} from '@chakra-ui/react'
import gsap from 'gsap'

export const Hero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const imageRef = useRef<HTMLDivElement>(null)

  const tl = useRef<any>(gsap.timeline({ paused: true }))
  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .to(headingRef.current, { opacity: 1, duration: 1, delay: 0.5 })
        .to(descRef.current, { opacity: 1, duration: 1 }, '-=0.5')
        .to(imageRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .play()
    }, heroRef)
    return () => ctx.revert()
  }, [])
  return (
    <Box
    display="flex"
    flexDirection="column"
    justifyContent={["flex-start","center"]}
    alignItems={["flex-start","center"]}
    py={["3rem","5.625rem"]}
    px={["1.375rem"]}
    position="relative"
    ref={heroRef}
    
    >
        <Center 
        ref={headingRef}
        opacity={0}
        backgroundColor="#DEDAF1" display="inline-flex" px="29px" py="14px" rounded="31.25rem">
            <Text color="#34296B" fontSize="12px" fontWeight="700">
            PERXELS ALUMNI RETREAT 2.0
            </Text>
        </Center>
        <Heading
        fontSize={["1.875rem","4.375rem"]}
        fontWeight="900"
        textAlign={["left","center"]}
        w={["80%","70%"]}
        fontFamily="Montserrat"
        mt={["1.375rem"]}
        ref={descRef}
        opacity={0}
        >
        Navigating the UIUX Job Market in 2024
        </Heading>
        <Image  src="assets/icons/leftRet.png" alt="" position="absolute" left="5%" bottom="10%" display={["none", "block"]} />
        <Image zIndex="5" src="assets/icons/centerRet.svg" alt="" position="absolute" bottom={["13%","45%"]} right={["40%","50%"]} />
        <Image src="assets/icons/rightRet.svg" alt="" position="absolute" bottom="15%" right="0"  display={["none", "block"]}  />

        <Box opacity={0} ref={imageRef} mt={["3.25rem","4.375rem"]} display="flex" justifyContent="space-between" alignItems="flex-end" columnGap="60px">
            <Image height="90%" src="assets/images/retreat/image1.png" alt="retreat1"  display={["none", "block"]} />
            <Image src="assets/images/retreat/image2.png" alt="retreat2" />
            <Image height="90%" src="assets/images/retreat/image3.png" alt="retreat3" display={["none", "block"]} />
        </Box>
    </Box>
  )
}
