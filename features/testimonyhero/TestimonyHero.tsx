import React from 'react'
import {Box, Img, Heading, Text, Button} from '@chakra-ui/react'


export const TestimonyHero = () => {
  return (
    <Box
    mt="3.5625rem"
    mb={["3.04rem", "3.04rem", "6.043125rem"]}
    display={"flex"}
    justifyContent={"center"}
    h={["70vh", '50vh', "90vh"]}
   backgroundImage={"url('/assets/images/testimonial/Map.png')"}
    backgroundRepeat="no-repeat"
    backgroundSize={{base:"contain", lg:"90% 100%"}}
    backgroundPosition={['bottom center', 'top center', 'center center']}
    padding={['0 1.25rem', '0 0']}
    >
    <Box
       display={['flex']}
       flexDirection={['column']}
       alignItems={['flex-start','center']}
          >
        <Heading
        textAlign={['left', 'center', 'center']}
        fontSize={['7xl', '8xl', '9xl']} 
        fontWeight={['800']}
        lineHeight={['3.196875rem', '3.89rem', '4.475625rem']}
        mb={['0.9375rem','1.375rem']}
        w={['100%','70%']}
        >
        Hear what they  say about us.
        </Heading>
        <Text 
        textAlign={['left', 'center', 'center']}
        maxW={['31.5625rem']}
        fontSize={['1.375rem', 'xl']} 
        lineHeight={['2.005rem','1.64rem']}
        color={'brand.dark.200'}
        mb={['0.9375rem','1.375rem']}
        >
        The little stories of each person that has gone through Perxels really counts for something more. And that is why we are intentional about collecting this success story.
        </Text>
        <Button
       
        >
        Write Your Story
        </Button>
    </Box>
    </Box>
  )
}   

