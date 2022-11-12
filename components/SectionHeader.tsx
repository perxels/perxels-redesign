import { Box, Center, Heading, Text } from '@chakra-ui/react'
import React from 'react'

interface SectionHeaderProps {
  subTitle: string
  title: string
  paragraph?: string
  isWhite?: boolean
}

const SectionHeader = ({
  subTitle,
  title,
  paragraph,
  isWhite,
}: SectionHeaderProps) => {
  return (
    <Box mb="2.375rem">
      <Center>
        <Box
          as="span"
          py="0.75rem"
          px="0.688rem"
          bg="brand.yellow.300"
          fontSize={['xs', 'xs', 'xl']}
          fontWeight="bold"
          textTransform="uppercase"
          rounded="10px"
        >
          {subTitle}
        </Box>
      </Center>
      <Heading
        color={isWhite ? 'brand.white' : 'brand.purple.500'}
        textAlign="center"
        fontSize={['2rem', '2rem', '7xl']}
        mt="1.25rem"
        mb="1rem"
      >
        {title}
      </Heading>

      {paragraph && (
        <Text
          textAlign="center"
          fontSize={['0.9rem', '0.9rem', '1.375rem']}
          lineHeight="1.5"
          maxW="669px"
          color="brand.dark.100"
          m="0 auto"
        >
          {paragraph}
        </Text>
      )}
    </Box>
  )
}

export default SectionHeader
