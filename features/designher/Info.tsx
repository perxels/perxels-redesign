import React from 'react'
import { Box, Flex, Text, Image, Heading } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'

export const Info = () => {
  return (
    <MainContainer>
      <Box>
        <Flex
          flexDir={['column', 'row']}
          borderBottom="1px solid #9E9E9E"
          width="100%"
        >
          <Box p="40px"  borderBottom="1px solid #9E9E9E">
            <Image
              src="./assets/images/designher/puzzle.svg"
              alt="heroBg"
              mb="16px"
            />
            <Heading as="h1" fontSize={["24px","40px"]}fontWeight="600">
              Training Style
            </Heading>
            <Text
              mt="1rem"
              minWidth={['100%', '540px']}
              fontSize={["16px","20px"]}
              lineHeight="150%"
              color="#1A1A1A"
              width="45%"
            >
              This is a 5-day exclusive masterclass happening both physically
              and virtually
            </Text>
          </Box>
          <Box p="40px" borderLeft={["none",'1px solid #9E9E9E']}>
            <Image
              src="./assets/images/designher/crown.svg"
              alt="heroBg"
              mb="16px"
            />
            <Heading as="h1" fontSize={["24px","40px"]} fontWeight="600">
              Women
            </Heading>
            <Text
              mt="1rem"
              minWidth={['100%', '540px']}
              fontSize={["16px","20px"]}
              lineHeight="150%"
              color="#1A1A1A"
              width="45%"
            >
              This class is only intended for women who are interested in
              learning UI/UX design and are new to tech
            </Text>
          </Box>
        </Flex>
        <Box
          display="flex"
          flexDir="column"
          justifyContent={'center'}
          width="100%"
          alignItems="center"
          pb="5%"
        >
          <Heading as="h1" fontSize={["38px","97px" ]}fontWeight="800" mt="40px">
            8th March, 2024
          </Heading>
          <Flex justifyContent="center" alignItems="center">
            <Image width={["5%","5%"]} src="https://res.cloudinary.com/deudl0ryy/image/upload/v1708638117/InfoLeft_zm6bm8.svg" alt="" />
            <Text
              fontSize={["14px","24px"]}
              color="#1A1A1A"
              lineHeight="150%"
              fontWeight="600"
              textTransform={'uppercase'}
            >
              The physical class is at our Lekki office.
            </Text>
            <Image  width={["5%","5%"]}  src="https://res.cloudinary.com/deudl0ryy/image/upload/v1708638117/InfoRight_q2fpye.svg" alt="" />
          </Flex>
        </Box>
      </Box>
    </MainContainer>
  )
}
