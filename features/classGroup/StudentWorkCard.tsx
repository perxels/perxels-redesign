import { Box, Center, HStack, Icon, Img, Link, Text } from '@chakra-ui/react'
import React, { useState } from 'react'
import { AiOutlineLink } from 'react-icons/ai'

const StudentWorkCard = ({
  imgUrl,
  link,
}: {
  imgUrl: string
  link: string
}) => {
  const [isHover, setIsHover] = useState(false)
  return (
    <Box
      onMouseEnter={() => setIsHover(true)}
      onMouseLeave={() => setIsHover(false)}
      key={imgUrl}
      pos="relative"
      rounded="8px"
      overflow="hidden"
      as={Link}
      href={link}
    >
      {isHover && (
        <Center
          pos="absolute"
          top="0"
          left="0"
          w="full"
          h="full"
          bg="brand.overlay.300"
          rounded="5px"
        >
          <HStack alignItems="center" cursor="pointer">
            <Icon as={AiOutlineLink} fontSize="2.5rem" color="brand.white" />
            <Text fontSize="2xl" color="brand.white">
              View Case Study
            </Text>
          </HStack>
        </Center>
      )}
      <Img src={imgUrl} alt="student work" w="100%" h="auto" />
    </Box>
  )
}

export default StudentWorkCard
