import {
  Box,
  Button,
  Flex,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
} from '@chakra-ui/react'
import React from 'react'
import { IoMdArrowForward } from 'react-icons/io'
import { MainContainer } from '../../layouts'

export const SponsorHero = () => {
  return (
    <MainContainer>
      <SimpleGrid py={["3rem", "3rem", "3rem", "0", "0"]} columns={[1, 1, 1, 2]} gap="3rem" w="full" h={["auto", "auto", "auto", "auto", "100vh"]}>
        <Flex flexDir="column" justifyContent="center" w="full" h="full">
          <HStack
            as="span"
            w="auto"
            maxW={["260px", "300px", "300px", "362px"]}
            bg="brand.purple.100"
            p="4px"
            rounded="1rem"
          >
            <Box
              fontSize={["0.65rem", "sm", "sm", "lg"]}
              fontWeight="500"
              as="span"
              bg="brand.white"
              rounded="1rem"
              px="10px"
              py="2px"
            >
              We’re sponsoring!
            </Box>
            <HStack spacing="4px">
              <Box fontSize={["0.65rem", "sm", "sm", "lg"]} fontWeight="500" as="span" px="10px" py="2px">
                Join our design class
              </Box>
              <Icon as={IoMdArrowForward} />
            </HStack>
          </HStack>

          <Heading
            fontSize={["6xl", "6xl", "6xl", "8xl"]}
            fontWeight="700"
            mt="1.25rem"
            color="brand.dark.300"
          >
            Get 20% Off from October Cohort Tuition Fee.
          </Heading>

          <Text fontSize={["lg", "lg", "lg", "xl"]} color="brand.dark.200" maxW="500px" mt="1.25rem">
            100 undergraduates will receive 50% scholarship and 100
            professionals will receive 25% scholarship. 100 undergraduates will
            receive 50% scholarship.
          </Text>

          <Button h="3.125rem" px="3.875rem" maxW="212px" mt="2rem">
            Apply Now
          </Button>
        </Flex>

        <Box pos="relative" mb={["2rem", "2rem", "2rem", "0"]}>
            <Img 
                src="./assets/images/sponsorship/sponsorHero.png"
                alt="sponsor hero"
                w="full"
                h="auto"
                pos={["static", "static", "static", "absolute"]}
                right="-6rem"
            />
        </Box>
      </SimpleGrid>
    </MainContainer>
  )
}
