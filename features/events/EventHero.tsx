import React from 'react'
import {Box, Flex, Heading, Text, Image, Button, useColorModeValue, Grid} from '@chakra-ui/react'
import { bannerContent } from '../../constant'
import { RiTimer2Line } from 'react-icons/ri'
import { AiOutlineCalendar } from 'react-icons/ai'
import { IoLocationOutline } from 'react-icons/io5'
export const EventHero = () => {
  return (
    <Grid>
        <Box>
            <Button>
                <Text>AMA SESSION</Text>
            </Button>
            <Heading>
                {bannerContent.mainTitle} <br/>
                {bannerContent.subTitle}
            </Heading>
            <Flex columnGap={'1.39rem'} mt={"1rem"}>
                <Box
                  color={'brand.gray.400'}
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
                  color={'brand.gray.400'}
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
                  color={'brand.gray.400'}
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
        <Box>

        </Box>
    </Grid>
  )
}
