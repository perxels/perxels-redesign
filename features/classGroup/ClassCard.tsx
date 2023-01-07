import { Box, Button, Flex, Heading, Text, Link } from '@chakra-ui/react'
import React from 'react'
import { ClassGroupContentProps } from '../../constant'
import NextLink from 'next/link'
export const ClassCard = ({
  title,
  content,
  image,
  link,
}: ClassGroupContentProps) => {
  return (
    <Flex
      flexDir="column"
      justifyContent="flex-end"
      width="full"
      h={['410.39px', '410.39px', '541px']}
      bg={`linear-gradient(360deg, #000000 23.68%, rgba(0, 0, 0, 0) 106.41%), url(${image}) center/cover no-repeat`}
      borderRadius="18px"
      overflow="hidden"
      px="2rem"
      py="2.75rem"
      className="class-group-card"
    >
      <Heading color="brand.white" fontSize={['3xl', '4xl', '4xl', '6xl']}>
        {title}
      </Heading>
      <Text color="brand.white" fontSize={['xs', 'sm', 'md', 'xl']}>
        {content}
      </Text>

      <Link as={NextLink} href={link} _hover={{ textDecoration: 'none' }}>
        <Button
          mt="2.5rem"
          w={{ base: '170px', lg: '212px' }}
          variant="solid-white"
        >
          View Details
        </Button>
      </Link>
    </Flex>
  )
}
