;`use client`
import React, { useState } from 'react'
import { Box, Text, Heading, Image, Center, Flex } from '@chakra-ui/react'
import { GoDotFill } from 'react-icons/go'
import VideoPlayer from './VideoPlayer'
import { Video } from '../../utils/types'
import moment from 'moment'
import { useRouter } from 'next/navigation'

interface MasterclassVideoCardProps {
  id?: string
  videoTitle: string
  imageUrl: string
  videoUrl: string
  firstTag: string
  secondTag: string
}

export const MasterclassVideoCard = ({
  id,
  videoTitle,
  imageUrl,
  videoUrl,
  firstTag,
  secondTag,
}: MasterclassVideoCardProps) => {
  const [isPlaying, setIsPlaying] = useState(false)
  const router = useRouter()
  return (
    <Box
      display="flex"
      position="relative"
      flexDir="column"
      alignItems="flex-start"
      borderRadius="10px"
      cursor="pointer"
      onClick={() => router.push(`/library/masterclass/${id}`)}
    >
      <Box maxHeight="250px" width="100%" position="relative">
        {isPlaying ? (
          <VideoPlayer videoUrl={videoUrl} onEnd={() => setIsPlaying(false)} />
        ) : (
          <Box w="full" height="240px">
            <Image
              height="100%"
              width="100%"
              borderRadius={'8px 8px 0px 0px'}
              objectFit={'cover'}
              src={imageUrl || '/assets/images/library/videoImage.png'}
              alt="library image"
            />
          </Box>
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
            // onClick={() => setIsPlaying(true)}
          />
        )}
        {/* </Center> */}
      </Box>
      <Box
        borderRadius={'0px 0px 8px 8px'}
        position="relative"
        p="16px 24px"
        // bgColor="red"
        w="full"
        minH="180px"
        bgColor="rgba(246, 246, 246, 0.65)"
      >
        <Flex columnGap="8px">
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#FFF"
            backgroundColor="#339966"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="4px 16px"
          >
            {firstTag}
          </Center>
          {secondTag && (
          <Center
            mb="16px"
            borderRadius={'16px'}
            color="#171717"
            border="1px solid #E8E8E8"
            display="inline-flex"
            p="6px 10px"
          >
              {secondTag}
            </Center>
          )}
        </Flex>
        <Heading
          fontSize="22px"
          lineHeight="120%"
          noOfLines={2}
          fontWeight="700"
        >
          {videoTitle}{' '}
        </Heading>
        <Flex mt="18px" columnGap="22px" alignItems="center">
          <Flex alignItems="center" columnGap="12px">
            <Image
              src="/assets/images/library/authorImage.png"
              alt="authorImage"
              borderRadius="50%"
            />
            <Text fontSize="14px" color="#1A1A1A">
              Perxels
            </Text>
          </Flex>
        </Flex>
      </Box>
    </Box>
  )
}
