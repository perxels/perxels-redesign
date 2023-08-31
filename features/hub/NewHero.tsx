import React from 'react'
import {Box, Text, Heading, Button, Flex, Image} from '@chakra-ui/react'

export const NewHero = () => {
  return (
    <Box pb="4.375rem">
    <Box display={"flex"} flexDir="column" alignItems="center" px="15%" pt="7.5rem">
        <Heading fontSize="4.375rem" textAlign="center" lineHeight="70.77px" fontWeight="700">
        A co-working space to make work seamless for <Heading as='span' fontSize="5rem" color="#E3719C" fontWeight="500" fontFamily="Playfair Display SC">C<Heading fontSize="5rem" as='span'  fontWeight="400" fontFamily="Playfair">reatives.</Heading></Heading>
        </Heading>
        <Text fontSize="1.5625rem" fontWeight="400" color="#555555" textAlign="center" lineHeight="35.2px" width="80%" mt="1.875rem">
        Lorem ipsum dolor sit amet, consectetur adipiscing elit, sed do eiusmod tempor incididunt ut labore et dolore magna aliqua. Ut enim ad minim veniam, quis nostrud exercitation ullamco.
        </Text>
        <Button height="50px" w="12.5625rem" rounded=".3125rem" mt="30px">
        Book a Space
        </Button>
    </Box>
    <Box mt="144px" px="10%">
        <Image src="/assets/images/hub/hubHero.png" alt="hero" w="100%" />
    </Box>
    </Box>
  )
}
