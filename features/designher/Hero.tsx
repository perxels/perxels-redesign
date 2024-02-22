import React from 'react'
import {Box, Heading, Text, Button, Image,Center,Flex} from '@chakra-ui/react'
import {MainContainer} from '../../layouts'
export const Hero = () => {
  return (
    <MainContainer>
        <Flex 
        flexDir={["column", "row"]}
        alignItems={["flex-start","center"]} 
        pt="5%" 
        pb="5%"
        rowGap="2.5rem"
        justifyContent="space-between"
       
    >
            <Box width={["100%","60%"]}>
            <Center p={["8px 7px","12px 11px"]} display="inline-flex" bg="#FDE85C" rounded="10px" mb="16px">
                <Text fontSize={["12px","18px"]} fontWeight="700" color="#282828">
                INTERNATIONAL WOMEN’S DAY
                </Text>
            </Center>
            <Heading width={["100%","100%"]} fontSize={["3.5rem","97px"]} lineHeight="100%" fontWeight="800" mb={["16px","40px"]}>
            DesignHER<br/>
            Future.
            </Heading>
            <Box
            borderLeft="5px solid #FEDA00"
            pl="24px"
            mb={["24px","40px"]}
            >
                <Text fontSize={["16px","20px"]} lineHeight="150%" color="#1A1A1A" width={["80%","45%"]} >
                I&apos;m Fiwa and I am championing diversity. Let&apos;s all inspire inclusion to help forge a better, more inclusive world for women.
                </Text>
            </Box>
            <Button 
            as={'a'}
            href="/wdb#register"
            fontSize="15px">
                Register
            </Button>
            </Box>
            <Box width={["100%","40%"]}>
                <Image src="/assets/images/designher/heroImage.png" alt="DesignHER" />
            </Box>
        </Flex>

    </MainContainer>
  )
}
