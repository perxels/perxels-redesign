import React, { useEffect } from 'react'
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
    Image
  } from '@chakra-ui/react'
  import { BsArrowRightCircle, BsFillCheckCircleFill, BsFillPencilFill } from 'react-icons/bs'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

const lists: string[] = [
    'Submission starts 13th of May and ends 27th of May at 11:59PM.',
    'Submit your design on Twitter on/before the deadline and tag Perxels',
    "Use the challenge hashtag #perxelsdesignchallenge ",
    "Engagements (ie likes, retweets) on any post will add to your points ",
  ]
  

export const Submission = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.submitGrid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.submitGrid',
        },
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <Box
      pt={["4rem","15rem"]}
      pb="3rem"
      bg="brand.purple.500"
      bgImage={"url('/assets/images/designChallenge/graphbg.svg')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
      position="relative"
      id="submission"
    >
        <Box
        position="absolute"
        top="0"
        transform={"translateX(0%) translateY(-35.5%)"}
        >
            <Image src="/assets/images/designChallenge/submissionTopBorder.png" alt="" />
        </Box>
      <MainContainer bg="none">
        <SimpleGrid columns={[1, 1, 1, 2]} gap="2.5rem"  className="submitGrid">
          <Box position="relative">
          <Img
            display={['none', 'none', 'none', 'block']}
            rounded="8px"
            src="/assets/images/designChallenge/submissionImage.png"
          />
          <Img 
          position="absolute"
          display={['none', 'none', 'none', 'block']}
          top="0"
          right={"0"}
          transform= {"translateX(25%) translateY(-50%)"}
          src="/assets/images/designChallenge/thumbs.svg" alt=""
          />
          </Box>

          <Center>
            <Box>
            <Box
            bg="#E3719C"
            borderRadius={'30px'}
            padding={'1rem 1.5625rem'}
            display="inline-flex"
            columnGap={'1rem'}
            alignItems="center"
          >
          <Icon
                      as={BsFillPencilFill}
                      fontSize="1.125rem"
                      color="brand.white"
                    />
            <Text fontSize={'18px'} fontWeight="700" color="#FFF">
            Submission Guidelines
            </Text>
          </Box>
              <Heading fontSize={['6xl', '6xl', '2.25rem']} color="brand.white" mt="1.25rem">
              Read the Following Instructions before applying.
              </Heading>
              

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
            </Box>
          </Center>
          
          <Box
          pos="relative"
          >
          <Img
            display={['block', 'block', 'block', 'none']}
            rounded="8px"
            src="/assets/images/designChallenge/submissionImage.png"
          />
          <Img 
          position="absolute"
          display={['block', 'block', 'block', 'none']}
          top="0"
          right={"0"}
          transform= {"translateX(10%) translateY(-50%)"}
          src="/assets/images/designChallenge/thumbs.svg" alt=""
          />
          </Box>

         
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
