import React, { useMemo } from 'react'
import {
  Box,
  Flex,
  Heading,
  Text,
  SimpleGrid,
  Img,
  Center,
  Button,
  Icon,
  Link,
} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import { useRouter } from 'next/router'
import { studentWorkDetails } from '../../constant/studentWorks'
import { BsArrowLeftSquare, BsArrowRightSquare } from 'react-icons/bs'

type ObjectKey = keyof typeof studentWorkDetails

export const CaseStudy = () => {
  const { query } = useRouter()

  const studentData = useMemo(() => {
    const student = query.name as ObjectKey
    const data = studentWorkDetails[student]

    return data
  }, [query])

  return (
    <Box py="3rem" bg="brand.dark.200" overflowX="hidden">
      <MainContainer bg="brand.dark.200">
        <Box maxW="1008px" mx="auto" pos="relative">
          <Img
            src="/assets/images/sudent-work/circle-pattern.svg"
            w="506px"
            h="506px"
            alt="circle pattern"
            pos="absolute"
            left="-350px"
            top="8rem"
            display={['none', 'none', 'block']}
          />
          <Img
            src="/assets/images/sudent-work/circle-pattern.svg"
            w="506px"
            h="506px"
            alt="circle pattern"
            pos="absolute"
            right="-350px"
            top="10rem"
            display={['none', 'none', 'block']}
          />
          <Img
            src="/assets/images/sudent-work/circle-pattern.svg"
            w="506px"
            h="506px"
            alt="circle pattern"
            pos="absolute"
            right="-350px"
            bottom="15rem"
            display={['none', 'none', 'block']}
          />
          <Box rounded="0.75rem" overflow="hidden" w="full">
            <Img
              src={studentData?.workCover?.w1}
              w="full"
              h="auto"
              alt={studentData?.projectName}
            />
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} my={16} py={4}>
            <Box>
              <Heading
                as="h2"
                fontSize={{ base: '2.5rem', md: '2.5rem' }}
                color="brand.white"
                lineHeight={'110%'}
                mb={{ base: 4, md: 6 }}
              >
                Overview
              </Heading>
              <Text
                color="brand.white"
                fontSize="xl"
                fontWeight="normal"
                dangerouslySetInnerHTML={{ __html: studentData?.overview }}
              />
            </Box>
            <Box>
              <Heading
                as="h2"
                fontSize={{ base: '2.5rem', md: '2.5rem' }}
                color="brand.white"
                lineHeight={'110%'}
                mb={{ base: 4, md: 6 }}
              >
                Challenge
              </Heading>
              <Text
                color="brand.white"
                fontSize="xl"
                fontWeight="normal"
                dangerouslySetInnerHTML={{ __html: studentData?.challenge }}
              />
            </Box>
          </SimpleGrid>
          <Box rounded="0.75rem" overflow="hidden">
            <Img
              src={studentData?.workCover?.w2}
              alt={studentData?.projectName}
              w="full"
              h="auto"
            />
          </Box>
          <SimpleGrid columns={{ base: 1, md: 2 }} spacing={20} my={16} px={4}>
            <Box>
              <Heading
                as="h2"
                fontSize={{ base: '2.5rem', md: '2.5rem' }}
                color="brand.white"
                lineHeight={'110%'}
                mb={{ base: 4, md: 6 }}
              >
                Approach
              </Heading>
              <Text
                color="brand.white"
                fontSize="xl"
                fontWeight="normal"
                dangerouslySetInnerHTML={{ __html: studentData?.approach }}
              />
            </Box>
            {studentData?.results && (
              <Box>
                <Heading
                  as="h2"
                  fontSize={{ base: '2.5rem', md: '2.5rem' }}
                  color="brand.white"
                  lineHeight={'110%'}
                  mb={{ base: 4, md: 6 }}
                >
                  Results
                </Heading>

                <Text
                  color="brand.white"
                  fontSize="xl"
                  fontWeight="normal"
                  dangerouslySetInnerHTML={{ __html: studentData?.results }}
                />
              </Box>
            )}
          </SimpleGrid>
          <Box rounded="0.75rem" overflow="hidden">
            <Img
              src={studentData?.workCover?.w3}
              alt={studentData?.projectName}
              w="full"
              h="auto"
            />
          </Box>
          {studentData?.workCover?.w4 && (
            <Box mt="2rem" rounded="0.75rem" overflow="hidden">
              <Img
                src={studentData?.workCover?.w4}
                alt={studentData?.projectName}
                w="full"
                h="auto"
              />
            </Box>
          )}

          <Center gap="1rem" mt="3rem">
            {studentData?.prevLink && (
              <Button
                as={Link}
                href={studentData?.prevLink}
                variant="link"
                color="brand.gray.700"
              >
                <Text display={['none', 'none', 'none', 'block']}>
                  Go to previous project{' '}
                </Text>
                <Icon
                  ml="1rem"
                  as={BsArrowLeftSquare}
                  fontSize="7xl"
                  mr="1rem"
                />
              </Button>
            )}
            {studentData?.nextLink && (
              <Button
                as={Link}
                href={studentData?.nextLink}
                variant="link"
                color="brand.white"
              >
                <Icon
                  mr="1rem"
                  as={BsArrowRightSquare}
                  fontSize="7xl"
                  ml="1rem"
                />
                <Text display={['none', 'none', 'none', 'block']}>
                  Go to next project{' '}
                </Text>
              </Button>
            )}
          </Center>
        </Box>
      </MainContainer>
    </Box>
  )
}
