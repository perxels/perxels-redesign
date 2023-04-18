import {
    Box,
    Button,
    Center,
    Grid,
    GridItem,
    Heading,
    Img,
    List,
    ListIcon,
    ListItem,
    SimpleGrid,
    Text,
    VStack,
    HStack,
    keyframes,
  
  } from '@chakra-ui/react'
  import Link from 'next/link'
  import React from 'react'
  import { BsFillCheckCircleFill } from 'react-icons/bs'
  import { MotionPlanInterface } from '../../constant'
  import { useRouter } from 'next/router'
  import { useState } from 'react'
  // added class details props
  
  const glow = keyframes`
    
    0% {
      background-color: #ddddff;
    }
    50% {
      background-color: #F6F7FD;
    }
    100% {
      background-color: #ddddff;
    }
  
  `
  
  export const MotionClassCard = ({
    title,
    classDur,
    classTime,
    installments,
    tuition,
    courseOutline,
    id,
  }: MotionPlanInterface) => {
    const [tabState, setTabState] = useState('virtual')
    return (
      <SimpleGrid id={id} columns={[1, 1, 1, 12]}>
        <GridItem colSpan={[1, 1, 1, 4]}>
          <Box
            px={['0.75rem', '0.75rem', '0.75rem', '1.875rem']}
            py="1.5rem"
            bg="brand.dark.200"
            roundedTopLeft="8px"
          >
            <Heading
              as="span"
              fontSize={['2rem', '2rem', '2rem', '2.8rem']}
              color="brand.white"
              pos="relative"
            >
              {title}
              <Img
                pos="absolute"
                top={['-8px', '-8px', '-8px', '0']}
                right="-2rem"
                src="/assets/icons/class-icon.svg"
              />
            </Heading>
          </Box>
  
           
           
  
          <Box
            px={['.75rem', '.75rem', '.75rem', '1.875rem']}
            py="1.5rem"
            pb="2.3rem"
          >
            <Grid
              templateColumns={[
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                'repeat(2, 1fr)',
                '100%',
              ]}
              gap={['.75rem']}
              w="full"
            >
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Course Duration:
                </Text>
                <Heading
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                >
                  {classDur}
                </Heading>
              </VStack>
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Class times:
                </Text>
                <Heading
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                >
                  {classTime}
                </Heading>
              </VStack>
              
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Installments:
                </Text>
               {installments.map((installment) => (
                    <Heading
                      key={installment}
                      color="brand.dark.200"
                      textTransform="uppercase"
                      w="full"
                      fontSize={['lg', 'lg', 'lg', '2xl']}
                    >
                      {installment}
                    </Heading>
                  ))
               }
            
              </VStack>
  
         
              <GridItem colSpan={[2, 2, 2, 1]}>
                <VStack spacing="5px">
                  <Text
                    w="full"
                    fontSize={['lg', 'lg', 'lg', '2xl']}
                    color="brand.gray.200"
                  >
                    Tuition:
                  </Text>
                  <Heading color="brand.dark.200" w="full" fontSize={['6xl', '6xl', '7xl']}>
                    {tuition}
                  </Heading>
                </VStack>
              </GridItem>
            </Grid>
  
            <Button
              mt="2.188rem"
              size="lg"
              px="4.375rem"
              py="1.5rem"
              fontSize="2xl"
              display={['none', 'none', 'none', 'inline-block']}
              as={Link}
              href={'/signup'}
              bg="brand.yellow.300"
              color="brand.dark.200"
            >
              Enroll For This Plan
            </Button>
          </Box>
        </GridItem>
        <GridItem
          colSpan={[1, 1, 1, 8]}
         
          px={['.75rem', '.75rem', '.75rem', '3.5rem']}
          py={['2.5rem', '2.5rem', '2.5rem', '3.75rem']}
        >
          <List spacing="1.875rem">
            {courseOutline.map((outline) => (
              <Grid
                templateColumns={[
                  '1.5rem 1fr',
                  '1.5rem 1fr',
                  '1.5rem 1fr',
                  '30px 1fr',
                ]}
                gap={['0.75rem', '1.125rem']}
                alignItems="center"
                key={outline}
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.dark.200"
              >
                <ListIcon
                  as={BsFillCheckCircleFill}
                  fontSize={['1.5rem', '1.5rem', '1.5rem', '1.875rem']}
                  color="#D2D2D2"
                />
                {outline}
              </Grid>
            ))}
          </List>
  
          <Box>
            <Button
              mt="2.188rem"
              size="lg"
              px="4.375rem"
              py="1.5rem"
              fontSize="2xl"
              as={Link}
              href={'/signup'}
              bg="brand.yellow.300"
              color="brand.dark.200"
              display={['inline-block', 'inline-block', 'inline-block', 'none']}
            >
              Enroll For This Plan
            </Button>
          </Box>
        </GridItem>
      </SimpleGrid>
    )
  }
  