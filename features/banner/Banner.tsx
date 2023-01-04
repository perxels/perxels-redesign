import React from 'react'
import { Box, Button, Flex, Heading, Img, Text, Spacer } from '@chakra-ui/react'
import { RiTimer2Line } from 'react-icons/ri'
import { AiOutlineCalendar } from 'react-icons/ai'
import { IoLocationOutline } from 'react-icons/io5'
import { bannerContent } from '../../constant'
import { MainContainer } from '../../layouts'
import Link from 'next/link'
export const Banner = () => {
  return (
    <MainContainer bg="#E3719C">
      <Box
        w="100%"
        py={['1rem', '1.5rem', "1.5rem"]}
        backgroundImage={"url('/assets/images/banner/bannerPattern.png')"}
        backgroundRepeat="no-repeat"
        backgroundSize={'contain'}
        display={['none', 'none', 'none', 'block']}
      >
        <Flex align={'center'} justify={'space-between'}
        columnGap={['1rem', '1rem', '1rem', '1rem']}
        >
          <Flex columnGap={'6.5rem'}>
            <Box
              boxSize={['8.3125rem']}
            >
              <Img
              
                src={bannerContent.bannerImage}
                alt="Banner"
              />
            </Box>

            <Box
            display={['none', 'none', 'block', 'block']}
            >
              <Heading fontSize="4xl" fontWeight="700" color="brand.white">
                {bannerContent.mainTitle}
              </Heading>
              <Heading
                fontSize="4xl"
                maxW="32.6875rem"
                fontWeight="700"
                color="brand.white"
              >
                {bannerContent.subTitle}
              </Heading>
              <Flex columnGap={'1.39rem'} mt={"1rem"}>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.5625rem'}
                >
                  <Text fontSize="1.25rem" fontWeight={'bold'}>
                    <RiTimer2Line />
                  </Text>
                  <Text fontSize="1.0625rem" fontWeight={'bold'}>
                    {bannerContent.time}
                  </Text>
                </Box>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.5625rem'}
                >
                  <Text fontSize="1.25rem" fontWeight={'bold'}>
                    <AiOutlineCalendar />
                  </Text>
                  <Text fontSize="1.0625rem" fontWeight={'bold'}>
                    {bannerContent.date}
                  </Text>
                </Box>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.5625rem'}
                >
                  <Text fontSize="1.25rem" fontWeight={'bold'}>
                    <IoLocationOutline />
                  </Text>
                  <Text fontSize="1.0625rem" fontWeight={'bold'}>
                    {bannerContent.location}
                  </Text>
                </Box>
              </Flex>
            </Box>
          </Flex>

          <Box>
          <Box
            display={['block', 'block', 'none', 'none']}
            >
              <Heading fontSize="1.875rem" lineHeight={"2.28375rem"} fontWeight="700" color="brand.white">
                {bannerContent.mainTitle}
              </Heading>
              <Heading
                fontSize="1.875rem"
                maxW="32.6875rem"
                fontWeight="700"
                lineHeight={"2.28375rem"}
                color="brand.white"
              >
                {bannerContent.subTitle}
              </Heading>
              <Flex columnGap={'0.4rem'} mt={"1rem"}>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.3125rem'}
                >
                  <Text fontSize="0.875rem" fontWeight={'bold'}>
                    <RiTimer2Line />
                  </Text>
                  <Text fontSize="0.633125rem" fontWeight={'bold'}>
                    {bannerContent.time}
                  </Text>
                </Box>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.3125rem'}
                >
                  <Text fontSize="0.875rem" fontWeight={'bold'}>
                    <AiOutlineCalendar />
                  </Text>
                  <Text fontSize="0.633125rem" fontWeight={'bold'}>
                    {bannerContent.date}
                  </Text>
                </Box>
                <Box
                  color={'brand.white'}
                  display={'flex'}
                  alignItems={'center'}
                  columnGap={'0.3125rem'}
                >
                  <Text fontSize="0.875rem" fontWeight={'bold'}>
                    <IoLocationOutline />
                  </Text>
                  <Text fontSize="0.633125rem" fontWeight={'bold'}>
                    {bannerContent.location}
                  </Text>
                </Box>
              </Flex>
            </Box>
              <Link href="/events">
            <Button
              variant={'link'}
              // height="3.4375rem"
              fontSize={'1rem'}
              fontWeight={'700'}
              // width="16.0625rem"
              color="brand.white"
              p="0.79375rem 2.125rem"
              border={'0.086969375rem solid'}
            >
              Register Here
            </Button>
            </Link>
          </Box>
        </Flex>
      </Box>
    </MainContainer>
  )
}
