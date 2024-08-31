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
  List,
  UnorderedList,
  ListItem,
} from '@chakra-ui/react'
import React, { useEffect } from 'react'
import { BsArrowRightCircle, BsFillCheckCircleFill } from 'react-icons/bs'
import { ListWrapper } from '../../components'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import { MasterClass } from '../../utils/types'
import { formatDate, formatTime } from '../../utils'
gsap.registerPlugin(ScrollTrigger)

export const Basic = ({
  title,
  dateTime,
  content1,
  content2,
  content3,
  importantInfo,
  entries,
  image,
}: MasterClass) => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.basicGrid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.basicGrid',
        },
      })
    })

    return () => ctx.revert()
  }, [])
  return (
    <Box
      py="3rem"
      pt="1rem"
      backgroundImage={"url('/assets/images/hire/bgPatternYellow.png')"}
      backgroundRepeat="repeat"
      backgroundSize={'cover'}
    >
      <MainContainer bg="none">
        <SimpleGrid className="basicGrid" columns={[1, 1, 1, 2]} gap="2.5rem">
          <Center>
            <Box>
              <Heading fontSize={['6xl', '6xl', '7xl']} color="brand.dark.200">
                {title}
              </Heading>
              <Flex
                bg="rgba(227, 113, 156, 0.3)"
                rounded="6.25rem"
                display="inline-flex"
                padding=".4375rem .875rem"
                columnGap="1.25rem"
                mb="0.5rem"
              >
                <HStack columnGap="5px" alignItems="center">
                  <Img src="/assets/icons/masterBasicCalender.svg" alt="" />
                  <Text
                    fontSize={['0.75rem', '.9375rem']}
                    color="brand.dark.200"
                    fontWeight="700"
                  >
                    {formatDate(dateTime)}
                  </Text>
                </HStack>
                <HStack>
                  <Img src="/assets/icons/masterBasicClock.svg" alt="" />
                  <Text
                    fontSize={['0.75rem', '.9375rem']}
                    color="brand.dark.200"
                    fontWeight="700"
                  >
                    {formatTime(dateTime)}
                  </Text>
                </HStack>
              </Flex>
              {/* <Text fontSize={['2xl', '2xl', '3xl']} color="brand.gray.500">
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
                      color="brand.purple.500"
                    />

                    <Text fontSize={['xl', 'xl', '2xl']} color="brand.gray.500">{list}</Text>
                  </Grid>
                ))}
              </VStack> */}
              <Heading
                fontSize={['xl', 'xl', '2xl']}
                color="brand.gray.500"
                mt="3rem"
              >
                Please note the following:
              </Heading>
              <UnorderedList>
                <ListItem>
                  <Text
                    fontSize={['xl', 'xl', '2xl']}
                    color="brand.gray.500"
                    mt="1rem"
                  >
                    {content1}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text
                    fontSize={['xl', 'xl', '2xl']}
                    color="brand.gray.500"
                    mt="1rem"
                  >
                    {content2}
                  </Text>
                </ListItem>
                <ListItem>
                  <Text
                    fontSize={['xl', 'xl', '2xl']}
                    color="brand.gray.500"
                    mt="1rem"
                  >
                    {content3}
                  </Text>
                </ListItem>
              </UnorderedList>
              {/* <Text
                fontSize={['xl', 'xl', '2xl']}
                color="brand.gray.500"
                mt="1rem"
              >
                You automatically get 15% discount off Perxels paid training on registering for the masterclass
             
              </Text> */}
              <Heading
                fontSize={['xl', 'xl', '2xl']}
                color="brand.gray.500"
                mt="3rem"
              >
                IMPORTANT INFORMATION:
              </Heading>

              <Text
                fontSize={['xl', 'xl', '2xl']}
                color="brand.gray.500"
                mt="1rem"
              >
                {/* You automatically get 15% discount off Perxels paid training on registering for the masterclass */}
                {importantInfo}
              </Text>

              <HStack
                mt="1.875rem"
                gap={['1rem', '0']}
                spacing={['0', '2rem']}
                flexWrap="wrap"
                rowGap="2rem"
              >
                <Button
                  px={['1.25rem', '1.5rem', '2.5rem']}
                  h={['3.5rem', '3.5rem', '3.875rem']}
                  as={'a'}
                  isDisabled={entries === 'receiving' ? false : true}
                  href={entries === 'receiving' ? '/masterclass/register' : '#'}
                >
                  Join this Class
                </Button>
                <Button
                  px={['1.25rem', '1.5rem', '2.5rem']}
                  h={['3.5rem', '3.5rem', '3.875rem']}
                  variant="link"
                  rightIcon={<BsArrowRightCircle />}
                  as="a"
                  href="/assets/files/PERXELS_MASTERCLASS(BEGINNER).pdf"
                >
                  Download Project
                </Button>
              </HStack>
            </Box>
          </Center>

          <Img src={image} />
        </SimpleGrid>
      </MainContainer>
    </Box>
  )
}
