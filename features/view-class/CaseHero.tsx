import React from 'react'
import {
  Box,
  Text,
  Flex,
  Image,
  Heading,
  VStack,
  HStack,
  Center,
} from '@chakra-ui/react'
import { FaBehance, FaLinkedin, FaTwitter } from 'react-icons/fa'

export const CaseHero = () => {
  return (
    <Box
      backgroundImage={'url(assets/images/class-work/heroBg.png)'}
      backgroundColor={'#1E1E1E'}
      bgRepeat={'no-repeat'}
      bgSize={'cover'}
      p={{ base: '20 4', md: '5.25rem 6.35rem' }}
      pos="relative"
    >
      <Flex
        flexDirection={{ base: 'column-reverse', md: 'row' }}
        justifyContent="space-between"
        alignItems={['flex-start', 'center']}
      >
        <Box
        pl={["1.25rem", 0]}
        transform={["translate(0, -50%)", "translate(0, 0)"]}
        >
          <Heading
            as="h2"
            fontSize={{ base: '3.200625rem', md: '5.1675rem' }}
            lineHeight={{ base: '3.5rem', md: '5.7rem' }}
            color="brand.white"
          >
            SAVINGS <br /> APPLICATION
          </Heading>
          <Text fontSize={{ base: '1.125rem', md: '1.25rem' }} color="#E3E4E6">
            Designed by:
          </Text>
          <Text
            fontSize="1.875rem"
            color="brand.yellow.300"
            fontWeight="bold"
            mt={2}
          >
            Mosope Aderibigbe
          </Text>
          <Flex flexDirection={[ "row", "column"]} gap={5} mt={5}>
            <HStack spacing={'0.625rem'}>
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
              <Text fontSize={{ base: '1.125rem', md: '1rem' }} color="#E3E4E6" display={["none", "block"]}>
                Mosope Aderibigbe
              </Text>
            </HStack>
            <HStack spacing={'0.625rem'}>
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
              <Text fontSize={{ base: '1.125rem', md: '1rem' }} color="#E3E4E6" display={["none", "block"]}>
                Mosope Aderibigbe
              </Text>
            </HStack>
            <HStack spacing={'0.625rem'}>
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
              <Text fontSize={{ base: '1.125rem', md: '1rem' }} color="#E3E4E6" display={["none", "block"]}>
                Mosope Aderibigbe
              </Text>
            </HStack>
          </Flex>
        </Box>
        <Box>
          <Image
            src="assets/images/class-work/arrow.svg"
            alt="arrow"
            position={'absolute'}
            transform={'translate(-70%, -10%)'}
            display={{ base: 'none', md: 'block' }}
          />
        </Box>
        <Box
          h={['782px', '633px', '633px']}
          w={{ base: 'full', lg: '50%' }}
          bg={{
            base: `linear-gradient(360deg, #000000 23.68%, rgba(0, 0, 0, 0) 106.41%), url(assets/images/class-work/heroImg.png) center/cover no-repeat`,
            lg: `url(assets/images/class-work/heroImg.png) center/cover no-repeat`,
          }}
          boxShadow={{
            base: 'none',
            md: '-7px -9px 0px 0px rgba(253,232,92,1)',
          }}
        >
          <Box boxSize={{ base: '100%', md: '100%' }} borderRadius="10px"></Box>
        </Box>
      </Flex>
      <Box>
        <Center>
          <Image src="assets/images/class-work/bottomArrow.png" alt="arrow" />
        </Center>
      </Box>
    </Box>
  )
}
