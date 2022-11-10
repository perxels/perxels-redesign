import { Box, Flex, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'
import { TestimonialCardProps } from '../../constant'

interface TestimonialSliderCardProps extends TestimonialCardProps {
    active?: boolean
}

export const TestimonialSliderCard = ({
  id,
  imgUrl,
  title,
  name,
  active,
}: TestimonialSliderCardProps) => {
  return (
    <Box pos="relative" w={active ? "290px" : "235px"} h={active ? "171px" : "138px"} bg="brand.pink.500" rounded="8px">
      <Img w="full" h="full" src={imgUrl} alt={title} rounded="8px" />

      <Flex
        pos="absolute"
        top="0"
        left="0"
        w="full"
        h="full"
        bg="rgba(0, 0, 0, 0.25)"
        py="0.875rem"
        px="1rem"
        flexDir="column"
        justifyContent="flex-end"
        rounded="8px"
      >
        <Heading color="brand.white" fontSize="1rem">{name}</Heading>
        <Text color="brand.white" fontSize="0.75rem">{title}</Text>
      </Flex>
    </Box>
  )
}
