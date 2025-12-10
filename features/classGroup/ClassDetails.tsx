'use client'
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
  HStack,
  Flex,
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { ClassGroupDetailsProps } from '../../constant'
import { useRouter } from 'next/router'
import { useState } from 'react'
import { ImLocation2 } from 'react-icons/im'
import { keyframes } from '@emotion/react'
// added class details props

const glow = keyframes`
  0% {
    background-color: #ddddff;
  }
  50% {
    background-color: #F6F7FD;
  }
  100% {
    background-color: #ddddff;
  }`

export const ClassDetails = ({
  title,
  classDur,
  classTime,
  classType,
  installments,
  tuition,
  courseOutline,
  id,
  isShow,
  isSponsor,
  isTab,
  physicalTuition,
  address,
  branchAddress,
  installmentPhysical,
  classTimePhysical,
  isAddress,
  stateLocation,
  enrolRoute,
  isPhysical,
  isTitleSmall,
}: ClassGroupDetailsProps) => {
  const [tabState, setTabState] = useState('virtual')
  const [location, setLocation] = useState('lagos')
  const glowAnimation = `${glow} 2s ease-in-out infinite`
  const router = useRouter()
  const currentPath = router.pathname
  return (
    <SimpleGrid
      id={id}
      columns={currentPath.includes('/library/courses') ? 1 : [1, 1, 1, 12]}
    >
      <GridItem colSpan={[1, 1, 1, 4]}>
        <Box
          px={['0.75rem', '0.75rem', '0.75rem', '1.875rem']}
          py="1.5rem"
          bg="brand.pink.700"
          roundedTopLeft="8px"
        >
          <Heading
            as="span"
            fontSize={
              isTitleSmall
                ? ['2rem', '2rem', '2rem', '2.5rem']
                : ['2rem', '2rem', '2rem', '2.8rem']
            }
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
          <Grid
            templateColumns={[
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              'repeat(2, 1fr)',
              '100%',
            ]}
            gap={['.75rem']}
            w="full"
          >
            <VStack spacing="5px">
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
            <VStack spacing="5px">
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
                {tabState === 'virtual' ? classTime : classTimePhysical}
              </Heading>
            </VStack>
            <VStack spacing="5px">
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
                pr={['1rem', '1rem']}
              >
                {tabState === 'virtual'
                  ? classType
                    ? classType
                    : 'ONLINE'
                  : 'PHYSICAL TRAINING'}
              </Heading>
            </VStack>
            {isTab ? (
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  {tabState === 'virtual' ? null : 'Address:'}
                </Text>
                <Heading
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  pr={['1rem', '1rem']}
                >
                  {tabState === 'physical' && location === 'lagos'
                    ? address
                    : location === 'ibadan'
                    ? branchAddress
                    : null}
                </Heading>
              </VStack>
            ) : null}
            {address && (
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Address:
                </Text>
                <Heading
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  pr={['1rem', '1rem']}
                >
                  {address}
                </Heading>
              </VStack>
            )}
            <VStack spacing="5px">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Installments:
              </Text>
              {tabState === 'virtual'
                ? installments.map((installment) => (
                    <Heading
                      key={installment}
                      color="brand.dark.200"
                      textTransform="uppercase"
                      w="full"
                      fontSize={['lg', 'lg', 'lg', '2xl']}
                    >
                      {installment}
                    </Heading>
                  ))
                : installmentPhysical?.map((installmentPhysical) => (
                    <Heading
                      key={installmentPhysical}
                      color="brand.dark.200"
                      textTransform="uppercase"
                      w="full"
                      fontSize={['lg', 'lg', 'lg', '2xl']}
                    >
                      {installmentPhysical}
                    </Heading>
                  ))}
            </VStack>

            {isShow ||
              (isSponsor && (
                <GridItem colSpan={[2, 2, 2, 1]}>
                  {/* <Box
                    as="span"
                    rounded="100px"
                    color="#000"
                    maxW="250px"
                    px="1.125rem"
                    py="0.5rem"
                    fontSize="sm"
                    bg="brand.purple.100"
                  >
                    15% discount available for this option
                  </Box> */}
                </GridItem>
              ))}
            <GridItem colSpan={[2, 2, 2, 1]}>
              <Flex flexDir="column" alignItems="flex-start" rowGap="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Tuition:{' '}
                  {/* {
                   stateLocation ==="discount"  ?
                  (
                 <Text fontSize=".75rem" as="span" padding=".5rem 1.125rem" rounded="15px" bg="#FDF6F6" color="#E3719C" fontWeight="700">
                 Discounted price
                 </Text>
                 ): null
                 } */}
                </Text>
                <Flex
                  // justifyContent="flex-start"
                  alignItems="flex-start"
                  columnGap="1.1875rem"
                  flexDirection="column"
                >
                  <Heading
                    fontSize={
                      isSponsor || physicalTuition
                        ? '20px'
                        : ['6xl', '6xl', '7xl']
                    }
                    textDecoration={physicalTuition ? 'line-through' : ' '}
                    color={
                      stateLocation === 'discount' || physicalTuition
                        ? '#9C9C9C'
                        : ' '
                    }
                  >
                    {tabState === 'virtual' || location !== 'ibadan'
                      ? // location === 'lagos' && tabState === 'physical' ? '₦210,000' : ''
                        location === 'lagos' && tabState === 'physical'
                        ? '₦210,000'
                        : tuition
                      : physicalTuition}
                  </Heading>
                  {isSponsor || physicalTuition ? (
                    <>
                      <Heading w="full" fontSize={['6xl', '6xl', '7xl']}>
                        {physicalTuition}
                      </Heading>
                    </>
                  ) : null}
                </Flex>
              </Flex>
            </GridItem>
          </Grid>

          <Button
            mt="2.188rem"
            size="lg"
            px="4.375rem"
            py="1.5rem"
            fontSize="2xl"
            display={['none', 'none', 'none', 'inline-block']}
            as={Link}
            href={
              isSponsor
                ? '/sponsorship/signup'
                : isPhysical
                ? enrolRoute
                : '/signup'
            }
          >
            {isSponsor ? 'Apply Now' : 'Enroll For This Plan'}
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

        <Box>
          <Button
            mt="2.188rem"
            size="lg"
            px="4.375rem"
            py="1.5rem"
            fontSize="2xl"
            display={['inline-block', 'inline-block', 'inline-block', 'none']}
            as={Link}
            w={'99%'}
            textAlign="center"
            href={
              isSponsor
                ? '/sponsorship/signup'
                : isPhysical
                ? enrolRoute
                : '/signup'
            }
          >
            {isSponsor ? 'Apply For Scholarship' : 'Enroll For This Plan'}
          </Button>
        </Box>
      </GridItem>
    </SimpleGrid>
  )
}
