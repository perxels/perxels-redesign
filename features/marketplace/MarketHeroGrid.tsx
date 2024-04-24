import { Box, Img, SimpleGrid, Text } from '@chakra-ui/react'
import Link from 'next/link'
import { useRouter } from 'next/router'
import React from 'react'

export const MarketHeroGrid = () => {
  const router = useRouter()
  return (
    <SimpleGrid
      columns={[2, 2, 2, 4]}
      position="relative"
      mb="5rem"
      w="100%"
      mt={'30px'}
    >
        
      <Img
        src="/assets/images/market-place/explore_button.svg"
        width="150px"
        position="absolute"
        bottom="-100px"
        left="0"
        right="0"
        margin="auto"
        // pointerEvents="none" 
        cursor="pointer"
        onContextMenu={(e) => e.preventDefault()}
        onClick={() => router.push('/market-place/collections')}
      />

      <Box
        width={'100%'}
        height="350px"
        bg="#9966CC"
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
      ></Box>
      <Box
        width={'100%'}
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        height="350px"
        bg="#FFBE0B"
      ></Box>
      <Box
        width={'100%'}
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        height="350px"
        bg="pink.700"
      ></Box>
      <Box
        width={'100%'}
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        height="350px"
        bg="#3A86FF"
      ></Box>
    </SimpleGrid>
  )
}
