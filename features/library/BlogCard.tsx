;`use client`
import React from 'react'
import { Box, Text, Heading, Image, Center, Flex } from '@chakra-ui/react'
import { GoDotFill } from 'react-icons/go'
import { blogContentProps } from '../../constant/blogContent'

export const BlogCard = ({
  id,
  title,
  writer,
  duration,
  image,
}: blogContentProps) => {
  return (
    <Box
      display="flex"
      position="relative"
      flexDir="column"
      alignItems="flex-start"
      borderRadius="10px"
      as="a"
      href={`/library/blog/${id}`}
    >
      <Box maxHeight="253px" width="100%" position="relative">
        <Image
          width="100%"
          height="208px"
          borderRadius={'8px 8px 0px 0px'}
          objectFit={'cover'}
          src={image}
          alt="libraryCard1"
        />

        {/* </Center> */}
      </Box>
      <Box
        borderRadius={'0px 0px 8px 8px'}
        position="relative"
        w="full"
        p="16px 24px"
        bgColor="rgba(246, 246, 246, 0.65);"
      >
        <Heading fontSize="22px" lineHeight="120%" fontWeight="700">
          {title}
        </Heading>
        <Flex mt="18px" columnGap="22px" alignItems="center">
          <Flex alignItems="center" columnGap="12px">
            <Image
              src="/assets/images/library/authorImage.png"
              alt="authorImage"
              borderRadius="50%"
            />
            <Text fontSize="14px" color="#1A1A1A">
              {writer}
            </Text>
          </Flex>

          <Flex alignItems="center">
            <GoDotFill color="#1A1A1A" />
            <Text fontSize="14px" color="#1A1A1A">
              {duration}
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
