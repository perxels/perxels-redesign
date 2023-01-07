import {
  Box,
  Button,
  Center,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { courseOutlines } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'

export const CourseOutline = () => {
  return (
    <Box py="6.75rem">
      <MainContainer>
        <Heading
          textAlign="center"
          maxW="31.625rem"
          mx="auto"
          color="brand.dark.200"
          fontSize={['5xl', '5xl', '5xl', '7xl']}
          fontWeight="bold"
        >
          What you will learn from the class?
        </Heading>

        <SimpleGrid
          columns={[1, 1, 1, 2]}
          mt="2.2rem"
          maxW="64.375rem"
          mx="auto"
          spacing="1.25rem"
        >
          {courseOutlines.map(({ num, desc }) => (
            <Box
              key={num}
              bg="brand.gray.900"
              px="1.875rem"
              py="2rem"
              rounded="5px"
            >
              <Heading
                fontSize={['4xl', '4xl', '4xl', '7xl']}
                color="brand.pink.700"
              >
                {num}
              </Heading>
              <Text
                color="brand.dark.200"
                fontSize={['md', 'md', 'md', 'lg']}
                mt="1.125rem"
              >
                {desc}
              </Text>
            </Box>
          ))}
        </SimpleGrid>

        <Center>
          <Button h="5rem" rounded="5rem" mt="2.5rem">
            INVESTMENT FEE: ₦50,000
          </Button>
        </Center>
      </MainContainer>
    </Box>
  )
}
