import React, {useEffect, useRef} from 'react'
import {Box, Text, Heading, Button, Flex, Image} from '@chakra-ui/react'
import gsap from 'gsap'

export const NewHero = () => {
  const heroRef = useRef<HTMLDivElement>(null)
  const headingRef = useRef<HTMLHeadingElement>(null)
  const descRef = useRef<HTMLParagraphElement>(null)
  const videoRef = useRef<HTMLDivElement>(null)
  const buttonWrapper = useRef<HTMLDivElement>(null)
  const tl = useRef<any>(gsap.timeline({ paused: true }))
  useEffect(() => {
    let ctx = gsap.context(() => {
      tl.current
        .to(headingRef.current, { opacity: 1, duration: 1, delay: 0.5 })
        .to(descRef.current, { opacity: 1, duration: 1 }, '-=0.5')
        .to(buttonWrapper.current, { opacity: 1, duration: 1 }, '-=0.5')
        .to(videoRef.current, { opacity: 1, y: 0, duration: 1 }, '-=0.5')
        .play()
    }, heroRef)
    const video = document.querySelector('video')
    video?.addEventListener('loadeddata', () => {
      video.play()
    })
    return () => ctx.revert()
  }, [])
  return (
    <Box pb="4.375rem"
    background={'url("/assets/images/hub/hubHeroBg.png") no-repeat center center'}
    backgroundSize={'cover'}
    ref={heroRef}
    >
    <Box display={"flex"} flexDir="column" alignItems="center" px={["5%","15%"]} pt={["3rem","7.5rem"]}>
        <Heading 
        ref={headingRef}
        opacity={0}
        fontSize={["2.8125rem","4.375rem"]} textAlign="center" lineHeight={["2.8431rem","70.77px"]} fontWeight="700">
        A co-working space to make work seamless for <Heading as='span' fontSize={["2.8125rem","5rem"]} color="#E3719C" fontWeight="500" fontFamily="Playfair Display SC">C<Heading fontSize={["2.8125rem","5rem"]} as='span'  fontWeight="400" fontFamily="Playfair">reatives.</Heading></Heading>
        </Heading>
        {/* <Text
         ref={descRef}
         opacity={0}
         fontSize={["1.125rem","1.5625rem"]} fontWeight="400" color="#555555" textAlign="center" lineHeight={["1.5875rem","35.2px"]} width={["100%","80%"]} mt={["1.25rem","1.875rem"]}>
        Enjoy an affordable workspace where you can work, learn and thrive. Our thoughtfully furnished space is waiting for you.
        </Text>
        <Box
         ref={buttonWrapper}
         opacity={0}
        >
        <Button 
        as='a' href="/hub#bookspace" height="50px" w="12.5625rem" rounded=".3125rem" mt={["1.25rem","30px"]}>
        Book a Space
        </Button>
        </Box> */}
    </Box>
      
      <Box
      padding={["4px 5%","4px 29%"]}
      mt="3rem"
      >
      <Box
      backgroundColor="#FFF9D3"
      padding={["18px 1rem","23px 2rem"]}
    display="flex"
    flexDir="column"
    alignItems="center"
      >
        <Text textAlign="center" color="#363576" fontSize={["25px",'30px']} fontWeight='600' lineHeight={["30px","35px"]}>
                Perxels offers her  coworking space free 
        of charge <Text as='span' fontSize={['25px','30px']} fontWeight='800' lineHeight={["30px","35px"]} fontStyle="italic"> for teams conducting their
        end of the year review</Text>
        </Text>

        <Box mt="1.75rem">
          <Button rounded="100px" width={["full","279px" ]}fontSize={["20px","26px"]} fontWeight="800" color="#363576" height={["3rem","5.125rem" ]} backgroundColor="#FEDA00" border="1px solid #000"  as='a' href="/hub#bookspace">
          Book Here
          </Button>
        </Box>

      </Box>
      </Box>
    <Box ref={videoRef} opacity={0}  mt={["3.125rem","144px"]}  w="100%" px={["0","10%"]}  h={["auto", "auto"]} overflow={"hidden"}>
        {/* <Image src="/assets/images/hub/hubHero.png" alt="hero"  h={["565px", "auto"]}  objectFit={["cover", "contain"]} /> */}
        <video  width="100%" height="565px" autoPlay muted loop playsInline
        src="https://res.cloudinary.com/deudl0ryy/video/upload/v1693844203/PERXELS_compressed_l9ogx0.mp4"
        />
        {/* <Box as="iframe" src="https://res.cloudinary.com/deudl0ryy/video/upload/v1693844203/PERXELS_compressed_l9ogx0.mp4"  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen w="100%" h={["565px", "548px"]}  objectFit={["cover", "contain"]} /> */}
    </Box>
    </Box>
  )
}
