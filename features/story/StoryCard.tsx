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
      px={["1.5rem", "1.5rem", "1.5rem", "2.5rem"]}
      py={["2rem", "2rem", "2rem", "2.563rem"]}
      rounded={{ base: '10px', lg: '10px' }}
      maxW={["350px", "380px", "380px", "440px", "510px"]}
    >
      <SimpleGrid columns={3} gap="1.5rem">
        {storyCardContent.map((storyCard) => {
          return (
            <Box key={storyCard.studentStat}>
              <Heading
                fontSize={["1.35rem", "1.35rem", "1.35rem", "2rem"]}
              >
                {storyCard.studentStat}
              </Heading>
              <Text
                fontSize={["0.75rem", "0.75rem", "sm", "xl"]}
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
