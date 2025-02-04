import React, { useState } from 'react'
import {
  Text,
  Image,
  Box,
  Heading,
  Flex,
  Button,
  Center,
} from '@chakra-ui/react'
import { SpeakerMobile } from './SpeakerMobile'
import parse from 'html-react-parser'
export interface SpeakerInterface {
  name: string
  role: string
  image: string
  description: string
  topic: string
}

export const SpeakerData: SpeakerInterface[] = [
  {
    name: 'Abiodun Fiwa - CEO, Perxels',
    description:
      'Abiodun Fiwa has spent a good time of her life using her skills and career experiences to train and mentor aspiring UIUX designers to grow and thrive in the industry. She is a design facilitator with over 7 years of experience organizing design meetups and boot camps. She is also a FigmaAfrica Ambassador. <br/> Fiwa believes that this days business environment is changing at a fast pace. Tough business problems require technical skills and soft skills to create sustainable solutions. And that is why she takes delight in mentoring aspiring designers to take time to practice, improve and explore different ways of solving problems through a design thinking approach.',
    image: 'assets/images/retreat/fiwa_image.jpg',
    role: 'Topic',
    topic: 'Vision Board',
  },
  {
    name: 'Onuoha Anayor Daniel - Technical Recruiter',
    description:
      'Anayor is a competent and assured person who is also a self-starter with the commitment and drive necessary to succeed in a hectic HR department. Have worked as an HR professional for around 5 years. He has a solid background in HR processes and procedures and a track record of collaborating with senior HR advisors and managers at startups in the FinTech, manufacturing, healthcare, and technology sectors. His expertise has primarily been in recruitment, talent management, performance management, workplace policy writing, and other areas. Anayor is an HR expert who believes that everyone has a better version of themselves hidden inside. He has chosen to help others find this version of themselves to improve performance.',
    image: 'assets/images/retreat/speaker3.jpeg',
    role: 'Topic',
    topic: 'The Designer’s Guide to Acing CVs and Interviews.',
  },
]

export const Speaker = () => {
  const [speaker, setSpeaker] = useState<number>(0)

  const handleNext = () => {
    if (speaker === SpeakerData.length - 1) {
      setSpeaker(0)
    } else {
      setSpeaker(speaker + 1)
    }
  }

  return (
    <Box backgroundColor="#F1EFFF" py="5%" pr={['5%', '15%']} mt="5%">
      <Heading
        color="#34296B"
        fontSize={['1.5625rem', '4.375rem']}
        fontWeight={['600', '900']}
        mb={['1.5rem', '4.5rem']}
        pl="5%"
      >
        Speakers
      </Heading>

      {/* Image interaction      */}

      <Flex display={['none', 'flex']} columnGap="5%">
        {/* {Images container} */}
        <Box width="100%">
          <Flex columnGap="0">
            {SpeakerData.map((item, index) => (
              <Box
                // width={speaker === index ? '371px' : '10%'}
                key={index}
                height="600px"
                position="relative"
                onMouseOver={() => setSpeaker(index)}
                style={{
                  width: speaker === index ? '371px' : '10%',
                  transition: 'width 0.5s ease', // Add transition
                }}
              >
                <Image
                  height="100%"
                  width="100%"
                  src={item.image}
                  alt="speaker"
                  objectFit="cover"
                  objectPosition={'top center'}
                  style={{
                    transition: 'opacity 0.5s ease',
                  }}
                />
              </Box>
            ))}
          </Flex>
        </Box>

        {/* {Text container} */}
        <Box width={'100%'} style={{ transition: 'opacity 0.5s ease' }}>
          <Text fontSize="30px" fontWeight="700" color="#282828">
            {SpeakerData[speaker]?.name}
          </Text>
          <Box
            backgroundColor={'#060022'}
            padding="20px 36px"
            rounded="1.6875rem"
            display="inline-flex"
            flexDir="column"
            my="20px"
            // w={["95%"]}
          >
            <Text color="#FFF">{SpeakerData[speaker]?.role}</Text>
            <Heading color="#FFF" fontSize="40px" fontWeight="900">
              {parse(SpeakerData[speaker]?.topic)}
            </Heading>
          </Box>
          <Text fontSize="22px" fontWeight="400" w="100%" lineHeight="214%">
            {parse(SpeakerData[speaker]?.description)}
          </Text>
        </Box>
      </Flex>

      {/* <Flex
        display={['none', 'flex']}
        justifyContent="center"
        alignItems="center"
        mt="3.8125rem"
        onClick={handleNext}
        cursor={"pointer"}
      >
        <Text
          color="#000"
          fontSize="25px"
          fontFamily="Montserrat"
          fontWeight="600"
        >
          Next
        </Text>
        <IoIosArrowRoundForward size="2rem" />
      </Flex> */}

      <Box display={['block', 'none']}>
        <SpeakerMobile />
      </Box>
    </Box>
  )
}
