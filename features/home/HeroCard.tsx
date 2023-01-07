import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { HeroDataProps } from '../../constant/heroData'

export const HeroCard = ({ title, content, image, color }: HeroDataProps) => {
  return (
    <Box
      py={['2rem', '3.25rem']}
      px={['2rem', '3.5rem']}
      borderWidth="1px"
      borderColor={color}
      rounded="22px"
      className="section-card"
    >
      <Center width="6.384rem" height="6.384rem" rounded="full" bg={color}>
        <Img src={image} width={42} height={42} alt={title} />
      </Center>

      <Heading fontSize="xl" mt="1.875rem">
        {title}
      </Heading>
      <Text fontSize="md" mt="0.625rem" color="brand.gray.400">
        {content}
      </Text>
    </Box>
  )
}
