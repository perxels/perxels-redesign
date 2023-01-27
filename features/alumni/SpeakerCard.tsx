import React from 'react'
import {Box, HStack, Image, Text, VStack} from '@chakra-ui/react'
import {SpeakerCardProps} from '../../constant'
export const SpeakerCard = ({
    speakerName,
    speakerTitle,
    speakerDescription,
    speakerImage
}: SpeakerCardProps) => {
  return (
    <Box>
        <HStack
        flexDirection={['column', 'column', 'column', 'row']}
        alignItems={['flex-start']}
        spacing={['0rem', '0rem', '0rem', '10']}
        rowGap={['2rem', '2rem', '2rem', '0']}
        >
            <Box
            boxSize={['100%', '100%', '100%', '30%']}
            >
            <Image src={speakerImage} alt="speaker" />
            </Box>
            <Box>
                <VStack
                alignItems={['flex-start']}
            
                >
                    <Text
                    fontWeight={700}
                    fontSize= "1.5rem"
                    color=" #FEDA00"
                    margin= {["0rem" ,".7rem 0"]}
                    textTransform="uppercase"
                    >
                        {speakerName}
                    </Text>
                    <Text
                      fontWeight="550"
                      fontStyle= "normal"
                      fontSize= "1.2rem"
                        color= "#fff"
                    >
                        {speakerTitle}
                    </Text>
                    <Text
                      fontSize= "1rem"
                      maxW={['100%', '100%', '100%', '655px']}
                        color= "#fff"
                    >
                        {speakerDescription}
                    </Text>
                </VStack>
            </Box>
        </HStack>
    </Box>
  )
}
