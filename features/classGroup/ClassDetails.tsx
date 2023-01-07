import {
  Box,
  Button,
  Center,
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
import Link from 'next/link'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { ClassGroupDetailsProps } from '../../constant'

// added class details props

export const ClassDetails = ({
  title,
  classDur,
  classTime,
  classType,
  installments,
  tuition,
  courseOutline,
  id,
}: ClassGroupDetailsProps) => {
  return (
    <SimpleGrid id={id} columns={[1, 1, 1, 12]}>
      <GridItem colSpan={[1, 1, 1, 4]}>
        <Box
          px={['0.75rem', '0.75rem', '0.75rem', '1.875rem']}
          py="1.5rem"
          bg="brand.pink.700"
          roundedTopLeft="8px"
        >
          <Heading
            as="span"
            fontSize={['2rem', '2rem', '2rem', '2.8rem']}
            color="white"
            pos="relative"
          >
            {title}
            <Img
              pos="absolute"
              top={['-8px', '-8px', '-8px', '0']}
              right="-2rem"
              src="/assets/icons/class-icon.svg"
            />
          </Heading>
        </Box>

        <Box
          px={['.75rem', '.75rem', '.75rem', '1.875rem']}
          py="1.5rem"
          pb="2.3rem"
        >
          <SimpleGrid
            columns={[2, 2, 2, 1]}
            spacing={['.75rem', '.75rem', '.75rem', '1.85rem']}
            w="full"
          >
            <VStack spacing="5px" w="full">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Course Duration:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
              >
                {classDur}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Class times:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
              >
                {classTime}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Class Type:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                pr={['1rem', '5rem']}
              >
                {classType}
              </Heading>
            </VStack>
            <VStack spacing="5px" w="full">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Installments:
              </Text>
              {installments.map((installment) => (
                <Heading
                  key={installment}
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                >
                  {installment}
                </Heading>
              ))}
            </VStack>
            <GridItem colSpan={[2, 2, 2, 1]}>
              <VStack spacing="5px" w="full">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Tuition:
                </Text>
                <Heading w="full" fontSize={['6xl', '6xl', '7xl']}>
                  {tuition}
                </Heading>
              </VStack>
            </GridItem>
          </SimpleGrid>

          <Button
            mt="2.188rem"
            size="lg"
            px="4.375rem"
            py="1.5rem"
            fontSize="2xl"
            display={['none', 'none', 'none', 'block']}
            as={Link}
            href="/enrol"
          >
            Enroll For This Plan
          </Button>
        </Box>
      </GridItem>
      <GridItem
        colSpan={[1, 1, 1, 8]}
        bg="brand.gray.300"
        px={['.75rem', '.75rem', '.75rem', '3.5rem']}
        py={['2.5rem', '2.5rem', '2.5rem', '3.75rem']}
      >
        <List spacing="1.875rem">
          {courseOutline.map((outline) => (
            <Grid
              templateColumns={[
                '1.5rem 1fr',
                '1.5rem 1fr',
                '1.5rem 1fr',
                '30px 1fr',
              ]}
              gap={['0.75rem', '1.125rem']}
              alignItems="center"
              key={outline}
              fontSize={['lg', 'lg', 'lg', '2xl']}
              color="brand.dark.200"
            >
              <ListIcon
                as={BsFillCheckCircleFill}
                fontSize={['1.5rem', '1.5rem', '1.5rem', '1.875rem']}
                color="brand.purple.500"
              />
              {outline}
            </Grid>
          ))}
        </List>

        <Center>
          <Button
            mt="2.188rem"
            size="lg"
            px="4.375rem"
            py="1.5rem"
            fontSize="2xl"
            display={['block', 'block', 'block', 'none']}
            as={Link}
            href="/enrol"
          >
            Enroll For This Plan
          </Button>
        </Center>
      </GridItem>
    </SimpleGrid>
  )
}
