import React from 'react'
import { Box, Heading, Text, Flex, Image, Button } from '@chakra-ui/react'
import Link from 'next/link'

export const OnlineClassPlan = ({ sm }: any) => {
  return (
    <Flex
      justifyContent="space-between"
      backgroundColor="#FDE85C"
      padding={
        sm
          ? [
              '3.5625rem 1.0625rem 3.625rem 1.25rem',
              '2.625rem 2.5rem 2rem 2.2rem',
            ]
          : [
              '3.5625rem 1.0625rem 3.625rem 1.25rem',
              '2.625rem 2.5rem 2.375rem 5rem',
            ]
      }
      borderRadius="1.25rem"
      alignItems="center"
    >
      <Box display={['none', 'block']}>
        <Image
          height={sm ? '300px' : 'auto'}
          src="/assets/images/class-group/onlinePerx.png"
          alt=""
        />
      </Box>
      <Box ml={sm ? '25px' : '0'} width={['100%', '50%']}>
        <Heading
          color="#121212"
          fontSize={sm ? ['2.125rem', '2.375rem'] : ['2.125rem', '4.375rem']}
          fontWeight="800"
          lineHeight={
            sm ? ['2.5875rem', '2.4625rem'] : ['2.5875rem', '4.4625rem']
          }
        >
          Explore Our
        </Heading>
        <Heading
          color="#34296B"
          fontSize={sm ? ['2.125rem', '2.375rem'] : ['2.125rem', '4.375rem']}
          fontWeight="800"
          lineHeight={
            sm ? ['2.5875rem', '2.4625rem'] : ['2.5875rem', '4.4625rem']
          }
        >
          Online Classes.
        </Heading>
        <Text
          color="#555555"
          fontSize={['0.9rem', '1.25rem']}
          fontWeight="500"
          lineHeight={['1.1rem', '1.6812rem']}
          mt={sm ? ['.75rem', '1.2rem'] : ['.75rem', '1.875rem']}
        >
          Uncover the world of design through our online classes. Learn,
          collaborate, and design with us, anytime, anywhere.
        </Text>

        <Button
          fontSize=".9375rem"
          mt={['1.6875rem', '1.875rem']}
          as={Link}
          href="/online"
        >
          View Online Class Plans
        </Button>
      </Box>
    </Flex>
  )
}

export const PhysicalClassPlan = ({ sm }: any) => {
  return (
    <Flex
      justifyContent="space-between"
      backgroundColor="#34296B"
      padding={
        sm
          ? [
              '3.5625rem 1.0625rem 3.625rem 1.25rem',
              '2.625rem 2.5rem 2rem 2.2rem',
            ]
          : [
              '3.5625rem 1.0625rem 3.625rem 1.25rem',
              '2.625rem 2.5rem 2.375rem 5rem',
            ]
      }
      borderRadius="1.25rem"
      flexDirection="row-reverse"
      alignItems="center"
    >
      <Box width="45%" display={['none', 'block']}>
        <Image
          height={sm ? '300px' : 'auto'}
          src="/assets/images/class-group/physicalPerx.png"
          alt=""
        />
      </Box>
      <Box ml={sm ? '25px' : '0'} width={['100%', '50%']}>
        <Heading
          color="#FFF"
          fontSize={sm ? ['2.125rem', '2.375rem'] : ['2.125rem', '4.375rem']}
          fontWeight="800"
          lineHeight={
            sm ? ['2.5875rem', '2.4625rem'] : ['2.5875rem', '4.4625rem']
          }
        >
          Explore Our
        </Heading>
        <Heading
          color="#FDE85C"
          fontSize={sm ? ['2.125rem', '2.375rem'] : ['2.125rem', '4.375rem']}
          fontWeight="800"
          lineHeight={
            sm ? ['2.5875rem', '2.4625rem'] : ['2.5875rem', '4.4625rem']
          }
        >
          Physical Classes.
        </Heading>
        <Text
          color="#FFF"
          fontSize={['0.9rem', '1.25rem']}
          fontWeight="500"
          lineHeight={['1.1rem', '1.6812rem']}
          mt={sm ? ['.75rem', '1.2rem'] : ['.75rem', '1.875rem']}
        >
          On our quest to continue expanding and bringing design education to
          your doorstep, we have established a couple of physical learning
          spaces.
        </Text>

        <Button
          fontSize=".9375rem"
          mt={['1.6875rem', '1.875rem']}
          color="#34296B"
          background="#FFF"
          as={Link}
          href="/physical"
        >
          View Physical Class Plans
        </Button>
      </Box>
    </Flex>
  )
}
