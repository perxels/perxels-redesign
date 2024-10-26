import { Box, Flex, Img, Text, VStack } from '@chakra-ui/react'
import React from 'react'
import { TestimonialCardProps } from '../../constant'

export const TestimonialCard2 = ({
  name,
  title,
  content,
  imgUrl,
}: TestimonialCardProps) => {
  return (
    <Box
      w="full"
      py="1.125rem"
      px="1.75rem"
      bg="brand.gray.300"
      rounded="11.4px"
    >
      <Flex gap="0.5rem" alignItems="center">
        <Img src={imgUrl} alt={name} width="78px" height="78px" />
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
            {title}
          </Text>
        </VStack>
      </Flex>

      <Text fontSize="lg" color="brand.dark.200" mt="1rem">
        {content}
      </Text>
    </Box>
  )
}
