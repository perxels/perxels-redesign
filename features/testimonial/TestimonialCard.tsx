import { Box, Flex, Img, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { TestimonialCardProps } from '../../constant'
import { Testimonial } from '../../utils/types'

export const TestimonialCard = ({
  name,
  role,
  testimony,
  imageUrl,
}: Testimonial) => {
  return (
    <Box
      w="full"
      py="1.125rem"
      px="1.75rem"
      bg="brand.gray.300"
      rounded="11.4px"
    >
      <Flex gap="0.5rem" alignItems="center">
        <Img
          src={imageUrl}
          alt={name}
          width="75px"
          height="75px"
          objectFit="cover"
          objectPosition="center"
          rounded="50%"
        />
        <VStack spacing="0.25rem">
          <Text
            w="full"
            textAlign="left"
            fontSize="lg"
            fontWeight="bold"
            color="brand.dark.200"
          >
            {name}
          </Text>
          <Text w="full" textAlign="left" fontSize="xs" color="brand.dark.200">
            {role}
          </Text>
        </VStack>
      </Flex>

      <Text fontSize="lg" color="brand.dark.200" mt="1rem">
        {testimony}
      </Text>
    </Box>
  )
}
