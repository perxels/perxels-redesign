import React from 'react'
import {Box, HStack, Image, Text, VStack} from '@chakra-ui/react'
import { SpeakerCard } from './SpeakerCard'
import { SpeakerCardProps, SpeakerCardContent } from '../../constant'
export const Speaker = () => {
  return (
   <Box
   w="100%"
   minH="60vh"
   bgColor="#34296B"
   p= {["0 5%" ,"0 15%"]}
   pt={['5rem', '5rem', '5rem', '6rem']}
   >
        <VStack
        alignItems={'flex-start'}
        spacing={10}
        >
            <Text
            color="#fff"
            fontSize="2.5rem"
            textTransform="uppercase"
            fontWeight={900}
            >Speakers</Text>

            {
                SpeakerCardContent.map((item, index) => {
                    return (
                        <SpeakerCard
                        key={index}
                        speakerName={item.speakerName}
                        speakerTitle={item.speakerTitle}
                        speakerDescription={item.speakerDescription}
                        speakerImage={item.speakerImage}
                        />
                    )
                })
            }
        </VStack>
   </Box>
  )
}
