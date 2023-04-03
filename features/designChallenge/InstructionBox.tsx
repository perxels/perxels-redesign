import React from 'react'
import {Center, Box, Image, Heading, Text} from '@chakra-ui/react'
import { ChallengeInstructionInterface } from '../../constant'
export const InstructionBox = ({image, title, text}: ChallengeInstructionInterface) => {
  return (
    <Box
    padding="3.25rem 1.25rem 2.75rem 1.25rem"

    >
        <Center
        background="brand.purple.500"
        rounded="50%"
        w="70px"
        height="70px"

        >
            <Image src={image} alt="laptopIcon" />
        </Center>

        <Heading
        fontSize="1.5625rem"
        fontWeight="700"
        lineHeight="1.9031rem"
        color="brand.dark.200"
        mt="4.625rem"
        >
        {title}
        </Heading>

        <Text
        color="brand.gray.400"
        fontSize="1.25rem"
        lineHeight="1.91rem"
        mt="1.9375rem"
        >
       {text}
        </Text>
    </Box>
  )
}
