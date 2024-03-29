import React, {useEffect, useRef} from 'react'
import {Box, Text, Heading, SimpleGrid} from '@chakra-ui/react'
import {PortalBoxes} from './PortalBoxes'
import {PortalContent} from '../../constant'
import gsap from 'gsap'

export const PortalHero = () => {
    const heroRef = useRef<HTMLDivElement>(null)
    useEffect(() => {
        let ctx = gsap.context(() =>{
            gsap.to(heroRef.current, { 
                opacity: 1,
                duration: 3,
                y: 0,
                x: 0,
                delay: 1,
            })  
        })
        return () => ctx.revert()
     }, [])
  return (
    <Box
    ref={heroRef}
    padding={["5% 5%"]}
    bg={`url(./assets/images/heroBg.png) center/cover no-repeat`}
    opacity={0}
    >
        <Heading
        textAlign="center"
        fontSize={["2.5rem","4.375rem"]}
        fontWeight="800"
        lineHeight="1.2"

        >
        Welcome to Perxels Portal
        </Heading>
        <Text
         textAlign="center"
         fontSize="1.375rem"
         fontWeight="400"
         lineHeight="1.2"
        mt={["1.375rem","47px"]}
        >
        Kindly select correctly the action you want to perform
        </Text>

        <SimpleGrid columns={[1, 2, 3]} spacing="57px"   mt={["2.4375rem","5.625rem"]}>
            {
                PortalContent.map((content, index) => (
                    <PortalBoxes
                    key={index}
                    title={content.title}
                    description={content.description}
                    image={content.image}
                    link={content.link}
                    borderColor={content.borderColor}
                    textColor={content.textColor}
                    buttonColor={content.buttonColor}
                    buttText={content.buttText}
                    />
                ))
            }
        </SimpleGrid>

        <Text
         textAlign="center"
         fontSize="1.375rem"
         fontWeight="400"
         lineHeight="1.2"
        mt={["4.875rem"]}
        >
        © Perxels 2023, All Rights Reserved
        </Text>
    </Box>
  )
}
