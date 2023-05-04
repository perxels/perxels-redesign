import React from 'react'
import {Image, Box, SimpleGrid, Text} from '@chakra-ui/react'
export const HeroImagesGrid = () => {
  return (
        <SimpleGrid
            columns={{base: 1, md: 2, lg: 3}}
            spacing={"1.0625rem"}
            w="full"
            h="full"
            overflow="hidden"
        >
            <Box
            display="flex"
            width="100%"
            height="100%"
            flexDirection="column"
            justifyContent="center"
            marginTop="10px"
            >
                <Image src="/assets/images/referral/referralHero1.png" alt="heroImage1" />
                <Image src="/assets/images/referral/referralHero2.png" alt="heroImage2" />
            </Box>
            <Box  display="flex"
            width="100%"
            height="100%"
            flexDirection="column"
            justifyContent="flex-start"
            rowGap="1.1875rem"
            >
                <Image src="/assets/images/referral/referralHero3.png" alt="heroImage3" />
                <Image src="/assets/images/referral/referralHero4.png" alt="heroImage4" />
            </Box>
            <Box
             display="flex"
             width="100%"
             height="100%"
             flexDirection="column"
             justifyContent="center"
             rowGap="1.1875rem"
            >
                <Image src="/assets/images/referral/referralHero5.png" alt="heroImage5" />
            </Box>
        </SimpleGrid>
    )
}
