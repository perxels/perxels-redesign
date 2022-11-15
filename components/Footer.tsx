import {
  Box,
  Button,
  Center,
  Flex,
  Grid,
  GridItem,
  Heading,
  HStack,
  Icon,
  Link,
  SimpleGrid,
  Text,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { FooterSocialLinks, links } from '../constant'
import { MainContainer } from '../layouts'
import Logo from './Logo'

const Footer = () => {
  return (
    <MainContainer bg="brand.dark.200">
      <Box py="1.875rem">
        <Flex
          bg="brand.purple.500"
          px="3rem"
          py="1.5rem"
          borderRadius="10px"
          alignItems="center"
          justifyContent="space-between"
          display={['none', 'none', 'none', 'flex']}
        >
          <Text fontSize="4xl" color="brand.white" fontWeight="bold">
            Want to transition into Design?
          </Text>

          <Button variant="rounded-solid">Enroll Now</Button>
        </Flex>

        {/* links */}
        <Grid
          display={['none', 'none', 'none', 'grid']}
          mt="4.125rem"
          templateColumns="repeat(6, 1fr)"
          gap={6}
        >
          <GridItem colSpan={3} w="100%">
            <Logo color="white" />

            <Text
              mt="0.75rem"
              color="brand.white"
              fontSize="0.875rem"
              lineHeight="1.5rem"
              fontWeight="400"
              maxW="366px"
            >
              At Perxels, our primary aim is to equip you with core design
              skills and soft skills needed to become a more proficient
              designer, navigate through the job market and advance in your
              career.
            </Text>

            <Flex alignItems="center" gap="0.75rem" mt="1.875rem">
              {FooterSocialLinks.map(({ name, url, icon }) => (
                <a key={name} href={url} target="_blank" rel="noreferrer">
                  <Center
                    w="1.875rem"
                    h="1.875rem"
                    bg="brand.white"
                    rounded="full"
                    _hover={{ bg: 'brand.yellow.500' }}
                  >
                    <Icon
                      as={icon}
                      w="0.875rem"
                      h="0.875rem"
                      fontSize="0.875rem"
                      color="brand.purple.500"
                    />
                  </Center>
                </a>
              ))}
            </Flex>
          </GridItem>
          {links.map(({ title, links }) => (
            <GridItem key={title} colSpan={1} w="100%">
              <Text color="brand.white" fontSize="1.125rem" fontWeight="bold">
                {title}
              </Text>

              <VStack mt="1.5rem" spacing="1.25rem">
                {links.map(({ name, url }) => (
                  <Link w="full" key={name} href={url}>
                    <Text
                      w="full"
                      textAlign="left"
                      fontSize="0.875rem"
                      color="brand.white"
                      _hover={{ color: 'brand.yellow.500' }}
                    >
                      {name}
                    </Text>
                  </Link>
                ))}
              </VStack>
            </GridItem>
          ))}
        </Grid>

        {/* mobile cta */}
        <VStack display={['flex', 'flex', 'flex', 'none']} spacing="1.25rem">
          <Heading
            textAlign="center"
            fontSize={['3xl', '4xl']}
            color="brand.white"
          >
            Want to transition into Design?
          </Heading>

          <Button variant="rounded-solid-yellow-with-outline">Enroll Now</Button>
        </VStack>

        <SimpleGrid
          display={['grid', 'grid', 'grid', 'none']}
          mt="2.5rem"
          columns={2}
          gap="2rem"
        >
          <VStack>
            <Text
              fontSize="1rem"
              fontWeight="400"
              color="#aaa"
              textTransform="uppercase"
              textAlign="center"
            >
              Pages
            </Text>

            <Link w="full">
              <Text
                w="full"
                fontSize={['md', 'xl', '2xl']}
                textAlign="center"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Class Plans
              </Text>
            </Link>
            <Link w="full">
              <Text
                w="full"
                fontSize={['md', 'xl', '2xl']}
                textAlign="center"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Be a Partner
              </Text>
            </Link>
          </VStack>
          <VStack>
            <Text
              fontSize="1rem"
              fontWeight="400"
              color="#aaa"
              textTransform="uppercase"
              textAlign="center"
            >
              Contact
            </Text>

            <Link w="full">
              <Text
                w="full"
                fontSize={['md', 'xl', '2xl']}
                textAlign="center"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                perxels@gmail.com
              </Text>
            </Link>
            <Link w="full">
              <Text
                w="full"
                fontSize={['md', 'xl', '2xl']}
                textAlign="center"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                +234 801 234 5678
              </Text>
            </Link>
          </VStack>
        </SimpleGrid>

        <HStack
          display={['flex', 'flex', 'flex', 'none']}
          justifyContent="space-between"
          mt="4rem"
        >
          <Logo color="white" width="107px" height="29.32px" />

          <Flex alignItems="center" gap="0.75rem" mt="1.875rem">
            {FooterSocialLinks.map(({ name, url, icon }) => {
              if (name !== 'WhatsApp') {
                return (
                  <a key={name} href={url} target="_blank" rel="noreferrer">
                    <Center
                      w="1.875rem"
                      h="1.875rem"
                      bg="brand.white"
                      rounded="full"
                    >
                      <Icon
                        as={icon}
                        w="0.875rem"
                        h="0.875rem"
                        fontSize="0.875rem"
                        color="brand.purple.500"
                      />
                    </Center>
                  </a>
                )
              }
            })}
          </Flex>
        </HStack>

        <Text
          textAlign="center"
          fontSize="0.875rem"
          mt={["3.125rem", "3.125rem", "5rem"]}
          mb="1.5rem"
          color="brand.white"
        >
          © Perxels 2022, All Rights Reserved.
        </Text>
      </Box>
    </MainContainer>
  )
}

export default Footer
