import {
  Box,
  Center,
  Container,
  Flex,
  GridItem,
  Heading,
  Icon,
  Img,
  SimpleGrid,
  VStack,
} from '@chakra-ui/react'
import React from 'react'
import { BsFillPlayFill } from 'react-icons/bs'
import { MainContainer } from '../../layouts'

export const Hero = () => {
  return (
    <Box w="full" bg={`url(./assets/images/heroBg.png) center/cover no-repeat`}>
      <MainContainer bg="none">
        <SimpleGrid py="2.5rem" columns={[1, 1, 1, 12]} spacing="2.5rem">
          <GridItem
            h="full"
            colSpan={[1, 1, 1, 5]}
            pt={['3rem', '3rem', '3rem', 0]}
          >
            <Flex
              pos="relative"
              h="full"
              flexDir="column"
              justifyContent="center"
            >
              <Img
                src="/assets/icons/arrow_erica.svg"
                width="157px"
                height="auto"
                pos="absolute"
                right="2rem"
                top="5rem"
                display={['none', 'none', 'none', 'block']}
              />

              <Img
                src="/assets/icons/arrow_mhiz.svg"
                width="157px"
                height="auto"
                pos="absolute"
                right="8rem"
                top="19rem"
                display={['none', 'none', 'none', 'block']}
              />
              <Heading
                w="full"
                fontSize={['lg', 'lg', 'xl']}
                fontWeight="600"
                textTransform="uppercase"
              >
                Enroll Page
              </Heading>
              <Heading
                maxW="505px"
                fontSize={['3rem', '3rem', '3.5rem']}
                fontWeight="black"
                lineHeight={1.15}
              >
                Building Top Designers for the World.
              </Heading>

              <Heading
                w="full"
                fontSize={['lg', 'lg', 'xl']}
                pt="1.5rem"
                fontWeight="600"
                textTransform="uppercase"
              >
                TRAINED
              </Heading>
              <Heading
                w="full"
                fontSize={['5.625rem', '5.625rem', '7.5rem']}
                lineHeight={1.2}
                color="brand.purple.300"
                fontWeight="black"
              >
                3000+
              </Heading>
            </Flex>
          </GridItem>

          <GridItem h="full" colSpan={[1, 1, 1, 7]}>
            <Box
              roundedLeft="10px"
              overflow="hidden"
              mr={['0', '0', '0', '0', '-6rem', '0']}
              pos="relative"
            >
              <Center
                w="full"
                h="full"
                rounded={['10px', '10px', '10px', 0]}
                roundedLeft="8px"
                pos="absolute"
                top="0"
                left="0"
                bg="brand.overlay.200"
                cursor="pointer"
              >
                <Center
                  w={['2.5rem', '2.5rem', '2.5rem', '3.25rem']}
                  h={['2.5rem', '2.5rem', '2.5rem', '3.25rem']}
                  rounded="full"
                  bg="brand.white"
                >
                  <Icon
                    as={BsFillPlayFill}
                    fontSize="1.5rem"
                    color="brand.purple.500"
                  />
                </Center>
                <Heading
                  textTransform="uppercase"
                  fontSize={['1rem', '1.125rem']}
                  color="brand.white"
                  maxW={['125px', '145px']}
                  ml="0.7rem"
                >
                  Our Students In Action
                </Heading>
              </Center>
              <video
                width="100%"
                height="auto"
                loop={true}
                autoPlay={true}
                controls={false}
                muted
              >
                <source
                  src="https://res.cloudinary.com/dhqvopvj4/video/upload/v1672846839/perxels/enrol_dgzjky.mp4"
                  type="video/mp4"
                />
                Your browser does not support the video tag.
              </video>
            </Box>
          </GridItem>
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
