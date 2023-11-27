import { Box, Center, Heading, Icon, Img, Text } from '@chakra-ui/react'
import React, { useEffect } from 'react'

import { BsFillPlayFill } from 'react-icons/bs'
import { useAppSelector } from '../../state/store'

export const TestimonyVideo = () => {
  const videoRef = React.useRef<HTMLVideoElement>(null)

  const [isPlaying, setIsPlaying] = React.useState(false)

  const { selectedTestimonialSchl } = useAppSelector((state) => state.testimonialSch)

  useEffect(() => {
    setIsPlaying(false)
  }, [selectedTestimonialSchl])

  return (
    <Box
      w="full"
      h={isPlaying ? '600px' : ['318px', '318px', '475px']}
      bg="brand.white"
      overflow="hidden"
      rounded="10px"
      pos="relative"
    >
      {!isPlaying ? (
        <>
          <Img
            w="full"
            h="full"
            objectFit={'contain'}
            src={selectedTestimonialSchl?.imgUrl}
            alt="Testimonial Video"
          />

          <Center
            w="full"
            h="full"
            bg="brand.overlay.100"
            pos="absolute"
            top="0"
            left="0"
            cursor="pointer"
            flexDir="column"
            onClick={() => {
              setIsPlaying(true)
              videoRef.current?.play()
            }}
          >
            <Center
              w={['3.5rem', '4.375rem', '6.25rem']}
              h={['3.5rem', '4.375rem', '6.25rem']}
              bg="brand.yellow.300"
              rounded="full"
            >
              <Icon as={BsFillPlayFill} fontSize={['2rem', '3rem']} />
            </Center>

            <Heading
              px={['0.5rem', '0']}
              fontSize={['md', 'xl', '3xl']}
              textAlign="center"
              color="brand.white"
              mt="1rem"
            >
              {selectedTestimonialSchl?.content}
            </Heading>

            <Heading
              fontSize={['xl', '3xl', '4xl']}
              textAlign="center"
              color="brand.white"
              mt="1rem"
            >
              - {selectedTestimonialSchl?.name}
            </Heading>

            <Text fontSize={['sm', 'xl', '3xl']} color="brand.white" mt="1rem">
              {selectedTestimonialSchl?.title}
            </Text>
          </Center>
        </>
      ) : null}

      <video
        controls={true}
        style={{ height: '100%', width: 'auto', margin: '0 auto' }}
        ref={videoRef}
        src={ selectedTestimonialSchl?.video}
        onPause={() => setIsPlaying(false)}
        onEnded={() => setIsPlaying(false)}
      ></video>
    </Box>
  )
}
