import React from 'react'
import {Box, Heading, Text} from '@chakra-ui/react'
export const TermsHero = () => {
  return (
    <Box
    height="80vh"
    width="100%"
    margin={"0 auto"}
    display="flex"
    flexDirection="column"
    justifyContent="center"
    alignItems={["flex-start","center"]}
    background="rgba(246, 247, 253, 0.97)"
    px="5%"
    >
        <Heading
        fontSize="50px"
        lineHeight="3.75rem"
        >
        Terms And Conditions
        </Heading>
        <Text
        mt="3.125rem"
        >
        Kindly read these terms and conditions carefully before using the service
        </Text>
    </Box>
  )
}
