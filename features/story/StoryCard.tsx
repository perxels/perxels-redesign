import React from 'react'
import {
  StoryCardProps,
  storyCardContent,
} from '../../constant/storyCardContent'
import { Box, Text, Heading, Flex, SimpleGrid } from '@chakra-ui/react'
export const StoryCard = () => {
  return (
    <Box
      bg="brand.yellow.300"
      px={["1.5rem", "1.5rem", "1.5rem", "3.188rem"]}
      py={["2rem", "2rem", "2rem", "2.563rem"]}
      rounded={{ base: '10px', lg: '10px' }}
    >
      <SimpleGrid columns={3} gap="2rem">
        {storyCardContent.map((storyCard) => {
          return (
            <Box key={storyCard.studentStat}>
              <Heading
                fontSize={["1rem", "1.25rem", "1.5rem", "2.25rem"]}
              >
                {storyCard.studentStat}
              </Heading>
              <Text
                fontSize={["0.6rem", "xs", "sm", "xl"]}
                textAlign="left"
              >
                {storyCard.studentStatText}
              </Text>
            </Box>
          )
        })}
      </SimpleGrid>
    </Box>
  )
}
