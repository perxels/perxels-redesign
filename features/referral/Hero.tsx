import React from 'react'
import {Box, Heading, Text, Button, Image} from '@chakra-ui/react'
import {HeroImagesGrid} from './HeroImagesGrid'
import Link from 'next/link'
export const Hero = () => {
  return (
    <Box
    display="flex"
    bg="brand.purple.500"
    px="5%"
    justifyContent="space-between"
    alignItems="center"
    flexDir={['column', 'column', 'row', 'row']}
    rowGap={["2rem"]}
    pt={["2rem", "0"]}
    position="relative"
    >
       <Box zIndex={2} as={Link} href="/" pos="absolute" top="3%" left="5%" w="146px" h="40px" >
          <Image src="/assets/images/referral/perxLogo.svg" width="100%" height="100%" alt="" />
      </Box>
        <Box mt={["20%", "0"]}>
            <Heading as="h1" fontSize={["2.75rem","3.75rem"]} fontWeight="bold" lineHeight={["2.75rem","3.75rem"]} color="brand.white">
            Make money
            </Heading>
            <Heading as="h1" fontSize={["2.75rem","3.75rem"]} fontWeight="bold" lineHeight={["2.75rem","3.75rem"]} color="brand.white">
            while helping 
            <Heading  fontSize={["2.75rem","3.75rem"]} fontWeight="bold"  lineHeight={["2.75rem","3.75rem"]} as="span" color="brand.yellow.300">
            {" "} others
             </Heading>
            </Heading>
            <Text color="brand.white" py={["1rem","1rem","1rem","3.25rem"]}>
            Over 50+ people have referred to perxels and have cashout
            </Text>
            <Button
            background="#FDE85C"
            color="#34296B"
            >
            Get Started
            </Button>
        </Box>
        <Box>
            <HeroImagesGrid />
        </Box>
    </Box>
  )
}
