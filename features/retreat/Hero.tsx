import React from 'react'
import {Box, Heading, Text, Image, Center} from '@chakra-ui/react'

export const Hero = () => {
  return (
    <Box
    display="flex"
    flexDirection="column"
    justifyContent={["flex-start","center"]}
    alignItems={["flex-start","center"]}
    py={["3rem","5.625rem"]}
    px={["1.375rem"]}
    >
        <Center backgroundColor="#DEDAF1" display="inline-flex" px="29px" py="14px" rounded="31.25rem">
            <Text color="#34296B" fontSize="12px" fontWeight="700">
            PERXELS ALUMNI RETREAT 2.0
            </Text>
        </Center>
        <Heading
        fontSize={["1.875rem","4.375rem"]}
        fontWeight="900"
        textAlign={["left","center"]}
        w={["80%","70%"]}
        fontFamily="Montserrat"
        mt={["1.375rem"]}
        >
        Navigating the UIUX Job Market in 2024
        </Heading>
        <Box mt={["3.25rem","4.375rem"]} display="flex" justifyContent="space-between" alignItems="flex-end" columnGap="60px">
            <Image height="90%" src="assets/images/retreat/image1.png" alt="retreat1" display={["none", "block"]} />
            <Image src="assets/images/retreat/image2.png" alt="retreat2" />
            <Image height="90%" src="assets/images/retreat/image3.png" alt="retreat3" display={["none", "block"]} />
        </Box>
    </Box>
  )
}
