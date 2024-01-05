import React, {useState} from 'react'
import {Text ,Image, Box, Heading, Flex, Button, Center} from '@chakra-ui/react'
import { IoIosArrowRoundForward } from "react-icons/io";
import {SpeakerMobile} from './SpeakerMobile'
export interface SpeakerInterface {
    name: string;
    role: string;
    image: string;
    description: string;
    topic: string;
}


export const SpeakerData: SpeakerInterface[] = [
    {
        name: 'Abiodun Fiwa',
        description: 'Abiodun Fiwa1 is retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.This retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.',
        image: 'assets/images/retreat/speaker1.png',
        role: 'UIUX Designer',
        topic: 'Vision Board'
    },
    {
        name: 'Abiodun Fiwa',
        description: 'Abiodun Fiwa2 is retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.This retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.',
        image: 'assets/images/retreat/speaker1.png',
        role: 'UIUX Designer',
        topic: 'Vision Board'
    },
    {
        name: 'Abiodun Fiwa',
        description: 'Abiodun Fiwa3 is retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024. This retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.',
        image: 'assets/images/retreat/speaker2.png',
        role: 'UIUX Designer',
        topic: 'Vision Board'
    },
    {
        name: 'Abiodun Fiwa',
        description: 'Abiodun Fiwa4 is retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.This retreat is tailored to empower and guide our recent graduates as they step into the exciting world of UIUX design careers in 2024.',
        image: 'assets/images/retreat/speaker3.png',
        role: 'UIUX Designer',
        topic: 'Vision Board'
    },
    
]

export const Speaker = () => {
    const [speaker, setSpeaker] = useState<number>(SpeakerData.length-1)

  return (
    <Box backgroundColor="#F1EFFF" py="5%" pr={["5%","15%"]} mt="5%">
    <Heading color="#34296B" fontSize={["1.5625rem","4.375rem"]} fontWeight={["600","900"]} mb={["1.5rem","4.5rem" ]}pl="5%">
        Speakers
    </Heading>

   {/* Image interaction      */}

    <Flex display={["none","flex"]}>
        {/* {Images container} */}
        <Box width="100%">
            <Flex columnGap="0">
            {
                SpeakerData.map((item, index) => (
                    <Box width={
                        speaker === index ? "371px" : "10%"
                    } key={index} height="400px" position="relative"
                    onMouseOver={()=>setSpeaker(index)}
                    >
                        <Image  height="100%" width="100%" src={item.image} alt="speaker" objectFit="cover" objectPosition={"top center"} />
                    </Box>
                ))
            }
            </Flex>
        </Box>
            
            {/* {Text container} */}    
        <Box width="100%">
         
            <Text fontSize="22px" fontWeight="400" w="100%" lineHeight="214%">
            {
                SpeakerData[speaker].description
            }
            </Text>
            <Box backgroundColor={"#060022"} padding="20px 36px" rounded="1.6875rem" display="inline-flex" flexDir="column" mt="45px" >
                <Text color="#FFF">
                    Topic:
                </Text>
                <Heading color="#FFF" fontSize="40px" fontWeight="900" >
                    {
                        SpeakerData[speaker].topic
                    }
                </Heading>
            </Box>
        </Box>
    </Flex>
    

    <Flex display={["none","flex"]} justifyContent="center" alignItems="center" mt="3.8125rem">
        <Text color="#000" fontSize="25px" fontFamily="Montserrat" fontWeight="600" >
            Next
        </Text>
        <IoIosArrowRoundForward size="2rem"/>

    </Flex>

    <Box display={["block","none"]} >
        <SpeakerMobile />
    </Box>
    </Box>
  )
}
