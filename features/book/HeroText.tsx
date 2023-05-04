import React from 'react'
import { Box, Text, Image, Flex, SimpleGrid, Heading } from '@chakra-ui/react'
export const HeroText = () => {
    return (
        <>
            <Box
            display={["none", "block"]}
            >
                <Heading
                    fontFamily="Monument Extended"
                    fontSize={["26px", "3.125rem"]}
                    lineHeight={["2.5263rem", "4.1675rem"]}
                    color="#FFFFFF"
                    fontWeight="400"
                    letterSpacing="-3.5%"
                    textAlign={["left", "left"]}
                >
                    Thinking of A {" "}
                    <Heading pl={["1rem", "2rem"]} pr="1rem" position="relative" fontSize={["26px", "3rem"]} color="#FDE85C" lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" as="span" fontWeight="800">
                        <Image width={["12.8425rem", "23.875rem"]} right="0" height={["4.2219rem", "6.9463rem"]} top={["-0.9375rem", "-1.625rem"]} position="absolute" src="/assets/images/book/ribbon.png" alt=""
                        />
                        Career
                    </Heading>
                </Heading>
                <Heading fontSize={["26px", "3.2rem"]} color="#FFFFFF" textAlign={["left", "left"]} lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" fontWeight="400"
                    letterSpacing="-3.5%">

                    <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" as="span" letterSpacing="-3.5%" fontWeight="400">
                        In UIUX  Design?
                    </Heading>
                </Heading>
              
                <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.2263rem", "4.1675rem"]} fontWeight="400" letterSpacing="-3.5%" fontFamily="Monument Extended" textAlign={["left", "left"]}>
                    The Perfect Guide Is
                </Heading>
                <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.2263rem", "4.1675rem"]} fontWeight="400" letterSpacing="-3.5%" fontFamily="Monument Extended" textAlign={["left", "left"]}>
                    Here
                </Heading>
            </Box>
            <Box  display={["block", "none"]}>
                <Heading
                    fontFamily="Monument Extended"
                    fontSize={["26px", "3.125rem"]}
                    lineHeight={["2.5263rem", "4.1675rem"]}
                    color="#FFFFFF"
                    fontWeight="400"
                    letterSpacing="-3.5%"
                    textAlign={["left", "left"]}
                >
                    Thinking of A {" "}
                   
                </Heading>
                <Heading fontSize={["26px", "3.2rem"]} color="#FFFFFF" textAlign={["left", "left"]} lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" fontWeight="400"
                    letterSpacing="-3.5%">
                         <Heading pl={["1rem", "2rem"]} pr="1rem" position="relative" fontSize={["26px", "3rem"]} color="#FDE85C" lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" as="span" fontWeight="800">
                        <Image width={["12.8425rem", "23.875rem"]} left="0" height={["4.2219rem", "6.9463rem"]} top={["-1.2rem", "-1.625rem"]} position="absolute" src="/assets/images/book/ribbon.png" alt=""
                        />
                        Career
                    </Heading>
                    <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.5263rem", "4.1675rem"]} fontFamily="Monument Extended" as="span" letterSpacing="-3.5%" fontWeight="400">
                        In UIUX 
                    </Heading>
                </Heading>
                <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.2263rem", "4.1675rem"]} fontWeight="400" letterSpacing="-3.5%" fontFamily="Monument Extended" textAlign={["left", "left"]}>
                Design?
                </Heading>
                <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.2263rem", "4.1675rem"]} fontWeight="400" letterSpacing="-3.5%" fontFamily="Monument Extended" textAlign={["left", "left"]}>
                    The Perfect Guide 
                </Heading>
                <Heading fontSize={["26px", "3.125rem"]} color="#FFFFFF" lineHeight={["2.2263rem", "4.1675rem"]} fontWeight="400" letterSpacing="-3.5%" fontFamily="Monument Extended" textAlign={["left", "left"]}>
                    Is Here
                </Heading>
            </Box>
        </>
    )
}
