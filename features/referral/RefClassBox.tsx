import React from 'react'
import {Box, Text, Heading, Image, Button} from '@chakra-ui/react'

interface RefClassBoxProps{
    title: string;
    text: string;
    image: string;
    earnings: string;
}
export const RefClassBox = ({title, text, image, earnings}: RefClassBoxProps) => {
  return (
   <Box
   bg="#F6F4FF"
   display="flex"
   flexDir={"column"}
   alignItems="center"
   rowGap={["1rem","1.5rem"]}
   p="20px"
   rounded="1rem"
   >
    <Box w="full" position="relative">
        <Image w="full" src={image} alt="" />
        <Text   position="absolute" bottom="0" right="0" color="#FFF" fontSize="1rem" fontWeight="700" p=".5rem 1.5rem" background="#34296B">
        {earnings}
        </Text>
    </Box>
        <Heading>
       {title}
        </Heading>
        <Text textAlign="center">
       {text}
        </Text>
        <Button
        backgroundColor="#FCDB04"
        color="#34296B"
        fontSize="18px"
        fontWeight="400"
        px="2rem"
        py="1.125rem"
        borderRadius=".3125rem"
        >
            VIEW DETAILS
        </Button>
   </Box>
  )
}
