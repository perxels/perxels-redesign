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
      justifyItems="center"
      alignContent="center"
    >
      <Img
        src="/assets/images/market-place/explore_button.svg"
        alt="Explore"
        width={['100px', '150px']}
        position="absolute"
        bottom="-100px"
        left="0"
        right="0"
        margin="auto"
        cursor="pointer"
        onClick={() => router.push('/market-place/collections')}
        css={{
          '@keyframes spin': {
            from: {
              transform: 'rotate(0deg)',
            },
            to: {
              transform: 'rotate(360deg)',
            },
          },
          animation: 'spin 20s linear infinite',
        }}
      />

      <Box
        width={'100%'}
        height={['170px', '350px']}
        bg="#7971FF"
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
      ></Box>
      <Box
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        width={'100%'}
        height={['170px', '350px']}
        bg="#FDE85C"
      ></Box>
      <Box
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        width={'100%'}
        height={['170px', '350px']}
        bg="#FF9CAE"
      ></Box>
      <Box
        cursor="pointer"
        as={Link}
        href="/market-place/collections"
        width={'100%'}
        height={['170px', '350px']}
        bg="#00BBF9"
      ></Box>
    </SimpleGrid>
  )
}
