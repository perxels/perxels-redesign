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
import { IoIosArrowRoundForward } from 'react-icons/io'
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
    name: 'Dan Praise',
    description:
      "With a robust background in marketing, I bring extensive expertise in Content Marketing, Brand Marketing, and Design customized to fuel sustainable growth strategies. My experience spans across diverse industries and markets, allowing me to harness the power of compelling content, strategic brand positioning, and impactful design to drive tangible business growth. I've honed my skills in crafting narratives that resonate with audiences while implementing innovative branding strategies that elevate a company's visibility and market presence.<br/>Having navigated various facets of marketing, I've developed a keen understanding of how to harmonize content, branding, and design to create cohesive, impactful campaigns. This holistic approach not only captures attention but also cultivates lasting connections with target audiences.",
    image: 'assets/images/retreat/speaker4.jpeg',
    role: 'UIUX Designer',
    topic: 'Vision Board',
  },
  {
    name: 'Michael Etukudoh',
    description:
      "With a background in sourcing, recruiting, and people operations across Advertising, Marketing, and financial technology start-ups, I specialize in identifying top candidates for challenging roles. My expertise lies in building candidate relationships to maintain a consistent talent pipeline while efficiently managing multiple positions. Skill sets I've honed encompass sourcing techniques, technical and executive recruiting, and employing data-driven strategies for full-life cycle recruitment.<br/>In the tech start-up sphere, particularly in Advertising (Adtech), Marketing (Martech), and Financial Technology (Fintech), my impact has been substantial. I led a recruiting team that reshaped a company's strategy by hiring Machine Learning experts, attracting investors from pre-seed to series A funding.",
    image: 'assets/images/retreat/speaker1.png',
    role: 'UIUX Designer',
    topic: 'Vision Board',
  },
  {
    name: 'Abiodun Fiwa',
    description:
      'Abiodun Fiwa has spent a good time of her life using her skills and career experiences to train and mentor aspiring UIUX designers to grow and thrive in the industry. She is a design facilitator with over 7 years of experience organizing design meetups and boot camps. She is also a FigmaAfrica Ambassador. <br/> Fiwa believes that this day&quot;s businessenvironment is changing at a fast pace. Tough business problems require technical skills and soft skills to create sustainable solutions. And that is why she takes delight in mentoring aspiring designers to take time to practice, improve and explore different ways of solving problems through a design thinking approach.',
    image: 'assets/images/retreat/speaker2.png',
    role: 'UIUX Designer',
    topic: 'Vision Board',
  },
  {
    name: 'Onuoha, Anayor Daniel',
    description:
      'Anayor, a seasoned HR professional with three years of experience, excels in various HR domains, particularly recruitment, talent management, and performance evaluation. He has collaborated with senior advisors and managers across FinTech, manufacturing, healthcare, and technology sectors. <br/>An expert in unlocking individual potential, Anayor believes in maximizing performance by helping individuals discover their best selves. His competencies span technical and non-technical recruitment, talent onboarding, employer branding, workforce management, talent development, workplace diversity, and emotional intelligence.',
    image: 'assets/images/retreat/speaker3.png',
    role: 'UIUX Designer',
    topic: 'Vision Board',
  },
]

export const Speaker = () => {
  const [speaker, setSpeaker] = useState<number>(SpeakerData.length - 1)

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

      <Flex display={['none', 'flex']}>
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
        <Box width="100%" style={{ transition: 'opacity 0.5s ease' }}>
          <Text fontSize="18px" fontWeight="400" w="100%" lineHeight="214%">
            {parse(SpeakerData[speaker]?.description)}
          </Text>
          <Box
            backgroundColor={'#060022'}
            padding="20px 36px"
            rounded="1.6875rem"
            display="inline-flex"
            flexDir="column"
            mt="45px"
          >
            <Text color="#FFF">Topic:</Text>
            <Heading color="#FFF" fontSize="40px" fontWeight="900">
              {SpeakerData[speaker]?.topic}
            </Heading>
          </Box>
        </Box>
      </Flex>

      <Flex
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
      </Flex>

      <Box display={['block', 'none']}>
        <SpeakerMobile />
      </Box>
    </Box>
  )
}
