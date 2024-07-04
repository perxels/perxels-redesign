import { useRef } from 'react'
import { Box, Flex, Text, Image, ModalHeader, ModalCloseButton, Button, Modal, ModalOverlay, ModalContent, useDisclosure, ModalBody, FormControl, FormLabel, Input, ModalFooter } from "@chakra-ui/react"
import { MainContainer } from '../../layouts'
import {HeroText} from './HeroText'
export const HeroBook = () => {
    const { isOpen, onOpen, onClose } = useDisclosure()

    const initialRef = useRef<HTMLInputElement>(null)
    const finalRef = useRef<HTMLInputElement>(null)
    return (
        <Box
        mb="60px"
        id="book"
        >
        <MainContainer>
            <Box
                px={["5%", "3%"]}
                pt={["2.75rem","97px"]}
                pb={["2.0625rem", "5%"]}
                backgroundColor="#34296B"
                rounded="2.5rem"
                position="relative"
                height="100%"
                overflow="hidden"
            >
                <Box
                position="absolute"
                zIndex={1}
                top="0"
                left="0"
                height="100%"
                width="auto"
                >
                    <Image objectFit="cover" width="100%" height="100%" src="/assets/images/book/bookBg.png" alt="" />
                </Box>

                <Flex
                    justifyContent="space-between"
                    alignItems={["center"]}
                    flexDir={["column", 'row']}
                    rowGap="2.25rem"
                    pos="relative"
                    zIndex={2}
                >
                    <Box
                        w={["100%", "100%"]}
                        display="flex"
                        flexDir={"column"}
                        alignItems={["flex-start"]}
                    >
                        <HeroText/>
                        <Text
                            w={["100%", "70%"]}
                            fontWeight="300"
                            fontSize={["1.25rem", "1.1687rem"]}
                            lineHeight={["1.4825rem", "2.125rem"]}
                            letterSpacing="-3.5%"
                            color="#FFFFFF"
                            mt={["1.5625rem", "1.875rem"]}
                            textAlign={['left', 'left']}
                            fontFamily='Montserrat'
                        >
                            This ebook contains all the nitty gritty details about transitioning into the UIUX Design industry. It is a must have guide that explains all you need to know about the industry
                        </Text>

                        <Box
                            mt={["2.25rem", "1.5rem"]}
                            display={["none", "block"]}
                        >
                            <Button
                                borderRadius="0"
                                border=".0625rem solid #363576"
                                background="#FEDA00"
                                rightIcon={<Image src="/assets/icons/arrowBook.svg" alt="" />}
                                fontSize={["1.2806rem", "1.1719rem"]}
                                iconSpacing="1rem"
                                padding={["1.125rem", "1rem"]}
                                boxShadow="-0.75rem .6875rem .0625rem -0.1875rem #FFFFFF"
                                onClick={onOpen}
                                fontWeight="400"
                                
                            >
                                <Text color="#363576" fontFamily="Monument Extended">
                                    Download Now
                                </Text>
                            </Button>
                        </Box>
                    </Box>
                    <Box w={["80%", "40%"]}>
                        <Image src="/assets/images/book/heroImage.png" alt="" />
                    </Box>
                    <Box
                            display={["block", "none"]}
                            
                        >
                            <Button
                                borderRadius="0"
                                border=".0625rem solid #363576"
                                background="#FEDA00"
                                rightIcon={<Image src="/assets/icons/arrowBook.svg" alt="" />}
                                fontSize={["1.1544rem", "1.1719rem"]}
                                iconSpacing="1rem"
                                padding={["1.125rem", "1rem"]}
                                boxShadow="-0.75rem .6875rem .0625rem -0.1875rem #FFFFFF"
                                onClick={onOpen}
                                fontWeight="400"
                                
                            >
                                <Text color="#363576" fontFamily="Monument Extended">
                                    Download Now
                                </Text>
                            </Button>
                    </Box>
                    <Modal
                        initialFocusRef={initialRef}
                        finalFocusRef={finalRef}
                        isOpen={isOpen}
                        onClose={onClose}
                    >
                        <ModalOverlay />
                        <ModalContent>
                            <ModalHeader>Signup to Download</ModalHeader>
                            <ModalCloseButton />
                            <ModalBody pb={6}>
                                <FormControl>
                                    <FormLabel>Full Name</FormLabel>
                                    <Input ref={initialRef} placeholder='Full name' />
                                </FormControl>

                                <FormControl mt={4}>
                                    <FormLabel>Email</FormLabel>
                                    <Input placeholder='email address' />
                                </FormControl>
                            </ModalBody>

                            <ModalFooter>
                                <Button colorScheme='blue' mr={3}>
                                    Download
                                </Button>
                                <Button onClick={onClose}>Cancel</Button>
                            </ModalFooter>
                        </ModalContent>
                    </Modal>
                </Flex>
            </Box>
        </MainContainer>
        </Box>
    )
}
