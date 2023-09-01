import React from 'react'
import {Box, Text, Heading, Button, Flex, Image} from '@chakra-ui/react'

export const NewHero = () => {
  return (
    <Box pb="4.375rem">
    <Box display={"flex"} flexDir="column" alignItems="center" px={["5%","15%"]} pt={["3rem","7.5rem"]}>
        <Heading fontSize={["2.8125rem","4.375rem"]} textAlign="center" lineHeight={["2.8431rem","70.77px"]} fontWeight="700">
        A co-working space to make work seamless for <Heading as='span' fontSize={["2.8125rem","5rem"]} color="#E3719C" fontWeight="500" fontFamily="Playfair Display SC">C<Heading fontSize={["2.8125rem","5rem"]} as='span'  fontWeight="400" fontFamily="Playfair">reatives.</Heading></Heading>
        </Heading>
        <Text fontSize={["1.125rem","1.5625rem"]} fontWeight="400" color="#555555" textAlign="center" lineHeight={["1.5875rem","35.2px"]} width={["100%","80%"]} mt={["1.25rem","1.875rem"]}>
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        </Text>
        <Button height="50px" w="12.5625rem" rounded=".3125rem" mt={["1.25rem","30px"]}>
        Book a Space
        </Button>
    </Box>
    <Box mt={["3.125rem","144px"]} px={["0","10%"]} overflow={"hidden"}>
        <Image src="/assets/images/hub/hubHero.png" alt="hero" w="100%"  h={["565px", "auto"]}  objectFit={["cover", "contain"]} />
    </Box>
    </Box>
  )
}
