import {
  Box,
  Button,
  Center,
  Grid,
  Heading,
  HStack,
  Icon,
  Img,
  SimpleGrid,
  Text,
  VStack,
  Flex,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsArrowRightCircle, BsFillCheckCircleFill } from 'react-icons/bs'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lists: string[] = [
  'Intermediate designers in the design industry looking to expand their knowledge and scale up their skill',
  'You understand the basic of Design.',
  "You don't understand how to use design thinking process to solve problems in a real-life situation",
]

export const Intermediate = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.intermediateGrid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.intermediateGrid',
        },
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <Box
      py="3rem"
     
      bg="brand.purple.500"
      backgroundImage={"url('/assets/images/hire/bgPatternPurple.png')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
        <SimpleGrid className="intermediateGrid" columns={[1, 1, 1, 2]} gap="2.5rem">
          <Img
            display={['none', 'none', 'none', 'block']}
            rounded="8px"
            src="/assets/images/masterclass/intermediate.jpg"
          />

          <Center>
            <Box
           
            >
              <Heading fontSize={['6xl', '6xl', '7xl']} color="brand.white">
                Intermediate Class
              </Heading>
              <Flex
              bg="rgba(253, 232, 92, 0.3)"
              rounded="6.25rem"
              display="inline-flex"
              padding=".4375rem .875rem"
              columnGap="1.25rem"
              mb="0.5rem"
              >
                <HStack
                columnGap="5px"
                alignItems="center"
                >
                  <Img src="/assets/icons/masterInterCalender.svg" alt="" />
                  <Text fontSize={['.9375rem']} color="brand.white" fontWeight="700">
                  22nd April 
                  </Text>
                </HStack>
                <HStack>
                  <Img src="/assets/icons/masterInterClock.svg" alt="" />
                  <Text fontSize={['.9375rem']} color="brand.white" fontWeight="700">
                  5pm - 6pm
                  </Text>
                </HStack>
              </Flex>
              <Text fontSize={['2xl', '2xl', '3xl']} color="brand.white">
                This class is for those with the following criteria:
              </Text>

              <VStack spacing="1.25rem" mt="2.5rem">
                {lists.map((list) => (
                  <Grid
                    w="full"
                    key={list}
                    templateColumns="30px 1fr"
                    gap="1rem"
                    alignItems="center"
                  >
                    <Icon
                      as={BsFillCheckCircleFill}
                      fontSize="2rem"
                      color="brand.white"
                    />

                    <Text color="brand.white" fontSize={['xl', 'xl', '2xl']}>
                      {list}
                    </Text>
                  </Grid>
                ))}
              </VStack>

              <Heading
                fontSize={['xl', 'xl', '2xl']}
                color="brand.white"
                mt="3rem"
              >
                IMPORTANT INFORMATION:
              </Heading>

              <Text
                fontSize={['xl', 'xl', '2xl']}
                color="brand.white"
                mt="1rem"
              >
                You automatically get 15% discount off Perxels paid training on registering for the masterclass,
              </Text>

              <HStack mt="1.875rem" gap={['1rem', '0']} spacing={['0', '2rem']} flexWrap="wrap" rowGap="2rem">
                <Button
                  bg="brand.yellow.500"
                  color="brand.purple.500"
                  _hover={{ bg: 'brand.yellow.700' }}
                  px={['1.25rem', '1.5rem', '2.5rem']}
                  h={['3.5rem', '3.5rem', '3.875rem']}
                  as={'a'}
                  href="/masterclass/register"
                >
                  Join this Class
                </Button>
                <Button
                  px={['1.25rem', '1.5rem', '2.5rem']}
                  h={['3.5rem', '3.5rem', '3.875rem']}
                  variant="link"
                  as="a"
                  rightIcon={<BsArrowRightCircle />}
                  color="brand.yellow.500"
                  _hover={{ color: 'brand.yellow.700' }}
                  href="/assets/files/PERXELS_MASTERCLASS.pdf"
                  
                >
                  Download Project
                </Button>
              </HStack>
            </Box>
          </Center>

          <Img
            display={['block', 'block', 'block', 'none']}
            rounded="8px"
            src="/assets/images/masterclass/intermediate.jpg"
          />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
