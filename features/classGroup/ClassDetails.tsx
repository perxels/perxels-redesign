import {
  Box,
  Button,
  Grid,
  GridItem,
  Heading,
  Img,
  List,
  ListIcon,
  ListItem,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { ClassGroupDetailsProps } from '../../constant'

export const ClassDetails = ({
  title,
  classDur,
  classTime,
  classType,
  installments,
  tuition,
  courseOutline,
}: ClassGroupDetailsProps) => {
  return (
    <SimpleGrid columns={12}>
      <GridItem colSpan={4}>
        <Box px="1.875rem" py="1.5rem" bg="brand.pink.700" roundedTopLeft="8px">
          <Heading as="span" fontSize="2.8rem" color="white" pos="relative">
            {title}
            <Img
              pos="absolute"
              top="0"
              right="-2rem"
              src="/assets/icons/class-icon.svg"
            />
          </Heading>
        </Box>

        <Box px="1.875rem" py="1.5rem" pb="2.3rem">
          <VStack spacing="1.85rem" w="full">
            <VStack spacing="5px" w="full">
              <Text w="full" fontSize="2xl" color="brand.gray.200">
                Course Duration:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize="2xl"
              >
                {classDur}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text w="full" fontSize="2xl" color="brand.gray.200">
                Class times:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize="2xl"
              >
                {classTime}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text w="full" fontSize="2xl" color="brand.gray.200">
                Class Type:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize="2xl"
              >
                {classType}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text w="full" fontSize="2xl" color="brand.gray.200">
                Installments:
              </Text>
              {installments.map((installment) => (
                <Heading
                  key={installment}
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize="2xl"
                >
                  {installment}
                </Heading>
              ))}
            </VStack>
            <VStack spacing="5px" w="full">
              <Text w="full" fontSize="2xl" color="brand.gray.200">
                Tuition:
              </Text>
              <Heading w="full" fontSize="7xl">
                {tuition}
              </Heading>
            </VStack>
          </VStack>

          <Button
            mt="2.188rem"
            size="lg"
            px="4.375rem"
            py="1.5rem"
            fontSize="2xl"
          >
            Enroll For This Plan
          </Button>
        </Box>
      </GridItem>
      <GridItem colSpan={8} bg="brand.gray.300" px="3.5rem" py="3.75rem">
        <List spacing="1.875rem">
          {courseOutline.map((outline) => (
            <Grid
              templateColumns="30px 1fr"
              gap="1.125rem"
              alignItems="center"
              key={outline}
              fontSize="2xl"
              color="brand.dark.200"
            >
              <ListIcon
                as={BsFillCheckCircleFill}
                fontSize="1.875rem"
                color="brand.purple.500"
              />
              {outline}
            </Grid>
          ))}
        </List>
      </GridItem>
    </SimpleGrid>
  )
}
