import React, { useMemo } from 'react'
import {
  Box,
  Text,
  Flex,
  Heading,
  VStack,
  HStack,
  Center,
  Img,
} from '@chakra-ui/react'
import { FaBehance, FaLinkedin, FaTwitter } from 'react-icons/fa'
import { MainContainer } from '../../layouts'
import { useRouter } from 'next/router'
import { studentWorkDetails } from '../../constant/studentWorks'

type ObjectKey = keyof typeof studentWorkDetails

export const CaseHero = () => {
  const { query } = useRouter()

  const studentData = useMemo(() => {
    const student = query.name as ObjectKey
    const data = studentWorkDetails[student]

    return data
  }, [query])

  return (
    <Box bg="brand.dark.200">
      <MainContainer
        noMobilePadding
        bg={`url(/assets/images/sudent-work/studentHeroBg.svg) center/cover no-repeat`}
      >
        <Box pos="relative" py={['0', '0', '0', '4rem']}>
          <Flex
            flexDirection={{ base: 'column-reverse', md: 'row' }}
            justifyContent="space-between"
            alignItems={['flex-start', 'center']}
          >
            <Box
              pl={['1.25rem', 0]}
              transform={['translate(0, -50%)', 'translate(0, 0)']}
              pos={['absolute', 'absolute', 'absolute', 'static']}
              bottom="0"
            >
              <Heading
                as="h2"
                fontSize={{ base: '3.200625rem', md: '5.1675rem' }}
                lineHeight={{ base: '3.5rem', md: '5.7rem' }}
                color="brand.white"
                textTransform="uppercase"
                maxW="528px"
              >
                {studentData?.projectName}
              </Heading>
              <Text
                fontSize={{ base: '1.125rem', md: '1.25rem' }}
                color="#E3E4E6"
              >
                Designed by:
              </Text>
              <Text
                fontSize="1.875rem"
                color="brand.yellow.300"
                fontWeight="bold"
                mt={2}
              >
                {studentData?.name}
              </Text>
              <Flex flexDirection={['row', 'column']} gap={5} mt={5}>
                <HStack
                  spacing={'0.625rem'}
                  as="a"
                  target="_blank"
                  href={studentData?.linkedin?.link}
                >
                  <Center
                    w={10}
                    h={10}
                    borderRadius="50%"
                    backgroundColor="#F3F3F3"
                    color="brand.dark.200"
                    fontSize={'0.875rem'}
                  >
                    <FaLinkedin />
                  </Center>
                  <Text
                    fontSize={{ base: '1.125rem', md: '1rem' }}
                    color="#E3E4E6"
                    display={['block']}
                    textDecoration="underline"
                  >
                    {studentData?.linkedin?.name}
                  </Text>
                </HStack>
                {studentData?.twitter && (
                  <HStack
                    spacing={'0.625rem'}
                    as="a"
                    href={studentData?.twitter?.link}
                  >
                    <Center
                      w={10}
                      h={10}
                      borderRadius="50%"
                      backgroundColor="#F3F3F3"
                      color="brand.dark.200"
                      fontSize={'0.875rem'}
                    >
                      <FaTwitter />
                    </Center>
                    <Text
                      fontSize={{ base: '1.125rem', md: '1rem' }}
                      color="#E3E4E6"
                      display={['none', 'block']}
                    >
                      {studentData?.twitter?.name}
                    </Text>
                  </HStack>
                )}
                {studentData?.behance && (
                  <HStack
                    spacing={'0.625rem'}
                    as="a"
                    href={studentData?.behance?.link}
                  >
                    <Center
                      w={10}
                      h={10}
                      borderRadius="50%"
                      backgroundColor="#F3F3F3"
                      color="brand.dark.200"
                      fontSize={'0.875rem'}
                    >
                      <FaBehance />
                    </Center>
                    <Text
                      fontSize={{ base: '1.125rem', md: '1rem' }}
                      color="#E3E4E6"
                      display={['none', 'block']}
                    >
                      {studentData?.behance?.name}
                    </Text>
                  </HStack>
                )}
              </Flex>
            </Box>
            <Box>
              <Img
                src="/assets/images/class-work/arrow.svg"
                alt="arrow"
                position={'absolute'}
                top={'55%'}
                transform={'translate(-70%, -10%)'}
                display={{ base: 'none', md: 'block' }}
                rounded="10px"
              />
            </Box>
            <Box
              h={['782px', '633px', '633px']}
              w={{ base: 'full', lg: '50%' }}
              bg={{
                base: `linear-gradient(360deg, #000000 23.68%, rgba(0, 0, 0, 0) 106.41%), url(${studentData?.heroImg}) center/cover no-repeat`,
                lg: `none`,
              }}
              boxShadow={{
                base: 'none',
                md: '-7px -9px 0px 0px rgba(253,232,92,1)',
                lg: 'none',
              }}
            >
              <Box
                display={['block', 'block', 'block', 'none']}
                boxSize={{ base: '100%', md: '100%' }}
                borderRadius="10px"
              ></Box>

              <Img
                display={['none', 'none', 'none', 'block']}
                src={studentData?.heroImg}
                alt="student work"
                objectFit="cover"
              />
            </Box>
          </Flex>
          <Box>
            <Center mt="2rem">
              <Img
                src="/assets/images/class-work/bottomArrow.png"
                alt="arrow"
              />
            </Center>
          </Box>
        </Box>
      </MainContainer>
    </Box>
  )
}
