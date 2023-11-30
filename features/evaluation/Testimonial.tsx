import React from 'react'
import {Box, Flex, Button, Heading, Text, Img} from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import Link from 'next/link'
export const Testimonial = () => {
  return (
    <MainContainer>
        <Flex columnGap="1.25rem" mt="9.875rem" flexDir={["column", "row"]} mb="5rem">
            <Box width={["100%","50%" ]}bgColor="#F7F8F8" padding={["2.625rem 1rem","74px 88px 74px 42px"]} rounded="2rem">
                <Heading fontSize={["1rem,","3.25rem"]} lineHeight={["1.5rem","4.225rem"]} color="#34296B">
                “An investment in knowledge pays the best interest, Make sure you enroll Today!”
                </Heading>
                <Text mt={["0.75rem","1.5rem"]} fontSize={["1rem","32px"]} lineHeight="41.6px" color="#1A1A1A">
                Abiodun Fiwa Okunade
                </Text>
                <Button as={Link} href="/evaluation/register"  mt={["1rem","10.625rem"]} bgColor="#FDE85C" color="#383084">
                Enroll Now
                </Button>

                <Img display={["block", "none"]} mt="1.75rem" src="/assets/images/evaluation/fiwaImg.png" alt="" rounded="2rem" />
            </Box>
            <Box width="50%" >
                <Img display={["none", "block"]} src="/assets/images/evaluation/fiwaImg.png" alt="" rounded="2rem" />
            </Box>
        </Flex>
    </MainContainer>
  )
}
