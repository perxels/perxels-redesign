import { Box, SimpleGrid } from '@chakra-ui/react'
import React from 'react'
import { marketPlaceContent } from '../../constant'
import MarketCard from './MarketCard'

export function MarketGridWrapper() {
  return (
    <SimpleGrid
      columns={[1, 1, 2, 3]}
      gap="2.5rem"
      px={['1.2rem', '1.2rem', '1.2rem', '0']}
      mb="5rem"
    >
      {marketPlaceContent.map(({ id, title, link, price, imgUrl }) => (
        <MarketCard
          key={id}
          id={id}
          title={title}
          link={link}
          price={price}
          imgUrl={imgUrl}
        />
      ))}
    </SimpleGrid>
  )
}
