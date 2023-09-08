import React, { useEffect } from 'react'
import {Flex, Box, Text, Image, VStack, HStack, SimpleGrid, Button, Heading} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const LocateHub = () => {
    useEffect(() => {
        let ctx = gsap.context(() => {
          gsap.from('.locate-grid', {
            opacity: '0',
            y: 200,
            duration: 1,
            delay: 1,
            scrollTrigger: {
              trigger: '.locate-grid',
            },
          })
        })
    
        return () => ctx.revert()
      }, [])
  return (
    <MainContainer>
        <Flex className="locate-grid" justifyContent="space-between" flexDir={["column", "row"]} py="6rem" rowGap="2.5rem" id="location">
        <Flex flexDir="column" w={["100%","45%"]}>
            <Heading fontSize={["1.875rem","3rem"]} color="#333" fontWeight="400" mb={[".9375rem","2.25rem"]} >
            LOCATE US
            </Heading>

            <Text fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555">
            Perxels is here to help you;
            </Text>
            <Text fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555">
            Our experts are available to answer any questions you might have. We’ve got the answers.
            </Text>
            <Heading fontWeight="400" fontSize={["1.25rem","1.5625rem" ]}lineHeight="2.1875rem" color="#34296B" mt={"1.9375rem"} w={["100%","80%"]}>
            Triangle Business Mall, Osapa London, Lekki, Lagos.
            </Heading>
            <Text  fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555" mt="1.9375rem">
            Feel free to get in touch with us through our channels: 
            </Text>
            <Flex mt="3.125rem" columnGap="3.125rem" flexDir={["column", "row"]} rowGap="1.875rem">
                <Box>
                    <Text color="#1A191A" fontSize={["1.875rem","2.1875rem"]} fontWeight="400" textTransform="uppercase">
                    Email US
                    </Text>
                    <Text as="a" href="mailto: perxels@gmail.com" fontSize={["1.25rem","1.375rem"]} fontWeight="400" lineHeight="2.1875rem" color="#121212" >
                    perxels@gmail.com
                    </Text>
                </Box>
                <Box>
                    <Text color="#1A191A" fontSize="2.1875rem" fontWeight="400" textTransform="uppercase">
                    Call us
                    </Text>
                    <Text as='a' href="tel: 08135369680" fontSize={["1.25rem","1.375rem"]} fontWeight="400" lineHeight="2.1875rem" color="#121212" >
                    08135369680
                    </Text>
                </Box>
            </Flex>
            
            </Flex>
            <Box width={["100%","40%"]}>
            <iframe src="https://www.google.com/maps/embed?pb=!1m14!1m8!1m3!1d31717.1779127083!2d3.509190400524913!3d6.439328701581645!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x103bf7266783825f%3A0xc71e7e52aec40174!2sTriangle%20Business%20Place!5e0!3m2!1sen!2sng!4v1693838498290!5m2!1sen!2sng" height="450"   width="100%" loading="lazy" referrerPolicy="no-referrer-when-downgrade"></iframe>
            </Box>
        </Flex>
    </MainContainer>
  )
}
