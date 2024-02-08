import React from 'react'
import { Box, Heading, Text, Image, Button } from '@chakra-ui/react'

interface ActivitiesCardProps {
  bgColor: string
  headColor: string
  textColor: string
  buttonBg: string
  buttonColor: string
  headText: string
  descriptionText: string
  imgSrc: string
}

export const ActivitiesCard = ({
  bgColor,
  headColor,
  textColor,
  buttonBg,
  buttonColor,
  headText,
  descriptionText,
  imgSrc,
}: ActivitiesCardProps) => {
  return (
    <Box
      backgroundColor={bgColor}
      padding={['32px 24px', '54px 42px']}
      rounded="16px"
    >
      <Heading fontWeight={500} fontSize={['32px', '48px']} color={headColor}>
        {headText}
      </Heading>
      <Text fontSize={["16px","24px"]} color={textColor} lineHeight="150%" mt={["10px","24px"]}>
        {descriptionText}
      </Text>
      <Button
        border={'0.5px solid #707070'}
        fontSize={["16px",'24px']}
        rounded="42px"
        height={["50px","71px"]}
        width={["full","265px"]}
        fontWeight="400"
        bgColor={buttonBg}
        color={buttonColor}
        mt={["24px","42px"]}
        mb={["27px","54px"]}
      >
        Enrol Now
      </Button>
      <Image src={imgSrc} alt="activities1" />
    </Box>
  )
}
