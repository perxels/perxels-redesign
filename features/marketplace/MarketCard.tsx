import { Box, Center, Heading, Img, Text } from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { MarketPlaceContent } from '../../constant'

const MarketCard = ({ id, title, imgUrl, link, price }: MarketPlaceContent) => {
  return (
    <Box
      overflow="hidden"
      w="full"
      rounded="10px"
      borderWidth="1px"
      borderColor=""
    >
      <Img src={imgUrl} />

      <Center w="full" p="1.25rem" bg="brand.white">
        <Box maxW="239px">
          <Text textAlign="center" fontSize="2xl" color="brand.gray.800">
            {title}
          </Text>

          <Heading
            fontSize="1.5rem"
            color="brand.dark.200"
            mt="1.125rem"
            textAlign="center"
          >
            {price}
          </Heading>

          <Link href={link}>
            <Text
              fontWeight="bold"
              fontSize="xl"
              textDecor="underline"
              mt="1.25rem"
              textAlign="center"
            >
              Buy Now
            </Text>
          </Link>
        </Box>
      </Center>
    </Box>
  )
}

export default MarketCard
