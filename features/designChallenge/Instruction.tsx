import React, { useEffect } from 'react'
import { Box, Heading, Text, Image, HStack, Center, SimpleGrid } from '@chakra-ui/react'
import {InstructionBox} from './InstructionBox'
import {ChallengeInstructionContent, ChallengeInstructionInterface } from '../../constant'
import { MainContainer } from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)

export const Instruction = () => {
  useEffect(() => {
    let ctx = gsap.context(() => {
      gsap.from('.instructionGrid', {
        opacity: '0',
        y: 200,
        duration: 1,
        delay: 1,
        scrollTrigger: {
          trigger: '.instructionGrid',
        },
      })
    })
    return () => ctx.revert()
  }, [])

  return (
    <Box
    py="6.25rem"
    id="instructions"
    >
        <MainContainer>
        <Center>
        <Box
            bg="#E3719C"
            borderRadius={"30px"}
            padding={"1rem 1.5625rem"}
            display="flex"
            columnGap={"1rem"}
            alignItems="center"
            >
                
                <Image src="assets/icons/badgeWhite.svg" alt=""/>
                <Text
                fontSize={[".9081rem","1.125rem"]}
                fontWeight="700"
                color="#FFF"
                >
               How to get started
                </Text>
        </Box>
        </Center>
        <Heading
        textAlign="center"
        fontSize={["1.98rem","3.125rem"]}
        lineHeight={["38.58px","60.9px"]}
        color="#000000"
        mt="20px"
        >
                Go from Start-to-Finish in 3 simple steps
        </Heading>

        <SimpleGrid columns={[1, 1, 1, 3]} spacing="2.5rem" mt="2.5rem" className="instructionGrid">
           {
                ChallengeInstructionContent.map((item, index) => (
                    <InstructionBox key={item.id} image={item.image} title={item.title} text={item.text} />
                ))
           }
        </SimpleGrid>
        </MainContainer>
    </Box>
  )
}
