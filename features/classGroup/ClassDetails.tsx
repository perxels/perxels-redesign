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
  keyframes
} from '@chakra-ui/react'
import Link from 'next/link'
import React from 'react'
import { BsFillCheckCircleFill } from 'react-icons/bs'
import { ClassGroupDetailsProps } from '../../constant'
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
}: ClassGroupDetailsProps) => {
  console.log('isSponsor', isSponsor)
  const router = useRouter()
  const sponsorship = router.query.sponsorship
  const [tabState, setTabState] = useState('virtual')
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
          <Box px={["0.75rem","1.875rem"]} py="1rem">
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
                onClick={() => setTabState('virtual')}
                cursor="pointer"
                fontWeight={'700'}
                textAlign="center"
                fontSize={'0.9375rem'}
                _hover={{
                  background: '#383084',
                  color: '#F6F7FD',
                }}
                h="62px"
              >
                VIRTUAL CLASS
              </Button>
              <Button
                w="50%"
                padding="1.375rem 2rem"
                background={tabState === 'physical' ? '#383084' : '#F6F7FD'}
                color={tabState === 'physical' ? '#F6F7FD' : '#383084'}
                borderRadius={'5px'}
                onClick={() => setTabState('physical')}
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
                PHYSICAL CLASS
              </Button>
            </HStack>
          </Box>
        ) : null}

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
                {tabState === 'virtual' ? 'Class Type:' : 'Address:'}
              </Text>
              <Heading
                color="brand.dark.200"
                textTransform="uppercase"
                w="full"
                fontSize={['lg', 'lg', 'lg', '2xl']}
                pr={['1rem', '1rem']}
              >
                {tabState === 'virtual' ? classType : address}
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
              ))}
            </VStack>

            {isShow ||
              (isSponsor && (
                <GridItem colSpan={[2, 2, 2, 1]}>
                  <Box
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
                  </Box>
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
                </Text>
                <Heading w="full" fontSize={['6xl', '6xl', '7xl']}>
                  {tabState === 'virtual' ? tuition : physicalTuition}
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
