import React from 'react'
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

const lists: string[] = [
    'Submission starts 20th of march and ends 3rd of April at 11:59.',
    'Submit your designs for evaluation by the judges via the submission link..',
    "Post your design on twitter before the deadline.",
    "Use the following hashtag #perxels #productrevamp #jambwebsiteredesign #perxelsdesignchallenge #uiuxdesign.",
    "Engagements (ie likes, retweets) on any post will add to the points given by the judges."
  ]
  

export const Submission = () => {
  return (
    <Box
      pt="15rem"
      pb="3rem"
      bg="brand.purple.500"
      bgImage={"url('/assets/images/designChallenge/graphbg.svg')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
      position="relative"
    >
        <Box
        position="absolute"
    top="0"
        transform={"translateX(0%) translateY(-35.5%)"}
        >
            <Image src="/assets/images/designChallenge/submissionTopBorder.png" alt="" />
        </Box>
      <MainContainer bg="none">
        <SimpleGrid columns={[1, 1, 1, 2]} gap="2.5rem">
          <Img
            display={['none', 'none', 'none', 'block']}
            rounded="8px"
            src="/assets/images/designChallenge/submissionImage.png"
          />

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

          <Img
            display={['block', 'block', 'block', 'none']}
            rounded="8px"
            src="/assets/images/designChallenge/submissionImage.png"
          />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
