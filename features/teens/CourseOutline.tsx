import {
  Box,
  Button,
  Center,
  Flex,
  Heading,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { courseOutlines } from '../../constant/teensContent'
import { MainContainer } from '../../layouts'
import Link from 'next/link'

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
        {/* <Center>
          <Button h="5rem" rounded="5rem" mt="2.5rem">
            INVESTMENT FEE: ₦50,000
          </Button>
        </Center> */}
      </MainContainer>
      <Box mt="5rem">
        <MainContainer bg="#34296B">
          <Flex px={["5%","10%"]} flexDir={["column","row"]}  py="1.5625rem" alignItems={["flex-start","center"]} justifyContent="space-between" rowGap="2px">
            <Box display="flex"  alignItems={["flex-start","center"]} flexDir={["column","row"]} columnGap="2.5rem">
            <Text color="#FFF" fontSize="1.25rem" fontWeight="700" w={["90%", "100%"]} display={["none", "block"]}>
            Gain access to all these with just an investment fee of 
            </Text>
            <Text color="#FFF" fontSize="1.25rem" fontWeight="700" w={["100%", "100%"]} display={["block", "none"]}>
            Gain access to all these with <br/> just an investment fee of 
            </Text>
            <Text color="#FDE85C"  fontSize="2.19rem" fontWeight="700">
            ₦50,000
            </Text>
            </Box>
            <Link href='/teens/register'>
            <Button fontSize="20px" color="#34296B" fontWeight="700" backgroundColor="#FFF" rounded='.625rem'  >
            Enroll Now
            </Button>
            </Link>
          </Flex>
        </MainContainer>
      </Box>
    </Box>
  )
}
