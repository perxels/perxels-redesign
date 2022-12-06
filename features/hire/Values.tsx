import { Box, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'

interface ValuesProps {
  icon: string
  title: string
  description: string
}

const Values = ({ icon, title, description }: ValuesProps) => {
  return (
    <Box w="full" py="3.125rem" pt="2.5rem" px="2.125rem">
      <Img ml="-1rem" src={icon} w="5rem" h="5rem" alt="Like icon" />

      <Heading color="brand.dark.200" mb="1.4rem" fontSize="4xl">{title}</Heading>
      <Text fontSize="lg" color="brand.gray.500">
        {description}
      </Text>
    </Box>
  )
}

export default Values
