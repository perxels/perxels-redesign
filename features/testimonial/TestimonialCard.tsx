import { Box, Flex, Text, VStack } from '@chakra-ui/react'
import Image from 'next/image'
import React from 'react'
import { TestimonialCardProps } from '../../constant'

export const TestimonialCard = ({
  id,
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
        <Image src={imgUrl} alt={name} width={78} height={78} />
        <VStack spacing="0.25rem">
          <Text w="full" textAlign="left" fontSize="lg" fontWeight="bold" color="brand.dark.200">{name}</Text>
          <Text w="full" textAlign="left" fontSize="xs" color="brand.dark.200">{title}</Text>
        </VStack>
      </Flex>

      <Text fontSize="lg" color="brand.dark.200" mt="1rem">
        {content}
      </Text>
    </Box>
  )
}
