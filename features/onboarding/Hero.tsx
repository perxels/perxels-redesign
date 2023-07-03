import React from 'react'
import {Box, Text, Heading, Center, Button, Image} from '@chakra-ui/react'
import { Logo } from '../../components'
import Link from 'next/link'
export const Hero = () => {
  return (
    <Box
    bg="#EFECFF"
    height={["100%","100vh"]}
    pos="relative"
    >
             <Box as={Link} href="/" pos={["relative","absolute"]} top="2.125rem" left={["1.3rem","3.25rem"]} display={['block']} mb="4rem" pt="1rem" >
        <Logo  />
      </Box>
             <Center height={["100%","80vh"]} flexDir="column"  pos="relative" alignItems={["flex-start", "center"]} pl="2rem">
                    <Heading fontSize={["3.125rem","96px"]} lineHeight={["2.9312rem","5.6563rem"]} textAlign={["left","center" ]}width="70%">
                    PERXELS <br/> DESIGN SCHOOL
                    </Heading>
                    <Text fontSize={["1.25rem","1.875rem" ]}textAlign={["left", "center"]} mt={["1rem","1.4375rem"]} fontWeight="400" >
                    We’re so happy to have you here at Perxels
                    </Text>
                    <Button bg="#E35371" rounded="5px" mt={["22px","2.375rem"]}>
                    Get Onboarded
                    </Button>
            </Center>   
            <Box display={["block", "none"]}>
                <Image src="/assets/images/onboarding/femaleMobile.png" alt="" pos="relative" bottom="0" left="0" />
            </Box> 

            <Box display={["none", "block"]}>
                <Image src="/assets/images/onboarding/femaleRight.png" alt="" pos="absolute" bottom="0" right="0" />
            </Box>
            <Box display={["none", "block"]}>
                <Image src="/assets/images/onboarding/femaleLeft.png" alt="" pos="absolute" bottom="0" left="0" />
            </Box>
    
    </Box>
  )
}
