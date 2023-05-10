import React from 'react'
import {Box, Flex, Text, Heading, Image, Button} from '@chakra-ui/react'
export const ReferQuestions = () => {
  return (
   <Box
   px={["5%","10%"]}
   py="5%"
   >
        <Flex
        background="#F6F4FF"
        p={["2rem","3.75rem 5rem"]}
        columnGap="2.1875rem"
        alignItems="center"
        flexDir={["column", "column", "column", "row"]}
        rowGap={["2rem","2rem","2rem","0"]}
        >
            <Box>
            <Image src="/assets/images/referral/refQuestionImage.png" alt="" />
            </Box>
            <Box>
                <Text fontSize={["1.2rem","1.5625rem"]} lineHeight={["1.5rem","2.2188rem"]}>
                If you have questions, send a whatsapp message to our team, 08135369680
                </Text>
                <Image src="/assets/images/referral/whatsapp.svg" alt="" />
            </Box>
        </Flex>
   </Box>
  )
}
