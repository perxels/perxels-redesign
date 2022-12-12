import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import React from 'react'

interface SectionHeaderProps {
  subTitle: string
  title: string
  paragraph?: string
  isWhite?: boolean
  isArrow?: boolean
  arrowLeftPos?: string
  arrowTopPos?: string
  arrowRightPos?: string
  arrowRightBottomPos?: string
  maxW?: string
  headingSize?: string[]
}

const SectionHeader = ({
  subTitle,
  title,
  paragraph,
  isWhite,
  isArrow,
  arrowLeftPos,
  arrowTopPos,
  arrowRightPos,
  arrowRightBottomPos,
  maxW,
  headingSize,
}: SectionHeaderProps) => {
  return (
    <Box pos="relative" mb="2.375rem">
      {isArrow ? (
        <>
          <Img
            src="/assets/icons/arrow-left-down.svg"
            pos="absolute"
            width="12rem"
            height="auto"
            top={arrowTopPos || "0"}
            left={arrowLeftPos || "0"}
            display={['none', 'none', 'none', 'block']}
          />

          <Img
            src="/assets/icons/arrow-right-down.svg"
            pos="absolute"
            width="12rem"
            height="auto"
            top={arrowRightBottomPos || "-4rem"}
            right={arrowRightPos || "10rem"}
            display={['none', 'none', 'none', 'block']}
          />
        </>
      ) : null}

      <Center>
        <Box
          as="span"
          py="0.75rem"
          px="0.688rem"
          bg="brand.yellow.300"
          fontSize={['xs', 'xs', 'xl']}
          fontWeight="bold"
          textTransform="uppercase"
          rounded="10px"
        >
          {subTitle}
        </Box>
      </Center>
      <Heading
        color={isWhite ? 'brand.white' : 'brand.purple.500'}
        textAlign="center"
        fontSize={headingSize || ['2rem', '2rem', '7xl']}
        maxW={maxW || "auto"}
        m="0 auto"
        mb="1rem"
        mt="1.25rem"
      >
        {title}
      </Heading>

      {paragraph && (
        <Text
          textAlign="center"
          fontSize={['0.9rem', '0.9rem', '1.375rem']}
          lineHeight="1.5"
          maxW="669px"
          color="brand.dark.100"
          m="0 auto"
        >
          {paragraph}
        </Text>
      )}
    </Box>
  )
}

export default SectionHeader
