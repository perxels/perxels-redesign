import React from 'react'
import { Box, Text, Heading, Center, Button, Image } from '@chakra-ui/react'
import { Logo } from '../../components'
import Link from 'next/link'
export const Hero = () => {
  return (
    <Box bg="#34296B" 
    height={["100%","100vh"]}
    pos="relative">
      <Box
         as={Link} href="/" pos={["relative","absolute"]} top="2.125rem" left={["1.3rem","3.25rem"]} display={['block']} mb="4rem" pt="1rem"
      >
        <Logo color="#FFFFFF"/>
      </Box>
      <Center  height={["100%","80vh"]} flexDir="column"  pos="relative" alignItems={["flex-start", "center"]} pl={["1.2rem","0rem"]}>
        <Heading
        fontSize={["2.125rem","96px"]} lineHeight={["2.5312rem","5.3125rem"]} textAlign={["left","center" ]} width="70%" fontWeight="700"
          color="#EFEBFF"
        >
          Payment <br /> Documentation
        </Heading>
        <Text
          fontSize={["1.25rem","1.875rem" ]}
          lineHeight={["1.375rem", "2.0794rem"]}textAlign={["left", "center"]} mt={["1rem","1.4375rem"]} fontWeight="400" color="#EFEBFF"
          w={["80%", "40%"]}
        >
          This form is for those that just paid the balance of their tuition
        </Text>
        <a href="https://forms.gle/KdE747Qh6gT2sMDu6">
        <Button  bg="#E35371" cursor="pointer" rounded="5px" mt={["22px","2.375rem"]} py="1.3125rem" fontSize={["1.25rem","1.5625rem"]}  height={["3.25rem","3.875rem"]}>
          Fill form
        </Button>
        </a>
      </Center>
      <Box display={["block", "none"]}>
                <Image src="/assets/images/onboarding/femaleMobile.png" alt="" pos="relative" bottom="0" left="0" />
            </Box> 
      <Box display={["none", "block"]}>
        <Image
          src="/assets/images/onboarding/femaleRight.png"
          alt=""
          pos="absolute"
          bottom="0"
          right="0"
        />
      </Box>
      <Box display={["none", "block"]}>
        <Image
          src="/assets/images/onboarding/femaleLeft.png"
          alt=""
          pos="absolute"
          bottom="0"
          left="0"
          opacity={"0.5"}
        />
         <Box display={["none", "block"]}>
                <Image src="./assets/icons/blurredFigIcon.svg" alt="" pos="absolute" top="20%" left="10%" />
            </Box>
            <Box display={["none", "block"]}>
                <Image src="./assets/icons/blurredFigIcon.svg" alt="" pos="absolute" bottom="20%" right="20%" />
            </Box>
            <Box display={["none", "block"]}>
                <Image src="./assets/icons/blurredBlackIcon.svg" alt="" pos="absolute" top="20%" right="0%" />
            </Box>
      </Box>
    </Box>
  )
}
