import React from 'react'
import { Box, Img, Stack, chakra } from '@chakra-ui/react'
import Link from 'next/link'

interface MarketCardItemProps {
  item: {
    id: number
    title: string
    price: string
    price_th: number
    desc: string
    colors: string[]
    size: string[]
    imgUrl: string
    hoverImage: string // Add hoverImage property to the item object
  }
}

const MarketCardItem: React.FC<MarketCardItemProps> = ({ item }) => {
  return (
    <Stack
      justifyContent="center"
      alignItems="center"
      w="400px"
      h="550px"
      borderRadius="12px"
      as={Link}
      href="/market-place/collections/product"
      bg="#F5F6F7"
      _hover={{ cursor: 'pointer' }}
      position="relative" // Add relative positioning
    >
      <Img
        src={item.imgUrl}
        alt="Product image"
        objectFit="cover"
        objectPosition="center"
        width="100%"
      />
      <Img
        src={item.hoverImage}
        alt="Product image"
        objectFit="cover"
        objectPosition="center"
        width="100%"
        rounded="12px"
        position="absolute" // Position the hoverImage absolutely
        top="0"
        left="0"
        opacity={0} // Initially set opacity to 0
        transition="opacity 0.5s ease" // Add transition for opacity
        _hover={{ opacity: 1 }} // Set opacity to 1 on hover
      />
    </Stack>
  )
}

export default MarketCardItem
