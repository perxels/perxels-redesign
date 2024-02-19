import React from 'react'
import { Box, Heading, Text, Image, Flex, Button } from '@chakra-ui/react'
import { BiChevronRightCircle } from "react-icons/bi";

export const LibraryAd = () => {
  return (
    <Box
    my={["82px","5%"]}
    >
        <Box>
            <Text fontSize={["16px","18px"]} color="#1A1A1A" mb={["24px"]} >
            ADVERTISMENT
            </Text>
        </Box>
      <Box
        background="url('./assets/images/library/libraryAd.png') no-repeat center center"
        height={["262px","345px"]}
        backgroundSize="cover"
        padding={["0 5%","0 5%"]}
        borderRadius={"8px"}
      >
        <Flex 
        h="100%"  
        flexDir="column" 
        justifyContent="center"
       
        >
          <Heading 
          as="h1" 
          fontSize={["22px","32px" ]}
          color="#FFF" 
          textAlign="left"
          fontWeight={700}
          lineHeight="102.3%"
          width={["100%","60%"]}
          >
            Embark on a Learning Journey with Our Premium Courses!
          </Heading>
          <Text
          fontSize={["12px","16px"]}
          fontWeight={"400"}
          color="#FFF"
          lineHeight={"138%"}
          width={["100%","70%"]}
          >
            Ready to take your knowledge to new heights? Unleash your potential
            with our premium paid courses designed to empower and transform.
          </Text>
          <Button width={["50%","30%"]} height={["46px", "64px"]} color="#34296B" background="#FDE85C" size="lg" mt="24px"
          rightIcon={<BiChevronRightCircle size="24px" color="#34296B" />}
          >
          Enroll now
        </Button>
        </Flex>
      </Box>
    </Box>
  )
}
