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
      "Anayor is a competent and assured person who is also a self-starter with the commitment and drive necessary to succeed in a hectic HR department. Have worked as an HR professional for around 5 years. He has a solid background in HR processes and procedures and a track record of collaborating with senior HR advisors and managers at startups in the FinTech, manufacturing, healthcare, and technology sectors. <br/> His expertise has primarily been in recruitment, talent management, performance management, workplace policy writing, and other areas. <br/> Anayor is an HR expert who believes that everyone has a better version of themselves hidden inside. He has chosen to help others find this version of themselves in order to improve performance. <br/> Some of his core competencies include; to name a few, technical/non-technical recruitment, talent onboarding, employer branding, workforce management, talent development, workplace diversity, and emotional intelligence. <br/> Recruitment tools and technologies: Github sourcing, Boolean search, Google Xray sourcing, LinkedIn headhunting, Networking, etc.",
    image: 'assets/images/retreat/speaker3.jpeg',
    role: 'Topic',
    topic: 'The Designer’s Guide to Acing CVs and Interviews.',
  },
  // {
  //   name: 'Dan Praise, Designer',
  //   description:
  //     "Daniel has a robust background in marketing, he brings extensive expertise in Content Marketing, Brand Marketing, and Design customized to fuel sustainable growth strategies. His experience spans across diverse industries and markets, allowing him to harness the power of compelling content, strategic brand positioning, and impactful design to drive tangible business growth. He has honed his skills in crafting narratives that resonate with audiences while implementing innovative branding strategies that elevate a company's visibility and market presence.",
  //   image: 'assets/images/retreat/speaker4.jpeg',
  //   role: 'Panel Topic',
  //   topic: 'Strategies for secu-<br/>ring Employment',
  // },
 

  // {
  //   name: 'Onuoha, Anayor Daniel, Technical Recruiter',
  //   description:
  //     'Anayor, a seasoned HR professional who has excelled in various HR domains, particularly recruitment, talent management, and performance evaluation. He has collaborated with senior advisors and managers across FinTech, manufacturing, healthcare, and technology sectors.<br/>An expert in unlocking individual potential, Anayor believes in maximizing performance by helping individuals discover their best selves. His competencies span technical and non-technical recruitment, talent onboarding, employer branding, workforce management, talent development, workplace diversity, and emotional intelligence.',
  //   image: 'assets/images/retreat/speaker3.png',
  //   role: 'Panel Speaker',
  //   topic: 'Strategies for secu-<br/>ring Employment',
  // },
]

export const Speaker = () => {
  const [speaker, setSpeaker] = useState<number>(0)

  const handleNext = () => {
    if (speaker === SpeakerData.length - 1) {
      setSpeaker(0)
    }else{
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
                height="400px"
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
        <Box width={"100%"} style={{ transition: 'opacity 0.5s ease' }}>
          <Text fontSize="30px" fontWeight="700" color="#282828" >
            {SpeakerData[speaker]?.name}
          </Text>
          <Text fontSize="22px" fontWeight="400" w="100%" lineHeight="214%">
            {parse(SpeakerData[speaker]?.description)}
          </Text>
          <Box
            backgroundColor={'#060022'}
            padding="20px 36px"
            rounded="1.6875rem"
            display="inline-flex"
            flexDir="column"
            mt="45px"
            // w={["95%"]}
          >
            <Text color="#FFF">{SpeakerData[speaker]?.role}</Text>
            <Heading color="#FFF" fontSize="40px" fontWeight="900">
              {parse(SpeakerData[speaker]?.topic)}
            </Heading>
          </Box>
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
