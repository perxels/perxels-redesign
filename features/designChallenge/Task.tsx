import React from 'react'
import {Box, Center, Image, Text, Heading, Flex, Button} from '@chakra-ui/react'
import {BiDownload} from 'react-icons/bi'
import {MainContainer} from '../../layouts'

export const Task = () => {
  return (
    <Box
        bgColor={"brand.purple.500"}
        bgImage={"url('/assets/images/designChallenge/graphbg.svg')"}
        // h="100vh"
        boxSizing='border-box'
        position="relative"
        pt="7rem"
        pb="10rem"
     
    >
    
         <Center>
        <Box
            bg="#E3719C"
            borderRadius={"30px"}
            padding={"1rem 1.5625rem"}
            display="flex"
            columnGap={"1rem"}
            alignItems="center"
            >
                
                <Image src="assets/icons/badgeWhite.svg" alt=""/>
                <Text
                fontSize={[".9081rem","1.125rem"]}
                fontWeight="700"
                color="#FFF"
                >
              THE TASK
                </Text>
        </Box>
        </Center>
        <Heading
        textAlign="center"
        fontSize="50px"
        lineHeight={"60.9px"}
        color="#FFF"
        mt="20px"
        >
           JAMB WEBSITE RE-DESIGN
        </Heading>

        <Center
        mt="1.875rem"
     
        >
        <Flex
        columnGap={["0.8rem","1.625rem"]}
       w={["full", "100%"]}
       px={["1.0625rem", "0"]}
       justifyContent="center"
        >
            <Button
            bgColor={"brand.yellow.500"}
            color={"brand.purple.500"}
            fontSize={[".8425rem","1.125rem"]}
            fontWeight="600"
            height={["2.75rem","57.9px"]}
            
            >
                Join the challenge
            </Button>
            <Button
             bgColor={"transparent"}
             color={"brand.yellow.500"}
             fontSize={[".8425rem","1.125rem"]}
             fontWeight="600"
             height={["2.75rem","57.9px"]}
            border="1.18156px solid #FDE85C"
            leftIcon={<BiDownload size="1.5rem"/>}

            >
                Download PRO
            </Button>
        </Flex>
        </Center>

        <Center
        mt="2.5rem"
        >
            <Box
            w={["100%","23.75rem"]}
            height="auto"
            px={["2rem", "0"]}
            >
            <Image src="/assets/images/designChallenge/trophyTask.png" alt="taskImage" />
            </Box>
        </Center>
        <Box
        position="absolute"
        bottom="0"
        transform={"translateX(0%) translateY(30.5%)"}
        >
            <Image src="/assets/images/designChallenge/taskBottomBorder.png" alt="" />
        </Box>
    </Box>
  )
}
