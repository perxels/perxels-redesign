import React from 'react'
import {Box, SimpleGrid, Text, Heading, Image, Button, Center} from '@chakra-ui/react'
import {RefClassBox} from './RefClassBox'
import {ReferHeader} from './ReferHeader'
export const RefClass = () => {
  return (
    <Box background="#34296B" pos="relative">
            <ReferHeader title="CLASS GROUPS" subtitle="The Classes you can refer people to" color="#FFFFFF"/>
            <Box pos="absolute" 
            transform="translate(-50%, -50%)"
            top={["10%","20%"]}
            left={["50%","50%"]}
            display={["none","block"]}
            >
                <Text fontSize={["0.7rem","1rem"]}  color="#FFF" textAlign="center">
                The class groups at Perxels have been meticulously crafted to cater to individual unique learning needs and current skill level in UIUX design.
                </Text>
            </Box>
    <Box  px="5%" py="5%">
            <SimpleGrid columns={[1,3]} spacing={10}>
            <RefClassBox title="Basic" text="To learn the fundamentals of UIUX design" earnings="Earn ₦4,000" image="/assets/images/referral/referImage1.png" />
            <RefClassBox title="Advanced" text="To expand your knowledge and build your UX design skills" earnings="Earn ₦7,000" image="/assets/images/referral/referImage2.png"/>
            <RefClassBox title="Premium" text="Special training to guide through everything they need to know in UIUX design from scratch to finish" earnings="Earn ₦20,000" image="/assets/images/referral/referImage3.png"/>
            </SimpleGrid>
    </Box>
    </Box>
  )
}
