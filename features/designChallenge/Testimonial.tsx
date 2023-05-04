import React, { useEffect } from 'react'
import {Box, Flex, Text, Heading,Image } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export const Testimonial = () => {
    useEffect(() => {
        let ctx = gsap.context(() => {
          gsap.from('.testiGrid', {
            opacity: '0',
            y: 200,
            duration: 1,
            delay: 1,
            scrollTrigger: {
              trigger: '.testiGrid',
            },
          })
        })
    
        return () => ctx.revert()
      }, [])
  return (
    <Box
    pb="5rem"
    className="testiGrid"
    >
        <MainContainer>
        <Box>
            <Image src="assets/images/designChallenge/quotation.svg" alt="" />
        
        </Box>
        <Flex
        justifyContent="space-between"
        alignItems={["flex-start","center"]}
        flexDir={["column", "column", "column", "row"]}
        rowGap="2.525rem"
        >
            <Box
            width={["100%","60%"]}
            >
            <Text
            fontSize={["1.875rem","3.75rem"]}
            lineHeight={["3.5063rem","5.85rem"]}
            color="#121212"
            >
            The contest helped me understand the expectations of a design case study, learn a new design tool, and get valuable feedbacks.
            </Text>
            </Box>  

            <Box
            position="relative"
            >
                <Image src="assets/images/designChallenge/testimonyImage.png"
                 w={['full', 'auto', '22rem', '31.875rem']}
                 h={['80%', '20rem', '22rem', '31.875rem']}
                alt=""/>
                <Box
                position="absolute"
                top="0"
                right="0"
                transform= {["translate(0%,-40%)","translate(30%, -40%)"]}
               
                >
                    <Image boxSize={["6.5625rem","4.25rem"]} src="assets/images/designChallenge/testimonyMedal.svg" alt=""/>
                </Box>

                <Box pos="absolute">
                    <Box
                    background="brand.yellow.300"
                    padding={[".8125rem .9375rem","20px 24px"]}
                    rounded="20px"
                    transform={[
                        'translate(0%, -50%)',
                        'translate(40%, -80%)',
                        'translate(40%, -80%)',
                        'translate(10%, -80%)',
                        'translate(-50%, -80%)',
                      ]}
                    >
                        <Text
                        textAlign={"center"}
                        fontWeight="700"
                        color="#121212"
                        fontSize={["1rem","1.5625rem"]}
                        lineHeight={["1.1rem","1.9031rem"]}
                        mb=".625rem"
                        >Tobi Olayemi</Text>
                        <Text
                        color="#121212"
                        fontSize={[".8281rem","1.25rem"]}
                        lineHeight={["1rem","1.9031rem"]}
                        fontStyle="italic"
                        textAlign="center">Winner of Perxels Design Challenge 1.0</Text>
                    </Box>
                </Box>
            </Box>
        </Flex>
        </MainContainer>
    </Box>
  )
}
