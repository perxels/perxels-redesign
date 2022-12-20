import React from 'react'
import { Box, Flex, Heading, Img, Text } from '@chakra-ui/react'
import { StoryCard } from './StoryCard'
import { AiOutlineArrowRight } from 'react-icons/ai'
import { MainContainer } from '../../layouts'
export const Story = () => {
  return (
    <MainContainer bg="brand.purple.500">
      <Flex
        direction={{ base: 'column', lg: 'row' }}
        justify="space-between"
        align={{ base: 'flex-start', lg: 'center' }}
        w="100%"
        h="100%"
        py={['4.5rem', '3.4375rem']}
        bg="brand.purple.500"
      >
        <Box>
          <Img
            w={['6.25rem']}
            h={['6.25rem']}
            src="/assets/images/story/mission.svg"
            alt="Story Icon"
          />

          <Heading
            fontSize={['7xl', '7xl', '7xl']}
            fontWeight="black"
            color="brand.white"
            mt="1.5rem"
          >
            Our Mission
          </Heading>

          <Text
            fontSize={['xl', '2xl']}
            color="brand.white"
            mt="1.2rem"
            maxW={{ base: '100%', lg: '27.3125rem' }}
          >
            Equipping designers with the core design skills and soft skills to
            become proficient in solving problems with design.
          </Text>
        </Box>

        <Box
          w={{ base: '70%', lg: '55%' }}
          h={{ base: '100%', lg: '50%' }}
          mt={{ base: '2.5rem', lg: '0' }}
          alignContent="left"
        >
          <Img
            w={['15rem', '20rem', '22rem', '31.875rem']}
            h={['15rem', '20rem', '22rem', '31.875rem']}
            src="/assets/images/story/storyImage.png"
            alt="Story Image"
          />
          <Box
            pos="absolute"
            // width={{ base: '65%', lg: '29.9375rem' }}
            width={['80%', '65%', '29.9375rem', '29.9375rem']}
            transform={[
              'translate(10%, -60%)',
              'translate(40%, -80%)',
              'translate(40%, -80%)',
              'translate(10%, -80%)',
              'translate(40%, -80%)',
            ]}
          >
            <StoryCard />
          </Box>
        </Box>
      </Flex>
    </MainContainer>
  )
}
