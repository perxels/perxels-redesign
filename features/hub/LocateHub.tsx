import React from 'react'
import {Flex, Box, Text, Image, VStack, HStack, SimpleGrid, Button, Heading} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
export const LocateHub = () => {
  return (
    <MainContainer>
        <Flex justifyContent="space-between" flexDir={["column", "row"]} py="6rem" rowGap="2.5rem">
        <Flex flexDir="column" w={["100%","45%"]}>
            <Heading fontSize={["1.875rem","3rem"]} color="#333" fontWeight="400" mb={[".9375rem","2.25rem"]} >
            LOCATE US
            </Heading>

            <Text fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555">
            Perxels is here to help you;
            </Text>
            <Text fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555">
            Our experts are available to answer any questions you might have. We’ve got the answers.
            </Text>
            <Heading fontWeight="400" fontSize={["1.25rem","1.5625rem" ]}lineHeight="2.1875rem" color="#34296B" mt={"1.9375rem"} w={["100%","80%"]}>
            Triangle Business Mall, Osapa London, Lekki, Lagos.
            </Heading>
            <Text  fontSize={["1.25rem","1.375rem"]} lineHeight={["2.1875rem","2.1875rem"]} color="#555" mt="1.9375rem">
            Feel free to get in touch with us through our channels: 
            </Text>
            <Flex mt="3.125rem" columnGap="3.125rem" flexDir={["column", "row"]} rowGap="1.875rem">
                <Box>
                    <Text color="#1A191A" fontSize={["1.875rem","2.1875rem"]} fontWeight="400" textTransform="uppercase">
                    Email US
                    </Text>
                    <Text fontSize={["1.25rem","1.375rem"]} fontWeight="400" lineHeight="2.1875rem" color="#121212" >
                    perxels@gmail.com
                    </Text>
                </Box>
                <Box>
                    <Text color="#1A191A" fontSize="2.1875rem" fontWeight="400" textTransform="uppercase">
                    Call us
                    </Text>
                    <Text fontSize={["1.25rem","1.375rem"]} fontWeight="400" lineHeight="2.1875rem" color="#121212" >
                    08135369680
                    </Text>
                </Box>
            </Flex>
            
            </Flex>
            <Box>
                <Image src="/assets/images/hub/locationImage.png" alt="locate" />
            </Box>
        </Flex>
    </MainContainer>
  )
}
