import React from 'react'
import { Box, Flex, Text, Image, Heading } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'

export const Info = () => {
  return (
    <MainContainer>
      <Box>
        <Flex
          flexDir={['column', 'column', 'column', 'row']}
          borderBottom={['2px solid #EAEAEA', '3px solid #EAEAEA']}
          width="100%"
        >
          <Box p="40px">
            <Image
              src="https://res.cloudinary.com/deudl0ryy/image/upload/v1709219109/puzzle_bajdnq.svg"
              alt="heroBg"
              mb="16px"
            />
            <Heading as="h1" fontSize={['24px', '40px']} fontWeight="600">
              Competition style
            </Heading>
            <Text
              mt="1rem"
              minWidth={['100%', '100%', '100%', '540px']}
              fontSize={['16px', '20px']}
              lineHeight="150%"
              color="#1A1A1A"
              width="45%"
            >
              This competition will be actively conducted on Twitter and other
              social media platforms as specified by the organizer within the
              group. The competition will feature daily tasks.
            </Text>
          </Box>
          <Box
            p="40px"
            borderTop={[
              '2px solid #EAEAEA',
              '2px solid #EAEAEA',
              '2px solid #EAEAEA',
              'none',
            ]}
            borderLeft={['none', 'none', 'none', '3px solid #EAEAEA']}
          >
            <Image
              src="https://res.cloudinary.com/deudl0ryy/image/upload/v1709219109/crown_ra1lww.svg"
              alt="heroBg"
              mb="16px"
            />
            <Heading as="h1" fontSize={['24px', '40px']} fontWeight="600">
              Gender
            </Heading>
            <Text
              mt="1rem"
              minWidth={['100%', '100%', '100%', '540px']}
              fontSize={['16px', '20px']}
              lineHeight="150%"
              color="#1A1A1A"
              width="45%"
            >
              This competition is open to junior designers with 1-3 years of
              experience regardless of gender.
            </Text>
          </Box>
        </Flex>
        <Box
          backgroundColor="#E3719C"
          display="flex"
          borderTopLeftRadius="63px"
          borderTopRightRadius="63px"
          flexDir="column"
          justifyContent={'center'}
          width="100%"
          alignItems="center"
          pt="50px"
          pb="20px"
          mt={['30px', '70px']}
        >
          <Flex justifyContent="center" alignItems="center">
            <Text
              fontSize={['14px', '24px']}
              color="#FFF"
              lineHeight="100%"
              fontWeight="600"
              textTransform={'uppercase'}
            >
              PRICE POOL FOR 4 BEST PORTFOLIOS
            </Text>
          </Flex>
          <Heading
            color="#FFF"
            as="h1"
            fontSize={['38px', '97px']}
            fontWeight="800"
            mt="5px"
          >
            N100,000
          </Heading>
        </Box>
      </Box>
    </MainContainer>
  )
}
