import React, { useEffect }  from 'react'
import {EventCard} from './EventCard'
import {Box, Text, Heading, Image, Center, SimpleGrid, Button} from '@chakra-ui/react'
import { InfoContent } from '../../constant'
import {MainContainer} from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
gsap.registerPlugin(ScrollTrigger)
export const EventInfo = () => {
    useEffect(() => {
        let ctx = gsap.context(() => {
          gsap.from('.section-grid', {
            opacity: '0',
            y: 200,
            duration: 1,
            delay: 1,
            scrollTrigger: {
              trigger: '.section-grid',
            },
          })
        })
    
        return () => ctx.revert()
      }, [])
  return (
    <MainContainer>
    <Box pr={["0%","10%"]} py="5%">
        <Box>
            <Heading fontSize={["1.5625rem","55px"]} color="#34296B" lineHeight="110%" fontWeight="900" width={["90%","60%"]} >
            A retreat to help our Alumnis get Jobs
            </Heading>
            <Text fontSize={["1rem","24px"]} fontWeight="400" w={["100%","70%"]} lineHeight="133%"  mt="1.15rem">
            This retreat aims to empower our alumni with insights into the current job market landscape and effective strategies to secure employment in 2024.
            </Text>
        </Box>
        <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="26px" mt="2.625rem" className="section-grid">
                    {
                InfoContent.map((item, index) => (
                    <EventCard
                        key={index}
                        title={item.title}
                        iconSrc={item.iconSrc}
                        content={item.content}
                        fontSize={item.fontSize}
                        bgColor={item.bgColor}
                        marginT={item.marginT}
                    />
                ))
            }
        </SimpleGrid>

        <Center>
            <Button  as='a' href="/retreat/register"  backgroundColor="#34296B" color="#fff" fontSize="1.25rem" fontWeight="700" mt="3.125rem" mb="3.125rem" w={["100%", "30%"]} h="4.375rem" borderRadius="4px" >
            Register for the retreat
            </Button>
        </Center>
    </Box>
    </MainContainer>
  )
}
