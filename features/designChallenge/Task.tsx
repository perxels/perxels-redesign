import React, { useEffect } from 'react'
import {Box, Center, Image, Text, Heading, Flex, Button, Modal, ModalContent, ModalOverlay, ModalHeader, ModalCloseButton, ModalBody, ModalFooter, useDisclosure} from '@chakra-ui/react'
import {BiDownload} from 'react-icons/bi'
import {MainContainer} from '../../layouts'
import gsap from 'gsap'
import ScrollTrigger from 'gsap/dist/ScrollTrigger'
import Link from 'next/link'
gsap.registerPlugin(ScrollTrigger)

export const Task = () => {
    const {isOpen, onOpen, onClose} = useDisclosure()
    useEffect(() => {
        let ctx = gsap.context(() => {
          gsap.from('.taskGrid', {
            opacity: '0',
            y: 200,
            duration: 1,
            delay: 1,
            scrollTrigger: {
              trigger: '.taskGrid',
            },
          })
        })
        return () => ctx.revert()
    }, [])
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
    
         <Center className="taskGrid">
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
        className="taskGrid"
        >
           JAMB WEBSITE RE-DESIGN
        </Heading>

        <Center
        mt="1.875rem"
        className="taskGrid"
        >
        <Flex
        columnGap={["0.8rem","1.625rem"]}
       w={["full", "100%"]}
       px={["1.0625rem", "0"]}
       justifyContent="center"
        >
            <Link href="/design-challenge/#join">
            <Button
            bgColor={"brand.yellow.500"}
            color={"brand.purple.500"}
            fontSize={[".8425rem","1.125rem"]}
            fontWeight="600"
            height={["2.75rem","57.9px"]}
            
            >
                Join the challenge
            </Button>
            </Link>
            <Button
             bgColor={"transparent"}
             color={"brand.yellow.500"}
             fontSize={[".8425rem","1.125rem"]}
             fontWeight="600"
             height={["2.75rem","57.9px"]}
            border="1.18156px solid #FDE85C"
            leftIcon={<BiDownload size="1.5rem"/>}
            onClick={onOpen}
            >
                Download PRD
            </Button>
        </Flex>
        </Center>

        <Center
        mt="2.5rem"
        className="taskGrid"
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
        {/* text modal */}
        <Modal isOpen={isOpen} onClose={onClose} size="lg">
        <ModalOverlay />
        <ModalContent>
            <ModalHeader>PRD</ModalHeader>
            <ModalCloseButton />
            <ModalBody>
            <Text>
            Thank you for showing interest in the challenge, kindly fill the registration form.
            An email containing the PRD will be sent to you shortly.
            </Text>
            </ModalBody>
            <ModalFooter>
            <Button colorScheme="blue" mr={3} onClick={onClose}>
                Close
            </Button>
            </ModalFooter>
        </ModalContent>
        </Modal>
    </Box>
  )
}
