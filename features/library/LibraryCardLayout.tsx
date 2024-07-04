import React from 'react'
import { SimpleGrid, Box, Text, Image, Flex, Button } from '@chakra-ui/react'
import { LibraryCards } from './LibraryCards'
import { LibraryAd } from './LibraryAd'
import { libraryCardContent } from '../../constant'
export const LibraryCardLayout = () => {
  return (
    <Box>
      <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        {/* {libraryCardContent.map((item, i) => {
          return (
            <LibraryCards
              key={i}
              bannerImage={item.bannerImage}
              tag={item.tag}
              mainTitle={item.mainTitle}
              subTitle={item.subTitle}
              role={item.role}
            />
          )
        })} */}
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
      </SimpleGrid>
      <Box>
        <LibraryAd />
      </Box>
      <SimpleGrid py="10%" columns={[1, 2, 2]} spacing="32px">
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
        <LibraryCards
          tag="AMA Session"
          mainTitle="Laws of UX"
          subTitle="O'reilley"
          role="Author"
        />
      </SimpleGrid>
    </Box>
  )
}
