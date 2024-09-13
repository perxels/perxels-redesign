;`use client`
import React, { useState } from 'react'
import { Box, Text, Heading, Image, Center, Flex } from '@chakra-ui/react'
import { GoDotFill } from 'react-icons/go'
import VideoPlayer from './VideoPlayer'

export const VideoCard = () => {
  const [isPlaying, setIsPlaying] = useState(false)
  return (
    <Box
      display="flex"
      position="relative"
      flexDir="column"
      alignItems="flex-start"
      borderRadius="10px"
    >
      <Box maxHeight="253px" width="100%" position="relative">
        {isPlaying ? (
          <VideoPlayer/>
        ) : (
          <Image
            height="100%"
            width="100%"
            borderRadius={'8px 8px 0px 0px'}
            objectFit={'cover'}
            src="/assets/images/library/videoImage.png"
            alt="libraryCard1"
          />
        )}

        {/* <Center postion="absolute"> */}
        {!isPlaying && (
          <Image
            src="/assets/images/library/playIcon.svg"
            alt="playIcon"
            position="absolute"
            top="50%"
            left="50%"
            transform="translate(-50%, -50%)"
            cursor="pointer"
            onClick={() => setIsPlaying(true)}
          />
        )}
        {/* </Center> */}
      </Box>
      <Box
        borderRadius={'0px 0px 8px 8px'}
        position="relative"
        p="16px 24px"
        bgColor="rgba(246, 246, 246, 0.65);"
      >
        <Flex columnGap="8px">
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#FFF"
            backgroundColor="#339966"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 16px"
          >
            NEW
          </Center>
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#171717"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 10px"
          >
            Live Design Session
          </Center>
        </Flex>
        <Heading fontSize="22px" lineHeight="120%" fontWeight="700">
          Data Representation for designers of all Levels
        </Heading>
        <Flex mt="18px" columnGap="22px" alignItems="center">
          <Flex alignItems="center" columnGap="12px">
            <Image
              src="/assets/images/library/authorImage.png"
              alt="authorImage"
              borderRadius="50%"
            />
            <Text fontSize="14px" color="#1A1A1A">
              {' '}
              Perxels{' '}
            </Text>
          </Flex>
          <Text fontSize="14px">85 views</Text>
          <Flex alignItems="center">
            <GoDotFill color="#1A1A1A" />
            <Text fontSize="14px" color="#1A1A1A">
              2 days ago
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
