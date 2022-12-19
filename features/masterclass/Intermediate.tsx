import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { BsArrowRightCircle, BsFillCheckCircleFill } from 'react-icons/bs'
import { MainContainer } from '../../layouts'

const lists: string[] = [
  'Intermediate designers in the design industry looking to expand their knowledge and scale up their skill',
  'You understand the basic of Design.',
  "You don't understand how to use design thinking process to solve problems in a real-life situation",
]

export const Intermediate = () => {
  return (
    <Box py="3rem" bg="brand.purple.500">
      <MainContainer bg="none">
        <SimpleGrid columns={[1, 1, 1, 2]} gap="2.5rem">
          <Img display={['none', 'none', 'none', 'block']} rounded="8px" src="/assets/images/masterclass/intermediate.jpg" />

          <Center>
            <Box>
              <Heading fontSize={["6xl", "6xl", "7xl"]}  color="brand.white">
                Intermediate Class
              </Heading>
              <Text fontSize={["2xl", "2xl", "3xl"]}  color="brand.gray.200">
                This class is for those with the following criteria:
              </Text>

              <VStack spacing="1.25rem" mt="2.5rem">
                {lists.map((list) => (
                  <Grid
                    w="full"
                    key={list}
                    templateColumns="30px 1fr"
                    gap="1rem"
                    alignItems="center"
                  >
                    <Icon
                      as={BsFillCheckCircleFill}
                      fontSize="2rem"
                      color="brand.white"
                    />

                    <Text color="brand.gray.200" fontSize={["xl", "xl", "2xl"]}>{list}</Text>
                  </Grid>
                ))}
              </VStack>

              <Heading fontSize={["xl", "xl", "2xl"]} color="brand.gray.200" mt="3rem">
                IMPORTANT INFORMATION:
              </Heading>

              <Text fontSize={["xl", "xl", "2xl"]} color="brand.gray.200" mt="1rem">
                Anyone who registers for this masterclass automatically have
                access to 25% discount of Perxels paid training
              </Text>

              <HStack flexDir={["column", "row"]} mt="1.875rem" gap={["2rem", "0"]} spacing={["0", "2rem"]}>
                <Button bg="brand.yellow.500" color="brand.purple.500" _hover={{ bg: "brand.yellow.700" }} h="3.875rem">Join Basic Class</Button>
                <Button
                  h="3.875rem"
                  variant="link"
                  rightIcon={<BsArrowRightCircle />}
                  color="brand.yellow.500"
                  _hover={{ color: "brand.yellow.700" }}
                >
                  Download Project
                </Button>
              </HStack>
            </Box>
          </Center>

          <Img display={['block', 'block', 'block', 'none']} rounded="8px" src="/assets/images/masterclass/intermediate.jpg" />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
