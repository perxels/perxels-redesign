import React from 'react'
import { Box, Heading, Text, Image } from '@chakra-ui/react'

interface BenefitBoxProps {
  border: string
  width: string
  headText: string
  description: string
  imgSrc: string
}

export const BenefitBox = ({
  border,
  width,
  headText,
  description,
  imgSrc,
}: BenefitBoxProps) => {
  return (
    <Box
      position={'relative'}
      border={border}
      width={["100%",width]}
      height={["300px","381px"]}
      backgroundColor="#FBFAF9"
      padding="54px 42px"
      borderRadius="1rem"
      color={'#1A1A1A'}
      _hover={{
        backgroundColor: '#1B1B1B',
        color: '#FFF',
      }}
      __css={{
        transition: 'all 0.3s ease-in-out',
      }}
     
    >
      <Text className="header" fontWeight={500} fontSize={["32px","46px" ]}>
        {headText}
      </Text>
      <Text fontSize={["16px","24px"]} fontWeight={'150%'}>
        {description}
      </Text>

      <Image position="absolute" src={imgSrc} alt="benefiImagge" right="0" bottom="0" />
    </Box>
  )
}
