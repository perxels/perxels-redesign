import React, {useEffect} from 'react'
import {Box, Text, Heading, Button, Flex, Image} from '@chakra-ui/react'

export const NewHero = () => {
  useEffect(() => {
    const video = document.querySelector('video')
    video?.addEventListener('loadeddata', () => {
      video.play()
    })
  }, [])
  return (
    <Box pb="4.375rem"
    background={'url("/assets/images/hub/hubHeroBg.png") no-repeat center center'}
    backgroundSize={'cover'}
    >
    <Box display={"flex"} flexDir="column" alignItems="center" px={["5%","15%"]} pt={["3rem","7.5rem"]}>
        <Heading fontSize={["2.8125rem","4.375rem"]} textAlign="center" lineHeight={["2.8431rem","70.77px"]} fontWeight="700">
        A co-working space to make work seamless for <Heading as='span' fontSize={["2.8125rem","5rem"]} color="#E3719C" fontWeight="500" fontFamily="Playfair Display SC">C<Heading fontSize={["2.8125rem","5rem"]} as='span'  fontWeight="400" fontFamily="Playfair">reatives.</Heading></Heading>
        </Heading>
        <Text fontSize={["1.125rem","1.5625rem"]} fontWeight="400" color="#555555" textAlign="center" lineHeight={["1.5875rem","35.2px"]} width={["100%","80%"]} mt={["1.25rem","1.875rem"]}>
        Enjoy an affordable workspace where you can work, learn and thrive. Our thoughtfully furnished space is waiting for you.
        </Text>
        <Button as='a' href="/hub#bookspace" height="50px" w="12.5625rem" rounded=".3125rem" mt={["1.25rem","30px"]}>
        Book a Space
        </Button>
    </Box>
    <Box mt={["3.125rem","144px"]}  w="100%" px={["0","10%"]}  h={["auto", "auto"]} overflow={"hidden"}>
        {/* <Image src="/assets/images/hub/hubHero.png" alt="hero"  h={["565px", "auto"]}  objectFit={["cover", "contain"]} /> */}
        <video width="100%" height="565px" autoPlay muted loop playsInline
        src="https://res.cloudinary.com/deudl0ryy/video/upload/v1693844203/PERXELS_compressed_l9ogx0.mp4"
        />
        {/* <Box as="iframe" src="https://res.cloudinary.com/deudl0ryy/video/upload/v1693844203/PERXELS_compressed_l9ogx0.mp4"  allow="autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture" allowFullScreen w="100%" h={["565px", "548px"]}  objectFit={["cover", "contain"]} /> */}
    </Box>
    </Box>
  )
}
