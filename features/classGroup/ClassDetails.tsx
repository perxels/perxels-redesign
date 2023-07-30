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
import { ClassGroupDetailsProps } from '../../constant'
import { useRouter } from 'next/router'
import { useState } from 'react'
import {ImLocation2} from 'react-icons/im'
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

export const ClassDetails = ({
  title,
  classDur,
  classTime,
  classType,
  installments,
  tuition,
  courseOutline,
  id,
  isShow,
  isSponsor,
  isTab,
  physicalTuition,
  address,
  branchAddress,
  installmentPhysical,
  classTimePhysical, 
  isAddress
}: ClassGroupDetailsProps) => {
  console.log('isSponsor', isSponsor)
  const [tabState, setTabState] = useState('virtual')
  const [location, setLocation] = useState('lagos')
  const glowAnimation = `${glow} 2s ease-in-out infinite`
  return (
    <SimpleGrid id={id} columns={[1, 1, 1, 12]}>
      <GridItem colSpan={[1, 1, 1, 4]}>
        <Box
          px={['0.75rem', '0.75rem', '0.75rem', '1.875rem']}
          py="1.5rem"
          bg="brand.pink.700"
          roundedTopLeft="8px"
        >
          <Heading
            as="span"
            fontSize={['2rem', '2rem', '2rem', '2.8rem']}
            color="white"
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

        {isTab ? (
          <Box px={['0.75rem', '1.875rem']} py="1rem">
            <HStack
              backgroundColor={'#F6F7FD'}
              w="full"
              borderRadius={'5px'}
              px="0.625rem"
              py="0.6875rem"
            >
              <Button
                w="50%"
                padding="1.375rem 2rem"
                background={tabState === 'virtual' ? '#383084' : '#F6F7FD'}
                color={tabState === 'virtual' ? '#F6F7FD' : '#383084'}
                borderRadius={'5px'}
                onClick={() => {setTabState('virtual'); setLocation('lagos')}}
                cursor="pointer"
                fontWeight={'700'}
                textAlign="center"
                fontSize={'0.9375rem'}
                _hover={{
                  background: '#383084',
                  color: '#F6F7FD',
                }}
                h="62px"
                animation={tabState === 'physical' ? glowAnimation : 'none'}
              >
              ONLINE
              </Button>
              <Button
                w="50%"
                padding="1.375rem 2rem"
                background={tabState === 'physical' ? '#383084' : '#F6F7FD'}
                color={tabState === 'physical' ? '#F6F7FD' : '#383084'}
                borderRadius={'5px'}
                onClick={() => {setTabState('physical'); setLocation('lagos')}}
                cursor="pointer"
                fontWeight={'700'}
                textAlign="center"
                fontSize={'0.9375rem'}
                _hover={{
                  background: tabState === 'physical' ? '#383084' : '#F6F7FD',
                  color: tabState === 'physical' ? '#F6F7FD' : '#383084',
                }}
                h="62px"
                animation={tabState === 'virtual' ? glowAnimation : 'none'}
              >
              PHYSICAL
              </Button>
            </HStack>
          </Box>
        ) : null}
        {
          tabState === 'physical' ? (
              <HStack px={['0.75rem', '1.875rem']}>
                <Button leftIcon={<ImLocation2/>}
                  bg= {location === "lagos" ? "rgba(115, 230, 255, 0.25)" : "#BCC7CA"}
                 fontWeight="400"
                 color="#000000"
                 _hover={{
                  background: 'rgba(115, 230, 255, 0.25)',
                  color: '#000'
                 }}
                 cursor="pointer"
                 fontSize="18px"
                 onClick={() => setLocation("lagos")}
                 >
                  Lagos
                </Button>
                <Button
                leftIcon={<ImLocation2/>}
                bg= {location === "ibadan" ? "rgba(115, 230, 255, 0.25)" : "#BCC7CA"}
                fontWeight="400"
                color="#000000"
                _hover={{
                 background: 'rgba(115, 230, 255, 0.25)',
                 color: '#000'
                }}
                cursor="pointer"
                fontSize="18px"
                onClick={() => setLocation("ibadan")}
                >
                 Ibadan
                </Button>
              </HStack>
          ) : null
        }

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
                {tabState === 'virtual' ?  classTime : classTimePhysical}
              </Heading>
            </VStack>
            <VStack spacing="5px">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Class Type:
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                pr={['1rem', '1rem']}
              >
                  {tabState === 'virtual' ?  "ONLINE" : "PHYSICAL TRAINING"}
              </Heading>
            </VStack>
            {
              isTab ? (
                <VStack spacing="5px">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                {tabState === 'virtual' ? null : 'Address:'}
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                pr={['1rem', '1rem']}
              >
                { tabState === 'physical' && location === 'lagos' ? address :  ( location === 'ibadan' ? branchAddress : null)}
              </Heading>
            </VStack>
              ) : null
            }
            {
              isAddress && (
                <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Address:
                </Text>
                <Heading
                  color="brand.dark.200"
                  textTransform="uppercase"
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  pr={['1rem', '1rem']}
                > 
                  {address}
                </Heading>
              </VStack>
              )
            }
            <VStack spacing="5px">
              <Text
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                color="brand.gray.200"
              >
                Installments:
              </Text>
             {
              tabState === 'virtual' ? (
                installments.map((installment) => (
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
              ):(
                installmentPhysical?.map((installmentPhysical) => (
                  <Heading
                    key={installmentPhysical}
                    color="brand.dark.200"
                    textTransform="uppercase"
                    w="full"
                    fontSize={['lg', 'lg', 'lg', '2xl']}
                  >
                    {installmentPhysical}
                  </Heading>
                ))
              )
             }
            </VStack>

            {isShow ||
              (isSponsor && (
                <GridItem colSpan={[2, 2, 2, 1]}>
                  {/* <Box
                    as="span"
                    rounded="100px"
                    color="#000"
                    maxW="250px"
                    px="1.125rem"
                    py="0.5rem"
                    fontSize="sm"
                    bg="brand.purple.100"
                  >
                    15% discount available for this option
                  </Box> */}
                </GridItem>
              ))}
            <GridItem colSpan={[2, 2, 2, 1]}>
              <VStack spacing="5px">
                <Text
                  w="full"
                  fontSize={['lg', 'lg', 'lg', '2xl']}
                  color="brand.gray.200"
                >
                  Tuition:
                  {" "} {" "}
                  {
                  location === "ibadan" ?
                  (
                 <Text fontSize=".75rem" as="span" padding=".5rem 1.125rem" rounded="15px" bg="#FDF6F6" color="#E3719C" fontWeight="700">
                 Discounted price
                 </Text>
                 ): null
                 }
                </Text>
                <Heading w="full" fontSize={['6xl', '6xl', '7xl']}>
                  {tabState === 'virtual' || location !== 'ibadan' ? (
                    location === 'lagos' && tabState === 'physical' ? '₦210,000' : tuition
                  ) : physicalTuition}
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
            href={isSponsor ? '/sponsorship/signup' : '/signup'}
          >
            {isSponsor ? 'Apply Now' : 'Enroll For This Plan'}
          </Button>
        </Box>
      </GridItem>
      <GridItem
        colSpan={[1, 1, 1, 8]}
        bg="brand.gray.300"
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
                color="brand.purple.500"
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
            display={['inline-block', 'inline-block', 'inline-block', 'none']}
            as={Link}
            href={isSponsor ? '/sponsorship/signup' : '/signup'}
          >
            {isSponsor ? 'Apply Now' : 'Enroll For This Plan'}
          </Button>
        </Box>
      </GridItem>
    </SimpleGrid>
  )
}
