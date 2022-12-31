import React from 'react'
import { Box, Img, Heading, Text, Button, Center, Image } from '@chakra-ui/react'
import { MainContainer } from '../../layouts'
import TestimonialTooltip from '../testimonial/TestimonialTooltip'

export const TestimonyHero = () => {
  return (
    <MainContainer bg={['', "url('/assets/images/testimonial/Map.png') no-repeat center center", "url('/assets/images/testimonial/Map.png') no-repeat center center"]}>
      <Box
        mt="3.5625rem"
        mb={['1.04rem', '3.04rem', '6.043125rem']}
        display={'flex'}
        justifyContent={'center'}
        h={['auto', 'auto', '100vh']}
        p={['0 1.25rem', '0 0']}
        pb={['8rem', '0', '0']}
        lineHeight={['0.7', 'auto', 'auto']}
        position="relative"
      >
       
        <Box
          display={['flex']}
          flexDirection={['column']}
          alignItems={['flex-start', 'center']}
        >
          <Heading
            textAlign={['left', 'center', 'center']}
            fontSize={['4xl', '4xl', '6xl', '8xl', '9xl']}
            fontWeight={['800']}
            lineHeight={['2.196875rem', '3.89rem', '4.475625rem']}
            mb={['0.9375rem', '1.375rem']}
            w={['100%', '70%']}
          >
            Hear what our Alumni’s have to say about learning at Perxels
          </Heading>
          <Text
            textAlign={['left', 'center', 'center']}
            maxW={['505px']}
            fontSize={['lg', 'xl']}
            lineHeight={['2.005rem', '1.64rem']}
            color={'brand.dark.200'}
            mb={['1.15rem', '1.5rem']}
          >
            The story of each person that has gone through Perxels really counts
            for something more, and that is why we are intentional about
            collecting and sharing them with you because it&apos;s worth it.
          </Text>

          <Text
            textAlign={['left', 'center', 'center']}
            fontSize={['lg', 'xl', '2xl']}
            lineHeight={['2.005rem', '1.64rem']}
            color={'brand.dark.200'}
            mb={['1rem', '1.375rem']}
            fontWeight="bold"
          >
            Want to create your own story with Perxels?
          </Text>
          <Center>
            <Button>Enroll Now</Button>
          </Center>
          <Box
            display={['block', 'none', 'none']}
            mt={['.5rem']}
            boxSize={['100%', '100%', '100%']}
          >
            <Image src="/assets/images/testimonial/Map.png" alt="Map" />
          </Box>
        </Box>
        <Box
        pos={'absolute'}
        top={ ['61%','20%' ,'20%']}
        left={['16%','10%','10%']}
        >
        <TestimonialTooltip/>
        </Box>
        <Box
        pos={'absolute'}
        top={ ['65%','40%' ,'40%']}
        left={['20%','20%','20%']}
        >
        <TestimonialTooltip/>
        </Box>
        <Box
        pos={'absolute'}
        bottom={ ['27%','20%' ,'20%']}
        left={['75%','40%','28%']}
        >
        <TestimonialTooltip/>
        </Box>
        <Box
        pos={'absolute'}
        bottom={ ['28%','20%' ,'25%']}
        left={['49%','40%','53%']}
        >
        <TestimonialTooltip/>
        </Box>
      
        <Box
        pos={'absolute'}
        bottom={ ['23%','20%' ,'37%']}
        left={['52%','40%','80%']}
        >
        <TestimonialTooltip/>
        </Box>
        <Box
        pos={'absolute'}
        bottom={ ['37%','20%' ,'57%']}
        left={['80%','40%','73%']}
        >
        <TestimonialTooltip/>
        </Box>
      </Box>
    </MainContainer>
  )
}
