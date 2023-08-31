import React from 'react'
import {Flex, Box, Text, Image, VStack, HStack, SimpleGrid, Button, Heading} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
export const LocateHub = () => {
  return (
    <MainContainer>
        <Flex flexDir="column">
            <Heading>
            LOCATE US
            </Heading>

            <Text>
            Perxels is here to help you;
            </Text>
            <Text>
            Our experts are available to answer any questions you might have. We’ve got the answers.
            </Text>
            <Text>
            Triangle Business Mall, Osapa London,Lekki, Lagos.
            </Text>
            <Text>
            Feel free to get in touch with us through our channels: 
            </Text>
            <Flex>
                <Box>
                    <Text>
                    Email US
                    </Text>
                    <Text>
                    perxels@gmail.com
                    </Text>
                </Box>
                <Box>
                    <Text>
                    Call us
                    </Text>
                    <Text>
                    perxels@gmail.com
                    </Text>
                </Box>
            </Flex>
            <Box>
                <Image src="/assets/images/hub/locationImage.png" alt="locate" />
            </Box>
        </Flex>
    </MainContainer>
  )
}
