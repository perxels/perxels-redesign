import { Box, Center, Heading, Icon, Img, Text } from '@chakra-ui/react'
import React from 'react'

import { BsFillPlayFill } from 'react-icons/bs'

export const TestimonyVideo = () => {
  return (
    <Box
      w="full"
      h={["318px", "318px", "475px"]}
      bg="brand.pink.100"
      overflow="hidden"
      rounded="10px"
      pos="relative"
    >
      <Img
        w="full"
        h="full"
        src={'/assets/images/testimonyThumb-2.jpg'}
        alt="Testimonial Video"
        display={['none', 'none', 'block', 'block']}
      />
      <Img
        w="full"
        h="full"
        objectFit={'cover'}
        src={'/assets/images/testimonyThumb-5.png'}
        alt="Testimonial Video"
        display={['block', 'block', 'none', 'none']}
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
      >
        <Center w={["3.5rem", "4.375rem", "6.25rem"]} h={["3.5rem", "4.375rem", "6.25rem"]} bg="brand.yellow.300" rounded="full">
          <Icon as={BsFillPlayFill} fontSize={["2rem", "3rem"]} />
        </Center>

        <Heading px={["0.5rem", "0"]} fontSize={["md", "xl", "3xl"]} textAlign="center" color="brand.white" mt="1rem">
          “I landed a job as a product designer with a company in the US.”
        </Heading>

        <Heading fontSize={["xl", "3xl", "4xl"]} textAlign="center" color="brand.white" mt="1rem">
          - Sharon
        </Heading>

        <Text fontSize={["sm", "xl", "3xl"]} color="brand.white" mt="1rem">
          Product Designer, Huzz Technologies
        </Text>
      </Center>
    </Box>
  )
}
