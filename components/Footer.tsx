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

          <Button
            as={Link}
            href="/class-plans"
            _hover={{ textDecor: 'none', bg: 'brand.yellow.500' }}
            bg="brand.white"
            color="brand.purple.500"
          >
            Enroll Now
          </Button>
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
                  <Link
                    target={name === 'Community' ? '_blank' : '_self'}
                    w="full"
                    key={name}
                    href={url}
                  >
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

        {/* mobile cta. */}
        <VStack
          display={['flex', 'flex', 'flex', 'none']}
          alignItems="flex-start"
          spacing="1.25rem"
        >
          <Heading
            textAlign="left"
            fontSize={['4xl', '5xl']}
            maxW="300px"
            color="brand.white"
          >
            Equipping designers to{' '}
            <Box as="span" color="brand.yellow.500">
              {' '}
              solve problems
            </Box>{' '}
            with design.
          </Heading>

          <Box mt="1.5rem" display={['block', 'block', 'block', 'none']}>
           
            <Button
              bg="brand.yellow.500"
              color="brand.purple.500"
              as={Link}
              href="/class-plans"
            >
              Get Started
            </Button>
           
          </Box>
        </VStack>

        <SimpleGrid
          display={['grid', 'grid', 'grid', 'none']}
          mt="2.5rem"
          columns={1}
          gap="1rem"
        >
          <VStack alignItems="flex-start">
            <Text
              fontSize="1rem"
              fontWeight="400"
              color="#aaa"
              textTransform="uppercase"
              textAlign="left"
            >
              Contact
            </Text>

            <Link w="full" target="_blank" href="mailto: perxels@gmail.com">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                perxels@gmail.com
              </Text>
            </Link>
            <Link w="full" target="_blank" href="tel: +2348135369680">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                +2348135369680
              </Text>
            </Link>
          </VStack>
          <VStack alignItems="flex-start">
            <Text
              fontSize="1rem"
              fontWeight="400"
              color="#aaa"
              textTransform="uppercase"
              textAlign="left"
            >
              Pages
            </Text>

            <Link w="full" href="/">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Home
              </Text>
            </Link>
            <Link w="full" href="/testimonials">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Testimonials
              </Text>
            </Link>
            <Link w="full" href="/class-plans">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Enroll now
              </Text>
            </Link>
            <Link w="full" href="/class-plans">
              <Text
                w="full"
                fontSize={['lg', 'xl', '2xl']}
                textAlign="left"
                color="brand.white"
                _hover={{ color: 'brand.yellow.500' }}
              >
                Class Plans
              </Text>
            </Link>
          </VStack>
        </SimpleGrid>

        <VStack
          display={['flex', 'flex', 'flex', 'none']}
          alignItems="flex-start"
          mt="1.5rem"
          spacing="1.5rem"
        >
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

          <Logo color="white" width="107px" height="29.32px" />
        </VStack>

        <Text
          textAlign="left"
          fontSize="lg"
          mt={['3.125rem', '3.125rem', '5rem']}
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
