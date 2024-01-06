import React from 'react'
import {EventCard} from './EventCard'
import {Box, Text, Heading, Image, Center, SimpleGrid, Button} from '@chakra-ui/react'
import { InfoContent } from '../../constant'
import {MainContainer} from '../../layouts'

export const EventInfo = () => {
  return (
    <MainContainer>
    <Box pr={["0%","10%"]}>
        <Box>
            <Heading fontSize={["1.5625rem","55px"]} color="#34296B" lineHeight="110%" fontWeight="900" width={["90%","70%"]} fontFamily="Montserrat">
            A retreat to help our Alumnis get Jobs
            </Heading>
            <Text fontSize={["1rem","30px"]} fontWeight="400" w={["100%","60%"]} lineHeight="133%" fontFamily="Montserrat" mt="1.15rem">
            This retreat aims to empower our alumni with insights into the current job market landscape and effective strategies to secure employment in 2024.
            </Text>
        </Box>
        <SimpleGrid columns={{sm: 1, md: 2, lg: 3}} spacing="26px" mt="2.625rem">
                    {
                InfoContent.map((item, index) => (
                    <EventCard
                        key={index}
                        title={item.title}
                        iconSrc={item.iconSrc}
                        content={item.content}
                        fontSize={item.fontSize}
                        bgColor={item.bgColor}
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
