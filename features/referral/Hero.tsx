import React from 'react'
import {Box, Heading, Text, Button, Image} from '@chakra-ui/react'
import {HeroImagesGrid} from './HeroImagesGrid'
export const Hero = () => {
  return (
    <Box
    display="flex"
    bg="brand.purple.500"
    px="5%"
    justifyContent="space-between"
    alignItems="center"
    >
        <Box>
            <Heading as="h1" fontSize="3.75rem" fontWeight="bold" lineHeight="3.75rem" color="brand.white">
            Make money
            </Heading>
            <Heading as="h1" fontSize="3.75rem" fontWeight="bold" lineHeight="3.75rem" color="brand.white">
            while helping 
            <Heading  fontSize="3.75rem" fontWeight="bold" lineHeight="2rem" as="span" color="brand.yellow.300">
            {" "} others
             </Heading>
            </Heading>
            <Text color="brand.white" my="3.25rem">
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
